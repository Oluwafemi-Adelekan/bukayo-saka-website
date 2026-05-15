'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react'
import GrainOverlay from './GrainOverlay'

const brands = [
  {
    name: 'New Balance',
    desc: 'Signature boot partner. The Furon v8 "7egacy", co-designed with Bukayo, featuring lion & dove embroidery in Rich Burgundy and Metallic Silver.',
    cta: 'Shop the 7egacy',
    href: 'https://www.newbalance.co.uk/sport/football/football-boots/',
    images: ['/Furon v8.png', '/Furon v8 2.png'],
  },
  {
    name: "Nando's",
    desc: "Brand ambassador since 2022. The limited-edition Peri-Peri Saka sauce sold out across the UK within 48 hours of launch.",
    cta: 'Find Your Nearest',
    href: 'https://www.nandos.co.uk/restaurants',
    images: ["/Nando's.png"],
  },
  {
    name: 'Fashion & Editorial',
    desc: 'GQ cover, Burberry campaigns, Nike collaborations. Off-pitch style as deliberate and precise as his football.',
    cta: 'View Archive',
    href: 'https://www.gq-magazine.co.uk/lifestyle/article/bukayo-saka-interview',
    images: ['/Fashion Editorial.png'],
  },
]

export default function Commercial() {
  const slideRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const { scrollYProgress } = useScroll({
    target: slideRef,
    offset: ['start end', 'start start'],
  })
  // The dark content panel slides up over the background image
  const panelSlideY = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])

  useEffect(() => {
    if (isHovering) return
    const id = setInterval(() => setActiveIdx(i => (i + 1) % brands.length), 5000)
    return () => clearInterval(id)
  }, [isHovering])

  const active = brands[activeIdx]

  return (
    <div
      ref={slideRef}
      id="commercial"
      style={{ height: '250vh', position: 'relative', marginTop: '-100vh', zIndex: 63 }}
    >
      {/* ── Content panel — slides up over BeyondThePitch ── */}
      <motion.section
        className="sticky top-0 overflow-hidden"
        style={{ height: '100vh', background: '#09090b', translateY: panelSlideY, zIndex: 63, marginTop: '-100vh' }}
      >
        <GrainOverlay />

        <div className="flex flex-col md:flex-row md:gap-6" style={{ height: '100%' }}>

          {/* ── Left column ──
              flex-1 on mobile: fills height above the cards column.
              md:flex-none md:w-1/2: half-width on desktop. ── */}
          <div
            className="flex-1 md:flex-none md:w-1/2 flex flex-col shrink-0 pl-4 pr-4 md:pl-6 md:pr-0"
            style={{ paddingTop: 88, paddingBottom: 24 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ margin: 0, padding: 0, marginBottom: 40, flexShrink: 0, lineHeight: 0.88 }}
            >
              <span style={{ display: 'block', fontFamily: 'Kegilka, serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.88, fontWeight: 400, color: '#ffffff' }}>MERCH</span>
              <span style={{ display: 'block', fontFamily: 'Mona Sans, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.88, fontWeight: 300, color: '#ffffff' }}>&amp; BRANDS</span>
            </motion.h2>

            {/* Image area — position:relative so AnimatePresence children use position:absolute
                → no layout shift when switching between 1-image and 2-image brands ── */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'absolute', inset: 0, display: 'flex', gap: 8 }}
                >
                  {active.images.map((src, i) => (
                    <div key={i} style={{ flex: 1, position: 'relative' }}>
                      <Image
                        src={src}
                        alt={active.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'contain', objectPosition: 'left bottom' }}
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right column ──
              shrink-0 on mobile (natural height, cards hug content).
              md:flex-1 on desktop (fills remaining width). ── */}
          <div
            className="shrink-0 md:flex-1 flex flex-col pl-4 md:pl-0 pr-4 md:pr-6 pt-6 md:pt-[88px] pb-16 md:pb-6"
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsHovering(true) }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setIsHovering(false); setHoveredIdx(null) } }}
          >
            {brands.map((brand, i) => {
              const isActive = i === activeIdx

              return (
                <div
                  key={brand.name}
                  // py-3 pl-4: 12px top/bottom + 16px left on mobile
                  // md:py-0 md:pl-5 md:pb-5: bottom-aligned with 20px bottom/left on desktop
                  className="flex-1 py-3 pl-4 md:py-0 md:pl-5 md:pb-5"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                  }}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setHoveredIdx(i)
                    setActiveIdx(i)
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setHoveredIdx(null)
                  }}
                  onClick={() => setActiveIdx(i)}
                >
                  {/* Wipe background — spring physics, fires on active (auto-cycle + hover) */}
                  <motion.div
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 55, damping: 17, mass: 1.3 }}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)', transformOrigin: 'left' }}
                  />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: 'Kegilka, serif',
                      fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                      fontWeight: 400,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.32)',
                      margin: '0 0 8px',
                      lineHeight: 1,
                      transition: 'color 0.4s ease',
                    }}>
                      {brand.name}
                    </h3>

                    <p style={{
                      fontFamily: 'Mona Sans, sans-serif',
                      fontSize: 'var(--body-text-size)',
                      lineHeight: 'var(--body-line-height)',
                      color: isActive ? 'rgba(255,255,255,0.52)' : 'rgba(255,255,255,0.28)',
                      margin: '0 0 12px',
                      transition: 'color 0.4s ease',
                    }}>
                      {brand.desc}
                    </p>

                    {/* CTA row — text reveals on isActive (timer + hover), arrow always left-most */}
                    <a
                      href={brand.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <motion.span
                        animate={{
                          opacity: isActive ? 1 : 0,
                          maxWidth: isActive ? 180 : 0,
                          paddingRight: isActive ? 6 : 0,
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          fontFamily: 'Mona Sans, sans-serif',
                          fontSize: '0.6rem',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: '#ffffff',
                          fontWeight: 700,
                        }}
                      >
                        {brand.cta}
                      </motion.span>
                      <ArrowUpRight
                        size={13}
                        color={isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}
                        weight="bold"
                      />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </motion.section>
    </div>
  )
}
