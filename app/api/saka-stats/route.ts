import { NextResponse } from 'next/server'

// Career totals through end of 2023/24 season — add current-season data on top
const BASELINE = {
  plGoals:          41,
  plAssists:        53,
  arsGoals:         71,
  arsAssists:       50,
  engCaps:          58,
  engGoals:         15,
  engAssists:       17,
}

async function fetchFPL() {
  const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
    next: { revalidate: 21600 }, // 6-hour ISR cache
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })
  if (!res.ok) throw new Error(`FPL ${res.status}`)
  const data = await res.json()
  const saka = (data.elements as Record<string, unknown>[]).find(
    (p) => p.first_name === 'Bukayo' && p.second_name === 'Saka'
  )
  if (!saka) throw new Error('Saka not found')
  return {
    goals:    Number(saka.goals_scored ?? 0),
    assists:  Number(saka.assists      ?? 0),
    minutes:  Number(saka.minutes      ?? 0),
  }
}

export const revalidate = 21600

export async function GET() {
  try {
    const { goals, assists, minutes } = await fetchFPL()
    const apps = Math.round(minutes / 80)

    const plGoals        = BASELINE.plGoals     + goals
    const plAssists      = BASELINE.plAssists   + assists
    const arsGoals       = BASELINE.arsGoals    + goals
    const arsAssists     = BASELINE.arsAssists  + assists

    return NextResponse.json({
      source: 'live',
      current: { goals, assists, appearances: apps },
      career: {
        plGoals,
        plAssists,
        arsGoals,
        arsAssists,
        goalInvolvements: arsGoals + arsAssists,
        shirt: 7,
        engCaps:     BASELINE.engCaps,
        engGoals:    BASELINE.engGoals,
        engAssists:  BASELINE.engAssists,
        engGA:       BASELINE.engGoals + BASELINE.engAssists,
      },
    })
  } catch {
    // Static fallback — stays accurate even if FPL is unreachable
    return NextResponse.json({
      source: 'fallback',
      career: {
        plGoals:          50,
        plAssists:        64,
        arsGoals:         83,
        arsAssists:       64,
        goalInvolvements: 147,
        shirt:            7,
        engCaps:          63,
        engGoals:         16,
        engAssists:       17,
        engGA:            33,
      },
    })
  }
}
