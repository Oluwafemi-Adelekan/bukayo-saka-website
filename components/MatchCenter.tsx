'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase(),
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    full: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

function FixtureCard({ fixture, index, isFeatured }: { fixture: Fixture; index: number; isFeatured: boolean }) {
  const { day, date } = formatDate(fixture.date)
  const isChampionsLeague = fixture.competition.toLowerCase().includes('champions')
  const accentColor = isChampionsLeague ? '#EF0107' : '#C0C0C0'

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative border overflow-hidden group transition-all duration-400 hover:bg-white/[0.02] ${
        isFeatured ? 'border-[#EF0107]/50' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Featured banner */}
      {isFeatured && (
        <div className="flex items-center gap-2 px-5 py-2 bg-[#EF0107] w-full">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span
            className="text-white text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            Next Up — Don&apos;t Miss It
          </span>
        </div>
      )}

      <div className="flex items-center gap-0 p-0">
        {/* Date panel */}
        <div className="flex-shrink-0 w-20 md:w-28 flex flex-col items-center justify-center border-r border-white/10 py-6 px-3 text-center">
          <span
            className="text-zinc-600 text-xs tracking-widest uppercase block"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            {day}
          </span>
          <span
            className="text-white text-lg md:text-xl font-normal leading-tight mt-1"
            style={{ fontFamily: 'Notable, serif' }}
          >
            {date}
          </span>
          <span
            className="text-xs mt-2 font-semibold px-2 py-0.5"
            style={{
              color: accentColor,
              fontFamily: 'Urbanist, sans-serif',
              border: `1px solid ${accentColor}40`,
            }}
          >
            {isChampionsLeague ? 'UCL' : 'PL'}
          </span>
        </div>

        {/* Match info with crests */}
        <div className="flex-1 px-5 md:px-8 py-5">
          <p
            className="text-zinc-600 text-xs tracking-widest uppercase mb-2"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            {fixture.competition}
          </p>
          <div className="flex items-center gap-3 md:gap-5">
            {/* Home crest — Arsenal original colors, others white silhouette */}
            <img
              src={fixture.homeTeamCrest}
              alt={fixture.homeTeam}
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
              style={{ filter: fixture.homeTeam.toLowerCase().includes('arsenal') ? 'none' : 'brightness(0) invert(1)' }}
              loading="lazy"
            />
            <span
              className="text-white text-base md:text-xl font-normal leading-none"
              style={{ fontFamily: 'Notable, serif' }}
            >
              {fixture.homeTeam}
            </span>
            <span
              className="text-zinc-600 text-sm font-light"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              vs
            </span>
            <span
              className="text-white text-base md:text-xl font-normal leading-none"
              style={{ fontFamily: 'Notable, serif' }}
            >
              {fixture.awayTeam}
            </span>
            {/* Away crest */}
            <img
              src={fixture.awayTeamCrest}
              alt={fixture.awayTeam}
              className="w-6 h-6 md:w-8 md:h-8 object-contain"
              style={{ filter: fixture.awayTeam.toLowerCase().includes('arsenal') ? 'none' : 'brightness(0) invert(1)' }}
              loading="lazy"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p
              className="text-zinc-600 text-xs"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {fixture.time} BST · {fixture.venue}
            </p>
          </div>
        </div>

        {/* Right arrow */}
        <div className="flex-shrink-0 pr-5 md:pr-8">
          <div
            className="w-8 h-8 border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            →
          </div>
        </div>
      </div>
    </motion.div>
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
      className="relative w-full py-32 px-4 md:px-6"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-20"
      >
        <p
          className="text-[#EF0107] text-xs tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Events &amp; Fixtures
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-white">MATCH</span>
          <br />
          <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
            CENTRE
          </span>
        </h2>
      </motion.div>

      {/* Fixtures */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-3 h-3 rounded-full bg-[#EF0107]" />
          <span
            className="text-white text-sm tracking-widest uppercase font-medium"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            Arsenal FC
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </motion.div>

        <div className="flex flex-col gap-3">
          {fixtures.map((f, i) => (
            <FixtureCard key={f.date + f.homeTeam} fixture={f} index={i} isFeatured={i === 0} />
          ))}
        </div>
      </div>

    </section>
  )
}
