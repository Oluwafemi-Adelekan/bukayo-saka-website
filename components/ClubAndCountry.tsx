'use client'

import { motion } from 'framer-motion'

const arsenalHighlights = [
  { stat: '287+', label: 'Appearances' },
  { stat: '91+', label: 'Goals' },
  { stat: '74+', label: 'Assists' },
]

const englandHighlights = [
  { stat: '63+', label: 'Caps' },
  { stat: '2020', label: 'Debut Year' },
  { stat: '#1', label: 'PL Scorers for England' },
]

const arsenalPoints = [
  'Heart of Mikel Arteta\'s title-charging Arsenal',
  'Key man in three consecutive Premier League title races',
  'Champions League nights at the Emirates — he delivers',
  'Arsenal\'s all-time record PL goalscorer for England',
  'Permanent captain material; leads by example daily',
]

const englandPoints = [
  'International debut: October 2020 vs Republic of Ireland',
  'Euro 2020 — youngest squad member; carried nation\'s hope',
  'World Cup 2022 — decisive performances and goals in Qatar',
  'Euro 2024 — England\'s most dangerous attacker throughout',
  'First choice left winger for the Three Lions era',
]

function SideCard({
  side,
  badge,
  title,
  subtitle,
  highlights,
  points,
  accentColor,
  textColor,
  borderColor,
  delay = 0,
}: {
  side: 'left' | 'right'
  badge: string
  title: string
  subtitle: string
  highlights: { stat: string; label: string }[]
  points: string[]
  accentColor: string
  textColor: string
  borderColor: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, delay }}
      className="flex-1 relative overflow-hidden border border-white/10 p-8 md:p-12 lg:p-16 group hover:border-white/20 transition-colors duration-500"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 60%)` }}
      />

      {/* Vertical accent bar */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ background: accentColor }}
      />

      {/* Badge */}
      <p
        className="text-xs tracking-[0.4em] uppercase mb-6 font-medium"
        style={{ color: accentColor, fontFamily: 'Urbanist, sans-serif' }}
      >
        {badge}
      </p>

      {/* Title */}
      <h3
        className="text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-none mb-2"
        style={{ fontFamily: 'Notable, serif' }}
      >
        {title}
      </h3>
      <p
        className="text-zinc-500 text-sm tracking-wider uppercase mb-10"
        style={{ fontFamily: 'Urbanist, sans-serif' }}
      >
        {subtitle}
      </p>

      {/* Stats row */}
      <div className="flex gap-8 mb-10 pb-10 border-b border-white/10">
        {highlights.map((h) => (
          <div key={h.label}>
            <div
              className="text-3xl md:text-4xl font-normal"
              style={{ fontFamily: 'Notable, serif', color: accentColor }}
            >
              {h.stat}
            </div>
            <div
              className="text-zinc-600 text-xs tracking-widest uppercase mt-1"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {h.label}
            </div>
          </div>
        ))}
      </div>

      {/* Key points */}
      <ul className="flex flex-col gap-3">
        {points.map((point, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-zinc-400 text-sm leading-relaxed"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            <span style={{ color: accentColor }} className="mt-1 flex-shrink-0 text-xs">▸</span>
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function ClubAndCountry() {
  return (
    <section
      id="club-country"
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
          Dual Identity
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-white">CLUB</span>{' '}
          <span style={{ WebkitTextStroke: '2px #EF0107', color: 'transparent' }}>
            &amp;
          </span>{' '}
          <span className="text-white">COUNTRY</span>
        </h2>
      </motion.div>

      {/* Two cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SideCard
          side="left"
          badge="Arsenal FC · Premier League"
          title="THE GUNNER"
          subtitle="North London is Red"
          highlights={arsenalHighlights}
          points={arsenalPoints}
          accentColor="#EF0107"
          textColor="white"
          borderColor="#EF0107"
          delay={0.1}
        />
        <SideCard
          side="right"
          badge="England · Three Lions"
          title="THE LION"
          subtitle="For Club and Country"
          highlights={englandHighlights}
          points={englandPoints}
          accentColor="#C0C0C0"
          textColor="white"
          borderColor="#C0C0C0"
          delay={0.25}
        />
      </div>

      {/* Full-bleed quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-16 text-center"
      >
        <p
          className="text-zinc-700 text-xs tracking-[0.5em] uppercase mb-6"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Mikel Arteta on Saka
        </p>
        <blockquote
          className="text-3xl md:text-5xl text-white font-normal max-w-4xl mx-auto leading-tight"
          style={{ fontFamily: 'Notable, serif' }}
        >
          &ldquo;He is the &nbsp;
          <span style={{ color: '#EF0107' }}>heartbeat</span>
          &nbsp; of everything we do.&rdquo;
        </blockquote>
      </motion.div>
    </section>
  )
}
