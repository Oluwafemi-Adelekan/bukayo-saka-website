'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const ease = [0.16, 1, 0.3, 1] as const

type Award = {
  label: string
  count: number
  image: string | null
  years: string
}

const PREMIER_LEAGUE_CHAMPION_IMAGE = '/saka-epl-champion.webp'

const AWARDS_FALLBACK: Award[] = [
  { label: 'Premier League Champions',            count: 1, image: PREMIER_LEAGUE_CHAMPION_IMAGE,                years: '2025/26' },
  { label: 'FA Cup Wins',                         count: 1, image: '/FA Cup Win.png',                            years: '2020' },
  { label: 'Community Shield',                    count: 2, image: '/Community Shield.png',                      years: '2020, 2023' },
  { label: 'PFA Young Player of the Year',        count: 1, image: '/PFA Young player of the year.png',          years: '2022' },
  { label: 'Arsenal Player of the Season',        count: 2, image: '/Arsenal P;ayer of the season.png',          years: '2021/22, 2022/23' },
  { label: 'Premiere League Player of the Month', count: 1, image: '/Premiere league player of the month.jpg',   years: 'March 2023' },
]

const IMAGE_HEIGHT = 'clamp(180px, 35vh, 320px)'

// ── Thin diagonal hand-drawn slash ────────────────────────────────
function DiagonalBrush({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: '-12%',
        top: '-12%',
        width: '124%',
        height: '124%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
      aria-hidden
    >
      <defs>
        <filter id="brush-jitter" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      {/* Single thin diagonal stroke, top-left → bottom-right with slight wobble */}
      <path
        d="M 8 88 Q 38 64, 60 44 T 92 12"
        stroke="#EF0107"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
        filter="url(#brush-jitter)"
        style={{
          strokeDasharray: 140,
          strokeDashoffset: active ? 0 : 140,
          transition: active
            ? 'stroke-dashoffset 0.7s cubic-bezier(0.55, 0.05, 0.25, 1)'
            : 'stroke-dashoffset 0.3s ease-in',
        }}
      />
    </svg>
  )
}

// ── Stat counter cell ────────────────────────────────────────────
function StatCell({
  award,
  active,
  onActivate,
  hoverable,
  index,
}: {
  award: Award
  active: boolean
  onActivate: () => void
  hoverable: boolean
  index: number
}) {
  return (
    <motion.button
      onMouseEnter={hoverable ? onActivate : undefined}
      onFocus={hoverable ? onActivate : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease, delay: 0.15 + index * 0.07 }}
      className="text-left relative cursor-default"
      style={{ background: 'none', border: 'none', padding: 0, color: 'inherit' }}
    >
      <div
        style={{
          fontFamily: 'Mona Sans, sans-serif',
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.78)',
          fontWeight: 500,
          marginBottom: 12,
          lineHeight: 1.35,
          // Allow wrapping into multiple lines (matches reference)
          maxWidth: '14ch',
        }}
      >
        {award.label}
      </div>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline' }}>
        <span
          style={{
            fontFamily: 'Kegilka, serif',
            fontSize: 'clamp(3.5rem, 7vw, 7rem)',
            lineHeight: 0.92,
            color: '#fff',
            fontWeight: 400,
          }}
        >
          {award.count}
        </span>
        <span
          style={{
            fontFamily: 'Kegilka, serif',
            fontSize: 'clamp(1.1rem, 2vw, 2rem)',
            lineHeight: 0.92,
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 400,
            marginLeft: 4,
          }}
        >
          x
        </span>
        <DiagonalBrush active={active} />
      </div>
    </motion.button>
  )
}

// ── Main section ─────────────────────────────────────────────────
type Props = {
  inOverlay?: boolean
  trophies?: Award[]
}

export default function TrophyCabinet({ inOverlay = false, trophies }: Props) {
  const sourceAwards = trophies?.length ? trophies : AWARDS_FALLBACK
  const AWARDS = sourceAwards.map((award) =>
    award.label.toLowerCase().includes('premier league champions')
      ? { ...award, image: PREMIER_LEAGUE_CHAMPION_IMAGE }
      : award
  )
  const [active, setActive] = useState(0)
  const stat = AWARDS[active]
  const preserveAspect = stat.label.toLowerCase().includes('premier league champions')

  return (
    <section
      id="trophies"
      className="trophy-cabinet relative w-full overflow-hidden"
      style={{
        background: inOverlay ? 'transparent' : '#7B1218',
        height: '100vh',
        minHeight: '600px',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="trophy-grid"
        style={{
          gap: 32,
          height: '100%',
        }}
      >
        {/* LEFT: header + image + year */}
        <div className="trophy-left" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.header
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
          >
            <h2
              style={{
                fontFamily: 'Kegilka, serif',
                fontWeight: 400,
                fontSize: 'clamp(1.5rem, 2.8vw, 2.6rem)',
                lineHeight: 1.05,
                color: '#fff',
                margin: 0,
                letterSpacing: '-0.005em',
              }}
            >
              TROPHIES &amp;
              <br />
              INDIVIDUAL AWARDS
            </h2>
          </motion.header>

          {/* Image — hidden on mobile, fixed height on web */}
          <motion.div
            className="trophy-image-wrap"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease, delay: 0.1 }}
            style={{ height: IMAGE_HEIGHT, position: 'relative', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={stat.image}
                src={stat.image ?? undefined}
                alt={stat.label}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'block',
                  objectFit: preserveAspect ? 'contain' : 'cover',
                  objectPosition: preserveAspect ? 'center' : 'left center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>

          <div className="trophy-image-wrap" style={{ minHeight: 24 }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={stat.years}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'Mona Sans, sans-serif',
                  fontSize: '0.95rem',
                  color: 'rgba(255,255,255,0.78)',
                  fontWeight: 400,
                  display: 'inline-block',
                }}
              >
                {stat.years}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: 3×2 grid of stats, pushed to the far right */}
        <div
          className="trophy-stats"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, max-content)', // overridden in CSS
            justifyContent: 'end',
            justifySelf: 'end',
            columnGap: 'clamp(16px, 3vw, 48px)',
            rowGap: 'clamp(16px, 2vw, 24px)', // tightened row gap so 3 rows fit
            marginTop: 'auto',
          }}
        >
          {AWARDS.map((a, i) => (
            <StatCell
              key={i}
              award={a}
              active={active === i}
              onActivate={() => setActive(i)}
              hoverable
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Preload images to prevent hover delay */}
      <div style={{ display: 'none' }}>
        {AWARDS.map((award) => award.image && (
          <Image
            key={award.image}
            src={award.image}
            alt={award.label}
            width={100}
            height={100}
            priority
            unoptimized
          />
        ))}
      </div>

      <style jsx>{`
        /* 24px web, 16px mobile. */
        .trophy-cabinet {
          padding: clamp(16px, 2vw, 24px);
        }
        @media (max-width: 767px) {
          .trophy-cabinet {
            padding-bottom: 16px;
          }
        }
        .trophy-grid {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .trophy-grid {
            flex-direction: row;
          }
          .trophy-left  { flex: 0 0 auto; max-width: 38%; }
          /* Stats hug the right edge AND sit at the bottom */
          .trophy-stats {
            margin-left: auto;
            align-self: flex-end;
            grid-template-columns: repeat(2, max-content) !important;
          }
        }
        @media (max-width: 767px) {
          .trophy-image-wrap { display: none; }
          .trophy-stats {
            margin-left: 0;
            justify-content: center !important;
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}
