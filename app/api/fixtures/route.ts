import { NextResponse } from 'next/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchState = 'live' | 'halftime' | 'result' | 'upcoming'

export interface MatchInfo {
  state: MatchState
  homeTeam: string
  awayTeam: string
  homeTeamCrest: string
  awayTeamCrest: string
  homeScore: number | null
  awayScore: number | null
  minute: string | null
  date: string
  time: string
  competition: string
  venue: string
}

// ─── ESPN API helpers ─────────────────────────────────────────────────────────

const ARSENAL_ABBREVIATIONS = new Set(['ARS', 'AFC', 'ARSENAL'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArsenal(team: any): boolean {
  const name: string = team?.displayName ?? team?.name ?? ''
  const abbr: string = (team?.abbreviation ?? '').toUpperCase()
  return name.toLowerCase().includes('arsenal') || ARSENAL_ABBREVIATIONS.has(abbr)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseESPNEvent(event: any, leagueName: string): MatchInfo | null {
  try {
    const comp = event.competitions?.[0]
    if (!comp) return null

    const home = comp.competitors?.find((c: any) => c.homeAway === 'home')
    const away = comp.competitors?.find((c: any) => c.homeAway === 'away')
    if (!home || !away) return null

    const statusType = comp.status?.type ?? {}
    const statusName: string = statusType.name ?? ''
    const statusState: string = statusType.state ?? 'pre'   // pre | in | post

    let state: MatchState = 'upcoming'
    if (statusState === 'in') {
      state = statusName === 'STATUS_HALFTIME' ? 'halftime' : 'live'
    } else if (statusState === 'post') {
      state = 'result'
    }

    const matchDate = new Date(comp.date ?? event.date)

    return {
      state,
      homeTeam: home.team?.displayName ?? home.team?.name ?? '',
      awayTeam: away.team?.displayName ?? away.team?.name ?? '',
      homeTeamCrest: home.team?.logo ?? '',
      awayTeamCrest: away.team?.logo ?? '',
      homeScore: state !== 'upcoming' ? parseInt(home.score ?? '0', 10) : null,
      awayScore: state !== 'upcoming' ? parseInt(away.score ?? '0', 10) : null,
      minute: state === 'live' ? (statusType.shortDetail ?? null) : null,
      date: matchDate.toISOString().split('T')[0],
      time: matchDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }),
      competition: leagueName,
      venue: comp.venue?.fullName ?? 'TBC',
    }
  } catch {
    return null
  }
}

// Leagues to scan for Arsenal (in priority order)
const ESPN_LEAGUES = [
  { slug: 'uefa.champions_league', name: 'UEFA Champions League' },
  { slug: 'eng.1',                 name: 'Premier League'        },
  { slug: 'eng.fa_cup',            name: 'FA Cup'                },
  { slug: 'eng.league_cup',        name: 'EFL Cup'               },
  { slug: 'uefa.europa_league',    name: 'UEFA Europa League'    },
]

function toESPNDateStr(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`
}

/**
 * Check multiple league scoreboards for an Arsenal match.
 * Searches both today AND yesterday in UTC so a late-night match (e.g. 20:00 CET
 * = 18:00 UTC) is still found after midnight UTC when the user is still in the
 * 8-hour result window.
 */
async function getArsenalMatchToday(): Promise<MatchInfo | null> {
  const now = new Date()
  const dates = [toESPNDateStr(now), toESPNDateStr(new Date(now.getTime() - 86_400_000))]

  for (const dateStr of dates) {
    for (const league of ESPN_LEAGUES) {
      try {
        const res = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.slug}/scoreboard?dates=${dateStr}`,
          { next: { revalidate: 60 } }
        )
        if (!res.ok) continue
        const data = await res.json()
        const leagueName: string = data.leagues?.[0]?.name ?? league.name

        for (const event of data.events ?? []) {
          const comp = event.competitions?.[0]
          const hasArsenal = comp?.competitors?.some((c: any) => isArsenal(c.team))
          if (!hasArsenal) continue

          const info = parseESPNEvent(event, leagueName)
          if (!info) continue

          if (info.state === 'live' || info.state === 'halftime') return info
          if (info.state === 'result') {
            // Use the raw event date for an accurate elapsed-time check
            const kickoff = new Date(comp?.date ?? event.date)
            const hoursSince = (Date.now() - kickoff.getTime()) / 3_600_000
            if (hoursSince < 8) return info
          }
        }
      } catch {
        continue
      }
    }
  }
  return null
}

/** Fetch next upcoming Arsenal PL fixtures from ESPN team schedule */
async function getUpcomingESPN(): Promise<MatchInfo[]> {
  try {
    const res = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams/359/schedule',
      { next: { revalidate: 1800 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const now = Date.now()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.events ?? [] as any[])
      .filter((e: any) => {
        const state = e.competitions?.[0]?.status?.type?.state
        const d = new Date(e.competitions?.[0]?.date ?? e.date).getTime()
        return state === 'pre' && d > now
      })
      .slice(0, 6)
      .map((e: any) => parseESPNEvent(e, 'Premier League'))
      .filter(Boolean) as MatchInfo[]
  } catch {
    return []
  }
}

// ─── football-data.org helper (used when API key is set) ─────────────────────

const ARSENAL_ID = 57

async function getFDOFixtures(apiKey: string): Promise<{ current: MatchInfo | null; upcoming: MatchInfo[] }> {
  try {
    // Today's matches (any status) + next 6 scheduled
    const today = new Date().toISOString().split('T')[0]
    const [todayRes, scheduledRes] = await Promise.all([
      fetch(`https://api.football-data.org/v4/teams/${ARSENAL_ID}/matches?dateFrom=${today}&dateTo=${today}`, {
        headers: { 'X-Auth-Token': apiKey },
        next: { revalidate: 60 },
      }),
      fetch(`https://api.football-data.org/v4/teams/${ARSENAL_ID}/matches?status=SCHEDULED&limit=6`, {
        headers: { 'X-Auth-Token': apiKey },
        next: { revalidate: 1800 },
      }),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toMatchInfo = (m: any, state: MatchState): MatchInfo => {
      const d = new Date(m.utcDate)
      return {
        state,
        homeTeam: m.homeTeam.shortName ?? m.homeTeam.name,
        awayTeam: m.awayTeam.shortName ?? m.awayTeam.name,
        homeTeamCrest: m.homeTeam.crest,
        awayTeamCrest: m.awayTeam.crest,
        homeScore: state !== 'upcoming' ? (m.score?.fullTime?.home ?? null) : null,
        awayScore: state !== 'upcoming' ? (m.score?.fullTime?.away ?? null) : null,
        minute: state === 'live' ? `${m.minute ?? ''}` : null,
        date: d.toISOString().split('T')[0],
        time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
        competition: m.competition.name,
        venue: m.venue ?? 'TBC',
      }
    }

    let current: MatchInfo | null = null
    if (todayRes.ok) {
      const td = await todayRes.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const m of td.matches ?? [] as any[]) {
        if (m.status === 'IN_PLAY' || m.status === 'PAUSED') {
          current = toMatchInfo(m, m.status === 'PAUSED' ? 'halftime' : 'live')
          break
        }
        if (m.status === 'FINISHED') {
          current = toMatchInfo(m, 'result')
        }
      }
    }

    let upcoming: MatchInfo[] = []
    if (scheduledRes.ok) {
      const sd = await scheduledRes.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      upcoming = (sd.matches ?? [] as any[]).map((m: any) => toMatchInfo(m, 'upcoming'))
    }

    return { current, upcoming }
  } catch {
    return { current: null, upcoming: [] }
  }
}

// ─── Hardcoded fallback ────────────────────────────────────────────────────────

const FALLBACK: MatchInfo[] = [
  {
    state: 'upcoming',
    homeTeam: 'Arsenal', awayTeam: 'Fulham',
    homeTeamCrest: 'https://crests.football-data.org/57.png',
    awayTeamCrest: 'https://crests.football-data.org/63.png',
    homeScore: null, awayScore: null, minute: null,
    date: '2026-05-02', time: '15:00',
    competition: 'Premier League', venue: 'Emirates Stadium',
  },
  {
    state: 'upcoming',
    homeTeam: 'Arsenal', awayTeam: 'Atlético Madrid',
    homeTeamCrest: 'https://crests.football-data.org/57.png',
    awayTeamCrest: 'https://crests.football-data.org/78.png',
    homeScore: null, awayScore: null, minute: null,
    date: '2026-05-05', time: '20:00',
    competition: 'UEFA Champions League', venue: 'Emirates Stadium',
  },
  {
    state: 'upcoming',
    homeTeam: 'West Ham', awayTeam: 'Arsenal',
    homeTeamCrest: 'https://crests.football-data.org/563.png',
    awayTeamCrest: 'https://crests.football-data.org/57.png',
    homeScore: null, awayScore: null, minute: null,
    date: '2026-05-10', time: '14:00',
    competition: 'Premier League', venue: 'London Stadium',
  },
]

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function GET() {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY

  // 1. football-data.org (most accurate when key is set)
  if (apiKey) {
    const { current, upcoming } = await getFDOFixtures(apiKey)
    return NextResponse.json({
      current: current ?? upcoming[0] ?? FALLBACK[0],
      fixtures: upcoming.length ? upcoming : FALLBACK,
      source: 'football-data',
    })
  }

  // 2. ESPN (free, no key required)
  const [todayMatch, upcomingESPN] = await Promise.all([
    getArsenalMatchToday(),
    getUpcomingESPN(),
  ])

  const fixtures = upcomingESPN.length ? upcomingESPN : FALLBACK
  const current = todayMatch ?? fixtures[0]

  return NextResponse.json({
    current,
    fixtures,
    source: todayMatch ? 'espn-live' : upcomingESPN.length ? 'espn' : 'fallback',
  })
}
