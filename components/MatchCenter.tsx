'use client'

import { useEffect, useState } from 'react'
import GrainOverlay from './GrainOverlay'

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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00Z')
  return {
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
  }
}

function normalizeCompetition(name: string): string {
  const lc = name.toLowerCase()
  if (lc.includes('english premier') || lc === 'premier league') return 'Premier League'
  if (lc.includes('premier league')) return 'Premier League'
  if (lc.includes('champions league') || lc.includes('champions')) return 'UEFA Champions League'
  if (lc.includes('fa cup')) return 'FA Cup'
  if (lc.includes('carabao') || lc.includes('league cup') || lc.includes('efl')) return 'EFL Cup'
  if (lc.includes('community shield')) return 'Community Shield'
  if (lc.includes('europa league')) return 'UEFA Europa League'
  return name
}

function shortTeamName(name: string): string {
  const lc = name.toLowerCase()
  if (lc.includes('manchester city')) return 'Man City'
  if (lc.includes('manchester united')) return 'Man Utd'
  if (lc.includes('newcastle')) return 'Newcastle'
  if (lc.includes('tottenham')) return 'Spurs'
  if (lc.includes('west ham')) return 'West Ham'
  if (lc.includes('crystal palace')) return 'C. Palace'
  if (lc.includes('aston villa')) return 'A. Villa'
  if (lc.includes('nottingham')) return "Nott'm F"
  if (lc.includes('paris')) return 'PSG'
  if (lc.includes('real madrid')) return 'Real Madrid'
  if (lc.includes('atletico') || lc.includes('atlético')) return 'Atlético'
  if (lc.includes('borussia dortmund')) return 'Dortmund'
  if (lc.includes('internazionale')) return 'Inter Milan'
  return name.split(' ')[0]
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Mona Sans, sans-serif',
  fontSize: '0.55rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.65)',
  fontWeight: 600,
  textAlign: 'center',
}

function FixtureCard({ fixture, index }: { fixture: Fixture; index: number }) {
  const { weekday, day, month } = formatDate(fixture.date)
  const competition = normalizeCompetition(fixture.competition)
  const hasAltBg = index % 2 === 0

  return (
    <div
      style={{
        background: hasAltBg ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Teams ── */}
      <div
        style={{
          padding: '16px 12px 14px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Home team */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {fixture.homeTeamCrest && (
            <img src={fixture.homeTeamCrest} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          )}
          <span style={LABEL_STYLE}>{shortTeamName(fixture.homeTeam)}</span>
        </div>

        {/* VS + venue */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            paddingInline: 8,
            minWidth: 56,
          }}
        >
          <span
            style={{
              fontFamily: 'Kegilka, serif',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.38)',
              lineHeight: 1,
            }}
          >
            VS
          </span>
          {fixture.venue && (
            <span
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.42rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                textAlign: 'center',
                maxWidth: 72,
                lineHeight: 1.45,
              }}
            >
              {fixture.venue.split(',')[0]}
            </span>
          )}
        </div>

        {/* Away team */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {fixture.awayTeamCrest && (
            <img src={fixture.awayTeamCrest} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          )}
          <span style={LABEL_STYLE}>{shortTeamName(fixture.awayTeam)}</span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />

      {/* ── Date + competition ── */}
      <div style={{ padding: '12px 16px', textAlign: 'center' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: '0.48rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.32)',
            marginBottom: 3,
          }}
        >
          {weekday}
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: 'Kegilka, serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
            color: '#ffffff',
            fontWeight: 400,
            lineHeight: 1.05,
            marginBottom: 6,
          }}
        >
          {day} {month}
        </span>
        <span
          style={{
            display: 'block',
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: '0.45rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.4,
          }}
        >
          {competition}
        </span>
      </div>
    </div>
  )
}

export default function MatchCenter() {
  const [fixtures, setFixtures] = useState<Fixture[]>([])

  useEffect(() => {
    fetch('/api/fixtures')
      .then(r => r.json())
      .then(data => { if (data.fixtures?.length) setFixtures(data.fixtures) })
      .catch(() => {})
  }, [])

  return (
    <section
      id="fixtures"
      style={{ background: '#09090b', position: 'relative' }}
    >
      <GrainOverlay />

      <div className="px-4 pb-4 md:px-6" style={{ paddingTop: 88 }}>

        {/* ── Heading ── */}
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}
          >
            MATCH
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}
          >
            CENTRE
          </span>
        </div>

        {/* ── Subtitle ── */}
        <p
          style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: 'var(--body-text-size)',
            lineHeight: 'var(--body-line-height)',
            color: 'rgba(255,255,255,0.38)',
            marginBottom: 24,
            maxWidth: 600,
          }}
        >
          Stay connected with all the action: upcoming fixtures and events for
          Arsenal and the England national team.
        </p>

        {/* ── England · Three Lions label ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#fff',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.42)',
              fontWeight: 600,
            }}
          >
            England · Three Lions
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* ── 4-column card grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fixtures.map((f, i) => (
            <FixtureCard
              key={f.date + f.homeTeam + f.awayTeam}
              fixture={f}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
