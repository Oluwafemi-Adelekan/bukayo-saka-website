'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type MatchInfo = {
  state: 'upcoming' | 'live' | 'finished' | 'halftime' | 'result'
  homeTeam: string
  awayTeam: string
  homeTeamCrest: string
  awayTeamCrest: string
  homeScore: number | null
  awayScore: number | null
  minute: number | null
  date: string
  time: string
  competition: string
  venue: string
}

const INITIAL: MatchInfo = {
  state: 'upcoming',
  homeTeam: 'Arsenal',
  awayTeam: 'PSG',
  homeTeamCrest: 'https://media.api-sports.io/football/teams/42.png',
  awayTeamCrest: 'https://media.api-sports.io/football/teams/85.png',
  homeScore: null,
  awayScore: null,
  minute: null,
  date: '2026-05-30',
  time: '20:00',
  competition: 'UEFA Champions League',
  venue: 'Puskás Aréna, Budapest',
}

// ─── Shared typography — mirrors the Tile component in overlay stats cards ──
const LABEL: React.CSSProperties = {
  fontFamily: 'Mona Sans, sans-serif',
  fontSize: '0.55rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.55)',
  fontWeight: 600,
  whiteSpace: 'nowrap',
}

const VALUE: React.CSSProperties = {
  fontFamily: 'Kegilka, serif',
  fontSize: '1.35rem',
  lineHeight: 1,
  color: '#fff',
  fontWeight: 400,
  letterSpacing: '0.02em',
}

const TILE_H = 84

// ─── Single grid cell ───────────────────────────────────────────────────────
function Cell({
  children,
  style = {},
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '10px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.18)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        height: TILE_H,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(date: string, time: string) {
  const d = new Date(`${date}T${time}:00Z`)
  return {
    weekday: d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
    day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
    month: d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase(),
  }
}

function competitionShort(name: string) {
  const lc = name.toLowerCase()
  if (lc.includes('champions')) return 'UCL'
  if (lc.includes('premier')) return 'PL'
  if (lc.includes('fa cup')) return 'FA Cup'
  if (lc.includes('league cup') || lc.includes('carabao')) return 'EFL Cup'
  if (lc.includes('community')) return 'Com. Shield'
  return name.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase()
}

// First word of team name, handles common abbreviations
function shortName(name: string) {
  if (name.toLowerCase().includes('manchester city')) return 'Man City'
  if (name.toLowerCase().includes('manchester united')) return 'Man Utd'
  if (name.toLowerCase().includes('newcastle')) return 'Newcastle'
  if (name.toLowerCase().includes('tottenham')) return 'Spurs'
  if (name.toLowerCase().includes('west ham')) return 'West Ham'
  if (name.toLowerCase().includes('crystal palace')) return 'C. Palace'
  if (name.toLowerCase().includes('aston villa')) return 'Aston Villa'
  if (name.toLowerCase().includes('nottingham')) return "Nott'm F"
  if (name.toLowerCase().includes('paris')) return 'PSG'
  if (name.toLowerCase().includes('real madrid')) return 'Real Madrid'
  return name.split(' ')[0]
}

// ─── Component ────────────────────────────────────────────────────────────
export default function NextMatch() {
  const [match, setMatch] = useState<MatchInfo>(INITIAL)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetch('/api/fixtures')
        .then(r => r.json())
        .then(data => { if (!cancelled && data.current) setMatch(data.current) })
        .catch(() => {})
    }
    load()
    const id = setInterval(load, 45_000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const { weekday, day, month } = formatDate(match.date, match.time)
  const isScored = match.state === 'live' || match.state === 'halftime' || match.state === 'result'
  const isUCL = match.competition.toLowerCase().includes('champions')
  const compCode = competitionShort(match.competition)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 8.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full md:max-w-[380px]"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>

        {/* ── Row 1, Col 1: blinking dot + "Next Match" — vertically centered ── */}
        <Cell style={{ justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.span
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#EF0107', flexShrink: 0, display: 'inline-block',
              }}
            />
            <span style={LABEL}>
              {match.state === 'live' ? 'Live' : match.state === 'result' ? 'Full Time' : 'Next Match'}
            </span>
          </div>
        </Cell>

        {/* ── Row 1, Col 2+3: Home vs Away — crests + names, centered ── */}
        <Cell style={{ gridColumn: 'span 2', borderLeft: 'none', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>

            {/* Home team */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {match.homeTeamCrest && (
                <img src={match.homeTeamCrest} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              )}
              <span style={{ fontFamily: 'Kegilka, serif', fontSize: '0.9rem', color: '#fff', fontWeight: 400, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                {shortName(match.homeTeam)}
              </span>
            </div>

            {/* VS / Score */}
            {isScored ? (
              <span style={{ fontFamily: 'Kegilka, serif', fontSize: '1.3rem', color: '#fff', fontWeight: 400, letterSpacing: '0.06em', flexShrink: 0 }}>
                {match.homeScore}&nbsp;–&nbsp;{match.awayScore}
              </span>
            ) : (
              <span style={{ ...LABEL, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>vs</span>
            )}

            {/* Away team */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {match.awayTeamCrest && (
                <img src={match.awayTeamCrest} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
              )}
              <span style={{ fontFamily: 'Kegilka, serif', fontSize: '0.9rem', color: '#fff', fontWeight: 400, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                {shortName(match.awayTeam)}
              </span>
            </div>

          </div>
        </Cell>

        {/* ── Row 2, Col 1: Competition ── */}
        <Cell style={{ borderTop: 'none' }}>
          <span style={LABEL}>Competition</span>
          <span style={{ ...VALUE, color: '#fff', fontSize: '1.2rem' }}>
            {compCode}
          </span>
        </Cell>

        {/* ── Row 2, Col 2: Kick-off time ── */}
        <Cell style={{ borderTop: 'none', borderLeft: 'none' }}>
          <span style={LABEL}>Kick-Off</span>
          <span style={VALUE}>
            {isScored && match.state === 'live' && match.minute ? `${match.minute}'` : match.time}
          </span>
        </Cell>

        {/* ── Row 2, Col 3: Date ── */}
        <Cell style={{ borderTop: 'none', borderLeft: 'none' }}>
          <span style={LABEL}>Date</span>
          <span style={{ ...VALUE, fontSize: '1rem' }}>
            {weekday} {day} {month}
          </span>
        </Cell>

      </div>
    </motion.div>
  )
}
