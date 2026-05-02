import { NextResponse } from 'next/server'

// Bukayo Saka's player ID on football-data.org
const SAKA_PLAYER_ID = 7800
const PL_COMPETITION = 'PL'

interface ScorerEntry {
  player: { id: number; name: string }
  team: { id: number; name: string }
  goals: number | null
  assists: number | null
  playedMatches: number | null
  penalties: number | null
}

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY

  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${PL_COMPETITION}/scorers?limit=100`,
        {
          headers: { 'X-Auth-Token': apiKey },
          next: { revalidate: 3600 },
        }
      )

      if (res.ok) {
        const data = await res.json()
        const sakaEntry: ScorerEntry | undefined = data.scorers?.find(
          (s: ScorerEntry) => s.player.id === SAKA_PLAYER_ID
        )

        if (sakaEntry) {
          const goals = sakaEntry.goals ?? 0
          const assists = sakaEntry.assists ?? 0
          const matches = sakaEntry.playedMatches ?? 0

          const seasonLabel =
            data.season?.startDate && data.season?.endDate
              ? `${data.season.startDate.substring(2, 4)}/${data.season.endDate.substring(2, 4)}`
              : '24/25'

          return NextResponse.json({
            source: 'live',
            season: seasonLabel,
            stats: {
              plGoals: goals,
              plAssists: assists,
              plMatches: matches,
              plPenalties: sakaEntry.penalties ?? 0,
              goalInvolvements: goals + assists,
            },
          })
        }
      }
    } catch {
      // fall through to fallback
    }
  }

  // Fallback — verified PL season stats, kept reasonably current
  return NextResponse.json({
    source: 'fallback',
    season: '24/25',
    stats: {
      plGoals: 9,
      plAssists: 11,
      plMatches: 21,
      plPenalties: 1,
      goalInvolvements: 20,
    },
  })
}
