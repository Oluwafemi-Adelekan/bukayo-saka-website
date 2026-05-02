'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { MatchInfo } from '@/app/api/fixtures/route'

// Shown immediately — no loading flicker. API silently replaces this.
const INITIAL: MatchInfo = {
  state: 'upcoming',
  homeTeam: 'Arsenal',
  awayTeam: 'Fulham',
  homeTeamCrest: 'https://crests.football-data.org/57.png',
  awayTeamCrest: 'https://crests.football-data.org/63.png',
  homeScore: null,
  awayScore: null,
  minute: null,
  date: '2026-05-02',
  time: '15:00',
  competition: 'Premier League',
  venue: 'Emirates Stadium',
}

// ─── Crest silhouette badge ────────────────────────────────────────────────
// Uses the real club crest, stripped of all colour via CSS filter so it
// reads as a clean white (or Arsenal-red) outline on the dark background.
function TeamBadge({ name, crestUrl }: { name: string; crestUrl: string }) {
  const isArsenal = name.toLowerCase().includes('arsenal')

  // Arsenal: show the real crest unfiltered — on the dark bg the red logo reads
  // exactly like the "dark embossed" reference look.
  // All others: brightness(0) invert(1) strips every colour and produces a clean
  // white silhouette — like the Atletico black-and-white reference image.
  const filter = isArsenal ? 'none' : 'brightness(0) invert(1)'

  return (
    <div className="flex flex-col items-center gap-1.5 select-none" title={name}>
      <div className="w-11 h-11 flex items-center justify-center">
        {crestUrl ? (
          <img
            src={crestUrl}
            alt={name}
            className="w-full h-full object-contain"
            style={{ filter }}
            draggable={false}
          />
        ) : (
          /* Text fallback if crest URL is unavailable */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ border: `1.5px solid ${isArsenal ? '#EF0107' : 'rgba(255,255,255,0.3)'}` }}
          >
            <span
              className="text-[9px] font-bold tracking-widest"
              style={{
                fontFamily: 'Urbanist, sans-serif',
                color: isArsenal ? '#EF0107' : 'rgba(255,255,255,0.6)',
              }}
            >
              {name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span
        className="text-[8px] tracking-wider uppercase text-zinc-600 max-w-[60px] text-center leading-tight"
        style={{ fontFamily: 'Urbanist, sans-serif' }}
      >
        {name.split(' ')[0]}
      </span>
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
    // Re-poll every 45 s so live scores update automatically
    const id = setInterval(load, 45_000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const { weekday, day, month } = formatDate(match.date, match.time)
  const isScored = match.state === 'live' || match.state === 'halftime' || match.state === 'result'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-[280px] md:w-[340px]"
    >
      {/* State label — 16 px gap to card below */}
      <div className="flex items-center gap-2 mb-4">
        {match.state === 'live' ? (
          <>
            <motion.span
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#EF0107] flex-shrink-0"
            />
            <span className="text-[#EF0107] text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Live
            </span>
            {match.minute && (
              <span className="text-zinc-500 text-[10px] font-mono">{match.minute}</span>
            )}
          </>
        ) : match.state === 'halftime' ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
            <span className="text-yellow-400 text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Half Time
            </span>
          </>
        ) : match.state === 'result' ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 flex-shrink-0" />
            <span className="text-zinc-400 text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Full Time
            </span>
          </>
        ) : (
          <>
            <motion.span
              animate={{ opacity: [1, 0.25, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-[#EF0107] flex-shrink-0"
            />
            <span className="text-[#EF0107] text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: 'Urbanist, sans-serif' }}>
              Next Match
            </span>
          </>
        )}
      </div>

      {/* Card */}
      <div className="border border-white/10 bg-black/30 backdrop-blur-sm overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-[#EF0107] via-[#EF0107]/50 to-transparent" />

        {/* Badge | score/time | Badge */}
        <div className="flex items-center px-5 py-4 gap-3">
          <TeamBadge name={match.homeTeam} crestUrl={match.homeTeamCrest} />

          <div className="flex-1 flex flex-col items-center">
            {isScored ? (
              <motion.div
                key={`${match.homeScore}-${match.awayScore}`}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-baseline gap-2"
              >
                <span className="text-white text-3xl font-normal leading-none tabular-nums" style={{ fontFamily: 'Notable, serif' }}>
                  {match.homeScore ?? 0}
                </span>
                <span className="text-zinc-600 text-base">–</span>
                <span className="text-white text-3xl font-normal leading-none tabular-nums" style={{ fontFamily: 'Notable, serif' }}>
                  {match.awayScore ?? 0}
                </span>
              </motion.div>
            ) : (
              <>
                <span className="text-white text-2xl font-normal leading-none tracking-wide" style={{ fontFamily: 'Notable, serif' }}>
                  {match.time}
                </span>
                <span className="text-zinc-500 text-[9px] tracking-[0.3em] uppercase mt-1.5" style={{ fontFamily: 'Urbanist, sans-serif' }}>
                  {weekday} {day} {month}
                </span>
              </>
            )}
          </div>

          <TeamBadge name={match.awayTeam} crestUrl={match.awayTeamCrest} />
        </div>

        <div className="border-t border-white/[0.07] px-5 py-2">
          <span className="text-zinc-600 text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Urbanist, sans-serif' }}>
            {match.competition}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
