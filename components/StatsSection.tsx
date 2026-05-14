'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import GrainOverlay from './GrainOverlay'

interface StatItem {
  value: number
  suffix: string
  label: string
  sublabel: string
  color: string
}

interface ApiStats {
  plGoals: number
  plAssists: number
  plMatches: number
  plPenalties: number
  goalInvolvements: number
}

// Verified career counters — for stats Football-Data.org doesn't expose at season level
const CAREER = {
  englandCaps: 48,
}

function useCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    setCount(0)
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return count
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCounter(stat.value, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="relative flex flex-col border border-white/10 p-8 group hover:border-white/20 transition-all duration-500 hover:bg-white/[0.02]"
    >
      {/* Accent dot */}
      <div
        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-60"
        style={{ background: stat.color }}
      />

      {/* Large number */}
      <div
        className="text-6xl md:text-7xl xl:text-8xl font-normal leading-none mb-2 tabular-nums"
        style={{ fontFamily: 'Kegilka, serif', color: stat.color }}
      >
        {count}
        <span className="text-4xl md:text-5xl">{stat.suffix}</span>
      </div>

      {/* Label */}
      <div
        className="text-white text-base md:text-lg font-medium mt-3"
        style={{ fontFamily: 'Mona Sans, sans-serif' }}
      >
        {stat.label}
      </div>

      {/* Sublabel */}
      <div
        className="text-zinc-600 text-xs tracking-widest uppercase mt-1"
        style={{ fontFamily: 'Mona Sans, sans-serif' }}
      >
        {stat.sublabel}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: stat.color }}
      />
    </motion.div>
  )
}

export default function StatsSection() {
  const [apiStats, setApiStats] = useState<ApiStats | null>(null)
  const [season, setSeason] = useState<string>('24/25')

  useEffect(() => {
    let cancelled = false
    fetch('/api/player-stats')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.stats) setApiStats(data.stats)
        if (data.season) setSeason(data.season)
      })
      .catch(() => {
        // keep fallback
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats: StatItem[] = [
    {
      value: apiStats?.plGoals ?? 9,
      suffix: '',
      label: 'Premier League Goals',
      sublabel: `Season ${season}`,
      color: '#EF0107',
    },
    {
      value: apiStats?.plAssists ?? 11,
      suffix: '',
      label: 'Premier League Assists',
      sublabel: `Season ${season}`,
      color: '#ffffff',
    },
    {
      value: apiStats?.plMatches ?? 21,
      suffix: '',
      label: 'Premier League Apps',
      sublabel: `Season ${season}`,
      color: '#C0C0C0',
    },
    {
      value: apiStats?.goalInvolvements ?? 20,
      suffix: '',
      label: 'Goal Involvements',
      sublabel: `PL ${season}`,
      color: '#EF0107',
    },
    {
      value: CAREER.englandCaps,
      suffix: '',
      label: 'England Caps',
      sublabel: 'Three Lions',
      color: '#ffffff',
    },
    {
      value: 7,
      suffix: '',
      label: 'The Shirt',
      sublabel: 'Permanently His',
      color: '#EF0107',
    },
  ]

  return (
    <section
      id="stats"
      className="relative w-full py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Grain overlay */}
      <GrainOverlay />

      {/* Background number watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[50vw] font-normal text-white/[0.02] leading-none"
          style={{ fontFamily: 'Kegilka, serif' }}
        >
          7
        </span>
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-20 relative z-10"
      >
        <p
          className="text-[#EF0107] text-xs tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: 'Mona Sans, sans-serif' }}
        >
          Live Dashboard
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal text-white"
          style={{ fontFamily: 'Kegilka, serif' }}
        >
          BY THE
          <br />
          <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
            NUMBERS
          </span>
        </h2>
      </motion.div>

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex items-center gap-3 origin-left"
      >
        <div className="w-2 h-2 rounded-full bg-[#EF0107] animate-pulse" />
        <span
          className="text-[#EF0107] text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'Mona Sans, sans-serif' }}
        >
          Live · Premier League {season}
        </span>
        <div className="flex-1 h-px bg-[#EF0107]/20" />
      </motion.div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}
