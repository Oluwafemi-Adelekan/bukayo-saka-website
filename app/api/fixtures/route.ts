import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// ─── API credentials ────────────────────────────────────────────────────────
const RAPIDAPI_KEY = '79297d4641a5336f7956620d82253884'
const FD_KEY = process.env.FOOTBALL_DATA_API_KEY
const SPORTDB_PAID_KEY = '9j2JlF'
const AF_ARSENAL_ID = 42
const SPORTSDB_ARSENAL_ID = '133604'

// ─── Crest map — media.api-sports.io by team ID ─────────────────────────────
// These URLs are public PNGs with no hotlink protection (confirmed 200).
// Format: https://media.api-sports.io/football/teams/{id}.png
function apiSportsCrest(id: number) {
  return `https://media.api-sports.io/football/teams/${id}.png`
}

const CREST: Record<string, string> = {
  // National Teams — use flagcdn.com SVGs (reliable, free, correct flags)
  'England':                   'https://flagcdn.com/gb-eng.svg',
  'Spain':                     'https://flagcdn.com/es.svg',
  'Croatia':                   'https://flagcdn.com/hr.svg',
  'New Zealand':               'https://flagcdn.com/nz.svg',
  'Costa Rica':                'https://flagcdn.com/cr.svg',
  'Ghana':                     'https://flagcdn.com/gh.svg',
  'Panama':                    'https://flagcdn.com/pa.svg',
  'Czech Republic':            'https://flagcdn.com/cz.svg',
  'Czechia':                   'https://flagcdn.com/cz.svg',
  'Brazil':                    'https://flagcdn.com/br.svg',
  'Argentina':                 'https://flagcdn.com/ar.svg',
  'France':                    'https://flagcdn.com/fr.svg',
  'Germany':                   'https://flagcdn.com/de.svg',
  'Portugal':                  'https://flagcdn.com/pt.svg',
  'Netherlands':               'https://flagcdn.com/nl.svg',
  'Belgium':                   'https://flagcdn.com/be.svg',
  'Italy':                     'https://flagcdn.com/it.svg',
  'USA':                       'https://flagcdn.com/us.svg',
  'United States':             'https://flagcdn.com/us.svg',
  'Mexico':                    'https://flagcdn.com/mx.svg',
  'Japan':                     'https://flagcdn.com/jp.svg',
  'South Korea':               'https://flagcdn.com/kr.svg',
  'Australia':                 'https://flagcdn.com/au.svg',
  'Canada':                    'https://flagcdn.com/ca.svg',
  'Scotland':                  'https://flagcdn.com/gb-sct.svg',
  'Wales':                     'https://flagcdn.com/gb-wls.svg',
  'Ireland':                   'https://flagcdn.com/ie.svg',
  'Republic of Ireland':       'https://flagcdn.com/ie.svg',
  'Denmark':                   'https://flagcdn.com/dk.svg',
  'Sweden':                    'https://flagcdn.com/se.svg',
  'Norway':                    'https://flagcdn.com/no.svg',
  'Switzerland':               'https://flagcdn.com/ch.svg',
  'Poland':                    'https://flagcdn.com/pl.svg',
  'Serbia':                    'https://flagcdn.com/rs.svg',
  'Ukraine':                   'https://flagcdn.com/ua.svg',
  'Senegal':                   'https://flagcdn.com/sn.svg',
  'Morocco':                   'https://flagcdn.com/ma.svg',
  'Nigeria':                   'https://flagcdn.com/ng.svg',
  'Cameroon':                  'https://flagcdn.com/cm.svg',
  'Ecuador':                   'https://flagcdn.com/ec.svg',
  'Colombia':                  'https://flagcdn.com/co.svg',
  'Uruguay':                   'https://flagcdn.com/uy.svg',
  'Chile':                     'https://flagcdn.com/cl.svg',
  'Paraguay':                  'https://flagcdn.com/py.svg',
  'Peru':                      'https://flagcdn.com/pe.svg',
  'Tunisia':                   'https://flagcdn.com/tn.svg',
  'Saudi Arabia':              'https://flagcdn.com/sa.svg',
  'Iran':                      'https://flagcdn.com/ir.svg',
  'Qatar':                     'https://flagcdn.com/qa.svg',
  
  // Premier League
  'Arsenal':                   apiSportsCrest(42),
  'Arsenal FC':                apiSportsCrest(42),
  'Aston Villa':               apiSportsCrest(66),
  'Aston Villa FC':            apiSportsCrest(66),
  'Bournemouth':               apiSportsCrest(35),
  'AFC Bournemouth':           apiSportsCrest(35),
  'Brentford':                 apiSportsCrest(55),
  'Brentford FC':              apiSportsCrest(55),
  'Brighton':                  apiSportsCrest(51),
  'Brighton & Hove Albion':    apiSportsCrest(51),
  'Brighton & Hove Albion FC': apiSportsCrest(51),
  'Burnley':                   apiSportsCrest(44),
  'Burnley FC':                apiSportsCrest(44),
  'Chelsea':                   apiSportsCrest(49),
  'Chelsea FC':                apiSportsCrest(49),
  'Crystal Palace':            apiSportsCrest(52),
  'Crystal Palace FC':         apiSportsCrest(52),
  'Everton':                   apiSportsCrest(45),
  'Everton FC':                apiSportsCrest(45),
  'Fulham':                    apiSportsCrest(36),
  'Fulham FC':                 apiSportsCrest(36),
  'Ipswich Town':              apiSportsCrest(57),
  'Ipswich Town FC':           apiSportsCrest(57),
  'Leicester City':            apiSportsCrest(46),
  'Leicester City FC':         apiSportsCrest(46),
  'Liverpool':                 apiSportsCrest(40),
  'Liverpool FC':              apiSportsCrest(40),
  'Manchester City':           apiSportsCrest(50),
  'Manchester City FC':        apiSportsCrest(50),
  'Manchester United':         apiSportsCrest(33),
  'Manchester United FC':      apiSportsCrest(33),
  'Newcastle United':          apiSportsCrest(34),
  'Newcastle United FC':       apiSportsCrest(34),
  'Newcastle':                 apiSportsCrest(34),
  'Nottingham Forest':         apiSportsCrest(65),
  'Nottingham Forest FC':      apiSportsCrest(65),
  "Nott'm Forest":             apiSportsCrest(65),
  'Southampton':               apiSportsCrest(41),
  'Southampton FC':            apiSportsCrest(41),
  'Tottenham':                 apiSportsCrest(47),
  'Tottenham Hotspur':         apiSportsCrest(47),
  'Tottenham Hotspur FC':      apiSportsCrest(47),
  'West Ham':                  apiSportsCrest(48),
  'West Ham United':           apiSportsCrest(48),
  'West Ham United FC':        apiSportsCrest(48),
  'Wolverhampton Wanderers':   apiSportsCrest(39),
  'Wolverhampton':             apiSportsCrest(39),
  'Wolves':                    apiSportsCrest(39),
  // European
  'PSG':                       apiSportsCrest(85),
  'Paris Saint-Germain':       apiSportsCrest(85),
  'Paris Saint-Germain F.C.':  apiSportsCrest(85),
  'Paris Saint-Germain FC':    apiSportsCrest(85),
  'Paris Saint Germain':       apiSportsCrest(85),
  'Real Madrid':               apiSportsCrest(541),
  'Real Madrid CF':            apiSportsCrest(541),
  'FC Barcelona':              apiSportsCrest(529),
  'Barcelona':                 apiSportsCrest(529),
  'Bayern Munich':             apiSportsCrest(157),
  'FC Bayern München':         apiSportsCrest(157),
  'Atletico Madrid':           apiSportsCrest(530),
  'Atlético de Madrid':        apiSportsCrest(530),
  'Borussia Dortmund':         apiSportsCrest(165),
  'Bayer Leverkusen':          apiSportsCrest(168),
  'Bayer 04 Leverkusen':       apiSportsCrest(168),
  'Inter Milan':               apiSportsCrest(505),
  'FC Internazionale Milano':  apiSportsCrest(505),
  'Internazionale':            apiSportsCrest(505),
  'AC Milan':                  apiSportsCrest(489),
  'Juventus':                  apiSportsCrest(496),
  'Juventus FC':               apiSportsCrest(496),
  'Benfica':                   apiSportsCrest(211),
  'SL Benfica':                apiSportsCrest(211),
  'Porto':                     apiSportsCrest(212),
  'FC Porto':                  apiSportsCrest(212),
  'Ajax':                      apiSportsCrest(194),
  'AFC Ajax':                  apiSportsCrest(194),
  'Napoli':                    apiSportsCrest(492),
  'SSC Napoli':                apiSportsCrest(492),
  'RB Leipzig':                apiSportsCrest(173),
  'Feyenoord':                 apiSportsCrest(209),
}

// ─── Resolve crest URL from team name ────────────────────────────────────────
// api-sports.io CDN has no hotlink protection — return URLs directly.
// If api-football returns a logo URL for a team we don't have, use it directly too.
function resolveCrest(name: string, fallback: string): string {
  if (CREST[name]) return CREST[name]
  if (CREST[name + ' FC']) return CREST[name + ' FC']
  const noFc = name.replace(/ FC$/i, '')
  if (CREST[noFc]) return CREST[noFc]

  // Case-insensitive partial match
  const lower = name.toLowerCase()
  for (const [key, url] of Object.entries(CREST)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return url
    }
  }

  // api-football logo CDN also has no hotlink protection — use as fallback
  if (fallback.startsWith('https://media.api-sports.io/')) return fallback

  return ''
}

type Fixture = {
  homeTeam: string
  awayTeam: string
  homeTeamCrest: string
  awayTeamCrest: string
  date: string
  time: string
  competition: string
  venue: string
  status: string
}

type MatchInfo = {
  state: 'upcoming' | 'live'
  homeTeam: string
  awayTeam: string
  homeTeamCrest: string
  awayTeamCrest: string
  homeScore: null
  awayScore: null
  minute: null
  date: string
  time: string
  competition: string
  venue: string
}

function toMatchInfo(f: Fixture): MatchInfo {
  return {
    state: 'upcoming',
    homeTeam: f.homeTeam,
    awayTeam: f.awayTeam,
    homeTeamCrest: f.homeTeamCrest,
    awayTeamCrest: f.awayTeamCrest,
    homeScore: null,
    awayScore: null,
    minute: null,
    date: f.date,
    time: f.time,
    competition: f.competition,
    venue: f.venue,
  }
}

// ─── Hard-coded upcoming fixtures (season-end safety net) ───────────────────
const KNOWN_REMAINING: Fixture[] = [
  {
    homeTeam: 'Arsenal', awayTeam: 'Burnley',
    homeTeamCrest: CREST['Arsenal'], awayTeamCrest: CREST['Burnley'],
    date: '2026-05-18', time: '19:00', competition: 'Premier League',
    venue: 'Emirates Stadium', status: 'SCHEDULED',
  },
  {
    homeTeam: 'Crystal Palace', awayTeam: 'Arsenal',
    homeTeamCrest: CREST['Crystal Palace'], awayTeamCrest: CREST['Arsenal'],
    date: '2026-05-24', time: '16:00', competition: 'Premier League',
    venue: 'Selhurst Park', status: 'SCHEDULED',
  },
  {
    homeTeam: 'Arsenal', awayTeam: 'PSG',
    homeTeamCrest: CREST['Arsenal'], awayTeamCrest: CREST['PSG'],
    date: '2026-05-30', time: '20:00', competition: 'UEFA Champions League Final',
    venue: 'Puskás Aréna, Budapest', status: 'SCHEDULED',
  },
]

// ─── api-football (RapidAPI) — free plan supports from/to with season 2024 ──
type AFFixture = {
  fixture: { date: string; venue: { name: string | null; city: string | null } | null }
  league: { name: string }
  teams: {
    home: { name: string; logo: string }
    away: { name: string; logo: string }
  }
}

async function fetchFromApiFootball(): Promise<Fixture[]> {
  const today = new Date().toISOString().slice(0, 10)
  const threeMonthsOut = new Date(Date.now() + 90 * 86400_000).toISOString().slice(0, 10)
  // Free plan: seasons 2022–2024 only. Season 2024 = 2024-25 football year.
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?team=${AF_ARSENAL_ID}&season=2024&from=${today}&to=${threeMonthsOut}`,
    {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-apisports-key': RAPIDAPI_KEY,
      },
      next: { revalidate: 86400 },
    }
  )
  if (!res.ok) throw new Error(`api-football ${res.status}`)
  const data: { errors: unknown; response: AFFixture[] } = await res.json()
  // Paid feature errors come back as HTTP 200 with an errors object
  if (data.errors && Object.keys(data.errors as object).length) throw new Error('api-football: plan error')
  if (!data.response?.length) throw new Error('api-football: no fixtures')
  return data.response.slice(0, 10).map(m => {
    const dt = new Date(m.fixture.date)
    const venue = m.fixture.venue
    return {
      homeTeam: m.teams.home.name,
      awayTeam: m.teams.away.name,
      homeTeamCrest: resolveCrest(m.teams.home.name, m.teams.home.logo),
      awayTeamCrest: resolveCrest(m.teams.away.name, m.teams.away.logo),
      date: dt.toISOString().slice(0, 10),
      time: dt.toISOString().slice(11, 16),
      competition: m.league.name,
      venue: venue ? [venue.name, venue.city].filter(Boolean).join(', ') : '',
      status: 'SCHEDULED',
    }
  })
}

// ─── football-data.org ────────────────────────────────────────────────────────
type FDMatch = {
  competition: { name: string }
  utcDate: string
  homeTeam: { name: string; crest: string }
  awayTeam: { name: string; crest: string }
  venue?: string
}

async function fetchFromFootballData(): Promise<Fixture[]> {
  const res = await fetch(
    'https://api.football-data.org/v4/teams/57/matches?status=SCHEDULED&limit=10',
    {
      headers: { 'X-Auth-Token': FD_KEY! },
      next: { revalidate: 86400 },
    }
  )
  if (!res.ok) throw new Error(`football-data.org ${res.status}`)
  const data: { matches: FDMatch[] } = await res.json()
  return data.matches.slice(0, 10).map(m => {
    const dt = new Date(m.utcDate)
    return {
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      homeTeamCrest: resolveCrest(m.homeTeam.name, m.homeTeam.crest),
      awayTeamCrest: resolveCrest(m.awayTeam.name, m.awayTeam.crest),
      date: dt.toISOString().slice(0, 10),
      time: dt.toISOString().slice(11, 16),
      competition: m.competition.name,
      venue: m.venue ?? '',
      status: 'SCHEDULED',
    }
  })
}

// ─── TheSportsDB ──────────────────────────────────────────────────────────────
type SportsDBEvent = {
  strHomeTeam: string
  strAwayTeam: string
  strHomeTeamBadge: string
  strAwayTeamBadge: string
  dateEvent: string
  strTime: string | null
  strLeague: string
  strVenue: string | null
}

async function fetchICSFixtures(): Promise<Fixture[]> {
  const urls = [
    'https://www.skysports.com/calendars/football/fixtures/teams/arsenal',
    'https://www.skysports.com/calendars/football/fixtures/teams/england'
  ]
  const fixtures: Fixture[] = []

  for (const url of urls) {
    try {
      // Avoid next.js caching errors with dynamic fetches by adding simple cache config
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (!res.ok) continue
      
      const text = await res.text()
      const events = text.split('BEGIN:VEVENT').slice(1)
      
      for (const ev of events) {
        const summaryMatch = ev.match(/SUMMARY:(.*)/)
        const dtstartMatch = ev.match(/DTSTART:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/)
        const locationMatch = ev.match(/LOCATION:(.*)/)
        const descMatch = ev.match(/DESCRIPTION:(.*)/)
        
        if (summaryMatch && dtstartMatch) {
          const summary = summaryMatch[1].trim()
          const parts = summary.split(' v ')
          if (parts.length === 2) {
            const hTeam = parts[0].trim()
            const aTeam = parts[1].trim()
            
            const dateStr = `${dtstartMatch[1]}-${dtstartMatch[2]}-${dtstartMatch[3]}`
            const timeStr = `${dtstartMatch[4]}:${dtstartMatch[5]}`
            const loc = locationMatch ? locationMatch[1].replace(/\\;/g, '').replace(/&amp;/g, '&').replace(/amp/g, '').trim() : ''
            
            let competition = 'Match'
            if (descMatch) {
              const descParts = descMatch[1].split(' - ')
              if (descParts.length > 2) competition = descParts[2].trim()
            }
            
            const lcComp = competition.toLowerCase()
            const isMajor = lcComp.includes('world cup') || lcComp.includes('premier league') || lcComp.includes('champions league') || lcComp.includes('fa cup')
            
            if (isMajor) {
              fixtures.push({
                homeTeam: hTeam,
                awayTeam: aTeam,
                homeTeamCrest: resolveCrest(hTeam, ''),
                awayTeamCrest: resolveCrest(aTeam, ''),
                date: dateStr,
                time: timeStr,
                competition,
                venue: loc,
                status: 'SCHEDULED',
              })
            }
          }
        }
      }
    } catch (e) {
      console.error('ICS parse error for', url, e)
    }
  }
  
  if (!fixtures.length) throw new Error('No ICS fixtures found')
  return fixtures
}

// ─── Merge + deduplicate ──────────────────────────────────────────────────────
function mergeFixtures(api: Fixture[], today: string): Fixture[] {
  const result = [...api]
  for (const known of KNOWN_REMAINING) {
    if (known.date < today) continue
    const covered = result.some(f =>
      (f.homeTeam === known.homeTeam && f.awayTeam === known.awayTeam) ||
      (f.competition.toLowerCase().includes(known.competition.toLowerCase().split(' ')[0]) &&
       Math.abs(new Date(f.date).getTime() - new Date(known.date).getTime()) < 3 * 86400_000)
    )
    if (!covered) result.push(known)
  }
  return result
    .filter(f => f.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10)
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET() {
  const today = new Date().toISOString().slice(0, 10)
  let fixtures: Fixture[] = []

  try { fixtures = await fetchFromApiFootball() } catch {}
  if (!fixtures.length && FD_KEY) { try { fixtures = await fetchFromFootballData() } catch {} }
  if (!fixtures.length) { try { fixtures = await fetchICSFixtures() } catch {} }

  const merged = mergeFixtures(fixtures, today)
  const final = merged.length > 0 ? merged : KNOWN_REMAINING.filter(f => f.date >= today)

  return NextResponse.json({
    fixtures: final,
    current: final.length > 0 ? toMatchInfo(final[0]) : null,
  })
}
