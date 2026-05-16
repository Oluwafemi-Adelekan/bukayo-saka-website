'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, animate, type AnimationPlaybackControls } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight } from '@phosphor-icons/react'
import GrainOverlay from './GrainOverlay'
import FillButton from './FillButton'

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

// ── Mobile card content (image fills top, text pinned at bottom) ─────────────
// Image area is flex:1 with min-height:0 so it grows to fill the carousel zone
// without being affected by the text height — no layout bouncing.
function BrandContent({ brand }: { brand: typeof brands[0] }) {
  return (
    // Solid section background — without this, the active card's transparent
    // areas (around contained images and between text glyphs) bleed through to
    // the underneath card and you see both brands' content overlapping. The
    // clip-path is doing its job; it just has nothing solid to clip.
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#09090b' }}>
      {/* Image area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0, display: 'flex', gap: 8 }}>
        {brand.images.map((src, i) => (
          <div key={i} style={{ flex: 1, position: 'relative' }}>
            <Image
              src={src}
              alt={brand.name}
              fill
              unoptimized
              style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
            />
          </div>
        ))}
      </div>

      {/* Text — fixed-height block at bottom, no shrink */}
      <div style={{ flexShrink: 0, paddingTop: 24 }}>
        <h3 style={{
          fontFamily: 'Kegilka, serif',
          fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
          fontWeight: 400,
          color: '#ffffff',
          margin: '0 0 10px',
          lineHeight: 1,
        }}>
          {brand.name}
        </h3>
        <p style={{
          fontFamily: 'Mona Sans, sans-serif',
          fontSize: 'var(--body-text-size)',
          lineHeight: 'var(--body-line-height)',
          color: 'rgba(255,255,255,0.6)',
          margin: '0 0 18px',
          maxWidth: 600,
        }}>
          {brand.desc}
        </p>
        <a
          href={brand.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <FillButton label={brand.cta.toUpperCase()} />
        </a>
      </div>
    </div>
  )
}

export default function Commercial() {
  const slideRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  // dotIdx is updated SYNCHRONOUSLY at the moment a swipe / tap commits, while
  // activeIdx waits for the animation to finish. Dots reflect the user's intent
  // immediately so the indicator never feels laggy.
  const [dotIdx, setDotIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const touchStartXRef = useRef(0)
  const baseTrackXRef = useRef(0)
  // hasMovedRef distinguishes a TAP (no real movement) from a SWIPE. We only
  // cancel the auto-cycle's pending state swap on actual movement — a tap on
  // the carousel during the peel must NOT desync activeIdx from the visuals.
  const hasMovedRef = useRef(false)
  const animRef = useRef<AnimationPlaybackControls | null>(null)
  // Cancellation token for the in-flight commit. Replaces a fixed setTimeout —
  // state advances tied to the animation's own completion via playback.then(),
  // so the activeIdx can never get stuck out of sync with trackX even if iOS
  // throttles timers in the background.
  const commitTokenRef = useRef<{ cancelled: boolean } | null>(null)

  // ── Real-time peel ─────────────────────────────────────────────────────
  // trackX is signed: negative when the user is swiping LEFT (forward → next),
  // positive when swiping RIGHT (backward → prev). The active card's clip-path
  // is derived directly from trackX, so the peel responds 1:1 with the finger.
  const trackX = useMotionValue(0)
  const getCarouselWidth = useCallback(() => {
    if (typeof window === 'undefined') return 1
    return carouselRef.current?.offsetWidth ?? window.innerWidth
  }, [])

  // Clip the active card from the right when peeling forward, from the left
  // when peeling backward. The underneath card is rendered with the OPPOSITE
  // direction's brand so the right reveal sits underneath the right clip.
  const activeClip = useTransform(trackX, (v) => {
    const w = getCarouselWidth()
    const pct = Math.min(100, (Math.abs(v) / w) * 100)
    if (v < 0) return `inset(0 ${pct}% 0 0)` // peel from right → next visible on right
    if (v > 0) return `inset(0 0 0 ${pct}%)` // peel from left → prev visible on left
    return 'inset(0 0% 0 0)'
  })

  // Direction-aware "next" and "prev" underneath layers. We render BOTH and
  // toggle their opacity off the sign of trackX (binary, not interpolated), so
  // there's no React re-render delay during the swipe.
  const nextOpacity = useTransform(trackX, (v) => (v < 0 ? 1 : 0))
  const prevOpacity = useTransform(trackX, (v) => (v > 0 ? 1 : 0))

  const { scrollYProgress } = useScroll({
    target: slideRef,
    offset: ['start end', 'start start'],
  })
  // The dark content panel slides up over the background image
  const panelSlideY = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])

  // Spring matches FillButton / menu drape easing — calm, with weight.
  const PEEL_SPRING = { type: 'spring' as const, stiffness: 55, damping: 17, mass: 1.3 }

  // Commit a peel: animate trackX off-screen, and swap activeIdx exactly when
  // the animation actually finishes (via playback.then()), not on a fixed
  // timer. A cancellation token guards the success path so an interrupted
  // commit (user grabs the carousel mid-animation) can't fire a late state
  // update.
  const commit = useCallback((direction: 'forward' | 'backward') => {
    if (commitTokenRef.current) commitTokenRef.current.cancelled = true
    animRef.current?.stop()

    const w = getCarouselWidth()
    const target = direction === 'forward' ? -w : w
    const newIdx = direction === 'forward'
      ? (activeIdx + 1) % brands.length
      : (activeIdx - 1 + brands.length) % brands.length

    const token = { cancelled: false }
    commitTokenRef.current = token

    // Update dotIdx IMMEDIATELY so the indicator snaps to the new brand the
    // instant the swipe commits — no waiting on the spring to settle.
    setDotIdx(newIdx)

    const playback = animate(trackX, target, PEEL_SPRING)
    animRef.current = playback

    playback.then(() => {
      // Only land the activeIdx update if this exact commit is still the latest
      if (!token.cancelled && commitTokenRef.current === token) {
        setActiveIdx(newIdx)
        trackX.set(0)
        commitTokenRef.current = null
      }
    })
  }, [activeIdx, getCarouselWidth, trackX])

  // Detect mobile via matchMedia (kept in sync on viewport resize).
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const update = () => setIsMobile(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Auto-cycle: 10s on mobile with the spring peel; 5s on desktop with the
  // existing direct activeIdx swap (which drives the image fade + brand-card
  // wipe). Paused while the user is hovering/interacting.
  useEffect(() => {
    if (isHovering) return
    const interval = isMobile ? 10000 : 5000
    const id = setInterval(() => {
      if (isMobile) commit('forward')
      else setActiveIdx(i => (i + 1) % brands.length)
    }, interval)
    return () => clearInterval(id)
  }, [isHovering, isMobile, commit])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (commitTokenRef.current) commitTokenRef.current.cancelled = true
      animRef.current?.stop()
    }
  }, [])

  const active = brands[activeIdx]
  const nextIdx = (activeIdx + 1) % brands.length
  const prevIdx = (activeIdx - 1 + brands.length) % brands.length

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

        {/* ── Mobile carousel (md:hidden) ─────────────────────────────────
            Real-time Capture One peel — active card on top has clip-path
            tied to trackX, two pre-rendered "next" and "prev" underneath
            layers toggle via opacity off the sign of trackX. */}
        <div
          className="md:hidden flex flex-col"
          style={{ height: '100%', paddingTop: 88, paddingBottom: 64, paddingLeft: 16, paddingRight: 16 }}
        >
          {/* Heading — never re-renders between brands, stays put */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: 0, padding: 0, lineHeight: 0.88, flexShrink: 0 }}
          >
            <span style={{ display: 'block', fontFamily: 'Kegilka, serif', fontSize: 'clamp(2.2rem, 8vw, 3rem)', lineHeight: 0.88, fontWeight: 400, color: '#ffffff' }}>MERCH</span>
            <span style={{ display: 'block', fontFamily: 'Mona Sans, sans-serif', fontSize: 'clamp(2.2rem, 8vw, 3rem)', lineHeight: 0.88, fontWeight: 300, color: '#ffffff' }}>&amp; BRANDS</span>
          </motion.h2>

          {/* Carousel zone */}
          <div
            ref={carouselRef}
            className="relative overflow-hidden"
            style={{ flex: 1, minHeight: 0, marginTop: 32, marginBottom: 20 }}
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX
              hasMovedRef.current = false
              // IMPORTANT: don't cancel any in-flight commit here. A pure tap
              // must allow the auto-cycle to finish naturally — cancelling its
              // setTimeout strands the state at the old activeIdx while the
              // visuals show the new brand (the bug from the screenshot).
            }}
            onTouchMove={(e) => {
              const dx = e.touches[0].clientX - touchStartXRef.current
              // First real movement (>5px): the user is swiping, not tapping.
              // Take over from the auto-cycle now.
              if (!hasMovedRef.current && Math.abs(dx) > 5) {
                hasMovedRef.current = true
                if (commitTokenRef.current) commitTokenRef.current.cancelled = true
                animRef.current?.stop()
                baseTrackXRef.current = trackX.get()
                setIsHovering(true)
              }
              if (!hasMovedRef.current) return

              const w = getCarouselWidth()
              let next = baseTrackXRef.current + dx
              // End-stop: at the last brand, dampen forward drag past 0.
              // At the first brand, dampen backward drag past 0. The carousel
              // is NOT infinite for manual swipes.
              const atLast = activeIdx === brands.length - 1
              const atFirst = activeIdx === 0
              if (atLast && next < 0) next = next * 0.18
              if (atFirst && next > 0) next = next * 0.18
              if (next > w) next = w + (next - w) * 0.25
              if (next < -w) next = -w + (next + w) * 0.25
              trackX.set(next)
            }}
            onTouchEnd={(e) => {
              // Pure tap (no movement) — let the auto-cycle continue uninterrupted
              if (!hasMovedRef.current) return

              const dx = e.changedTouches[0].clientX - touchStartXRef.current
              const w = getCarouselWidth()
              const threshold = w * 0.22
              const atLast = activeIdx === brands.length - 1
              const atFirst = activeIdx === 0
              if (dx < -threshold && !atLast) {
                commit('forward')
              } else if (dx > threshold && !atFirst) {
                commit('backward')
              } else {
                animRef.current = animate(trackX, 0, PEEL_SPRING)
              }
              setIsHovering(false)
            }}
            onTouchCancel={() => {
              if (hasMovedRef.current) {
                animRef.current = animate(trackX, 0, PEEL_SPRING)
                setIsHovering(false)
              }
            }}
          >
            {/* "Next" underneath layer — visible while trackX < 0 (peeling forward) */}
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: nextOpacity }}>
              <BrandContent brand={brands[nextIdx]} />
            </motion.div>

            {/* "Prev" underneath layer — visible while trackX > 0 (peeling backward) */}
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: prevOpacity }}>
              <BrandContent brand={brands[prevIdx]} />
            </motion.div>

            {/* Active card on top — clip-path responds 1:1 to finger drag */}
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, clipPath: activeClip }}>
              <BrandContent brand={active} />
            </motion.div>
          </div>

          {/* Dots — left-aligned, sit 64px above the viewport bottom so the
              FixedBrand text never overlaps them. */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, flexShrink: 0 }}>
            {brands.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i === activeIdx) return
                  // Cancel any in-flight peel + state swap, then jump
                  if (commitTokenRef.current) commitTokenRef.current.cancelled = true
                  animRef.current?.stop()
                  trackX.set(0)
                  setActiveIdx(i)
                  setDotIdx(i)
                }}
                aria-label={`Show brand ${i + 1}`}
                style={{
                  width: i === dotIdx ? 24 : 8,
                  height: 4,
                  borderRadius: 2,
                  border: 'none',
                  padding: 0,
                  background: i === dotIdx ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Desktop layout (hidden md:flex) — unchanged ─────────────── */}
        <div className="hidden md:flex md:flex-row md:gap-6" style={{ height: '100%' }}>

          {/* ── Left column ── */}
          <div
            className="md:flex-none md:w-1/2 flex flex-col shrink-0 md:pl-6 md:pr-0"
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

          {/* ── Right column ── */}
          <div
            className="md:flex-1 flex flex-col md:pl-0 md:pr-6 md:pt-[88px] md:pb-6"
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsHovering(true) }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') { setIsHovering(false); setHoveredIdx(null) } }}
          >
            {brands.map((brand, i) => {
              const isActive = i === activeIdx

              return (
                <div
                  key={brand.name}
                  className="flex-1 md:py-0 md:pl-5 md:pb-5"
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
