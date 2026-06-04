'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import GrainOverlay from './GrainOverlay'
import FillButton from './FillButton'
import type { SanityBTPSlide } from '@/lib/sanity/queries'

const OVERLAY_DUR = 580

type Slide = {
 id: string
 navLabel: string
 headline: string
 body: string
 image: string
}

const FALLBACK_SLIDES: Slide[] = [
 {
 id: 'nigeria',
 navLabel: 'BIG SHOE FOUNDATION - NIGERIA',
 headline: 'Funding Life-Changing Surgery for Children in Kano',
 body: 'Partnering with the BigShoe Foundation, Bukayo personally funded 120 transformative medical operations for children in Kano, Nigeria: treating hernias, brain tumours, and conditions that would otherwise remain unaddressed due to poverty. The children who receive these operations often have no other route to treatment. This is not charity for a press release. It is sustained, personal commitment.',
 image: '/Big Shoe Foundation.png',
 },
 {
 id: 'ealing',
 navLabel: 'EALING COMMUNITY - LONDON',
 headline: 'Back to School in the Borough That Made Him',
 body: 'Recognising the devastating impact of the cost-of-living crisis on families in his hometown of Ealing, Bukayo donated over 1,000 school uniforms to local children and their families, enabling kids to return to education with dignity. Born and raised in these streets, he has never forgotten where he came from, nor the people who shared that journey with him.',
 image: '/Ealing Community.png',
 },
]

function resolveSanitySlides(sanitySlides?: SanityBTPSlide[]): Slide[] {
 if (!sanitySlides?.length) return FALLBACK_SLIDES
 return sanitySlides.map(s => ({
 id: s._id,
 navLabel: s.navLabel,
 headline: s.headline,
 body: s.body,
 image: s.image ?? '',
 }))
}

function DiagonalBrush({ active }: { active: boolean }) {
 return (
 <svg
 viewBox="0 0 100 100"
 preserveAspectRatio="none"
 style={{
 position: 'absolute',
 left: '-12%', top: '-12%',
 width: '124%', height: '124%',
 pointerEvents: 'none', overflow: 'visible',
 }}
 aria-hidden
 >
 <defs>
 <filter id="btp-brush" x="-10%" y="-10%" width="120%" height="120%">
 <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="4" />
 <feDisplacementMap in="SourceGraphic" scale="1.6" />
 </filter>
 </defs>
 <path
 d="M 8 88 Q 38 64, 60 44 T 92 12"
 stroke="#EF0107"
 strokeWidth="3.2"
 strokeLinecap="round"
 fill="none"
 opacity="0.95"
 filter="url(#btp-brush)"
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

function BeyondOverlay({ onClose, slides }: { onClose: () => void; slides: Slide[] }) {
 const [activeIdx, setActiveIdx] = useState(0)
 const [contentReady, setContentReady] = useState(false)
 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 const t = setTimeout(() => setContentReady(true), OVERLAY_DUR)
 return () => clearTimeout(t)
 }, [])

 useEffect(() => {
 const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
 window.addEventListener('keydown', fn)
 return () => window.removeEventListener('keydown', fn)
 }, [onClose])

 useEffect(() => {
 const el = scrollRef.current
 if (!el) return
 const handler = () => {
 const idx = Math.round(el.scrollTop / el.clientHeight)
 setActiveIdx(Math.max(0, Math.min(slides.length - 1, idx)))
 }
 el.addEventListener('scroll', handler, { passive: true })
 return () => el.removeEventListener('scroll', handler)
 }, [])

 const ease = [0.16, 1, 0.3, 1] as const
 const fade = (delay: number, dy = 20) => ({
 initial: { opacity: 0, y: dy },
 animate: contentReady ? { opacity: 1, y: 0 } : { opacity: 0, y: dy },
 transition: { duration: 0.7, ease, delay },
 })

 const current = slides[activeIdx]
 // Line at left: 24. Content 24px past the 1px line = left: 49.
 const CONTENT_X = 49

 return (
 <motion.div
 initial={{ opacity: 0, y: 28 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 28 }}
 transition={{ duration: 0.52, ease }}
 style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#09090b', overflow: 'hidden' }}
 >
 <GrainOverlay className="z-[50] pointer-events-none" />

 {/* Snap-scroll image container — z-0, behind text layers */}
 <div
 ref={scrollRef}
 data-overlay-scroll
 style={{
 position: 'absolute', inset: 0,
 overflowY: 'scroll',
 scrollSnapType: 'y mandatory',
 zIndex: 0,
 }}
 >
 {slides.map((slide) => (
 <div
 key={slide.id}
 style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
 >
 <Image
 src={slide.image}
 alt={slide.headline}
 fill
 sizes="100vw"
 style={{ objectFit: 'cover', objectPosition: 'center' }}
 />
 <div style={{
 position: 'absolute', inset: 0,
 background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)',
 }} />
 <div style={{
 position: 'absolute', inset: 0,
 background: 'linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 28%, transparent 52%)',
 }} />
 </div>
 ))}
 </div>

 {/* Vertical rule — left: 24, spans full height with 24px top/bottom inset */}
 <motion.div
 {...fade(0.08)}
 style={{
 position: 'absolute', left: 24, top: 24, bottom: 24,
 width: 1, background: 'rgba(255,255,255,0.2)',
 zIndex: 20, pointerEvents: 'none',
 }}
 />

 {/* Nav labels — top: 24, aligned 24px past the line */}
 <motion.div
 {...fade(0.14)}
 style={{
 position: 'absolute', top: 24, left: CONTENT_X,
 zIndex: 30, display: 'flex', flexDirection: 'column', gap: 20,
 }}
 >
 {slides.map((slide, i) => {
 const isActive = i === activeIdx
 return (
 <button
 key={slide.id}
 onClick={() => {
 setActiveIdx(i)
 const el = scrollRef.current
 if (el) el.scrollTo({ top: i * el.clientHeight, behavior: 'smooth' })
 }}
 style={{
 background: 'none', border: 'none', padding: 0,
 cursor: 'pointer', textAlign: 'left',
 position: 'relative', display: 'inline-block',
 }}
 >
 <span style={{
 fontFamily: 'Mona Sans, sans-serif',
 fontSize: '0.6rem', letterSpacing: '0.22em',
 textTransform: 'uppercase', fontWeight: 600,
 color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)',
 display: 'block', whiteSpace: 'nowrap',
 transition: 'color 0.35s ease',
 }}>
 {slide.navLabel}
 </span>
 <DiagonalBrush active={isActive} />
 </button>
 )
 })}
 </motion.div>

 {/* Headline + body — same left edge as nav, 16px mobile bottom rhythm */}
 <motion.div
 key={current.id}
 initial={{ opacity: 0, y: 12 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease }}
 className="absolute bottom-4"
 style={{
 left: CONTENT_X, right: 16,
 zIndex: 30, pointerEvents: 'none',
 }}
 >
 <h3 style={{
 fontFamily: 'Kegilka, serif',
 fontSize: 'clamp(1.4rem, 2.8vw, 2.6rem)',
 fontWeight: 400, lineHeight: 1.08,
 color: '#ffffff', margin: '0 0 14px',
 maxWidth: 600,
 }}>
 {current.headline}
 </h3>
 <p style={{
 fontFamily: 'Mona Sans, sans-serif',
 fontSize: 'var(--body-text-size)',
 lineHeight: 'var(--body-line-height)',
 color: 'rgba(255,255,255,0.68)',
 margin: 0, maxWidth: 600,
 }}>
 {current.body}
 </p>
 </motion.div>

 {/* X close */}
 <motion.button
 {...fade(0.05, 12)}
 onClick={onClose}
 aria-label="Close"
 className="absolute top-4 right-4 md:top-6 md:right-6"
 style={{
 zIndex: 50,
 color: 'rgba(255,255,255,0.45)',
 background: 'rgba(255,255,255,0.06)',
 border: '1px solid rgba(255,255,255,0.12)',
 backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
 width: 40, height: 40, borderRadius: 999,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 cursor: 'pointer', padding: 0,
 }}
 onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
 onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
 >
 <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
 <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
 </svg>
 </motion.button>
 </motion.div>
 )
}

export default function BeyondThePitch({ slides: sanitySlides }: { slides?: SanityBTPSlide[] }) {
 const slides = resolveSanitySlides(sanitySlides)
 const [showOverlay, setShowOverlay] = useState(false)
 const [mounted, setMounted] = useState(false)

 // Slide-up transform removed to simplify scroll

 useEffect(() => { setMounted(true) }, [])

 useEffect(() => {
 window.dispatchEvent(new Event(showOverlay ? 'lenis:stop' : 'lenis:start'))
 }, [showOverlay])

 return (
 <>
 {mounted && createPortal(
 <AnimatePresence>
 {showOverlay && (
 <BeyondOverlay key="beyond-overlay" onClose={() => setShowOverlay(false)} slides={slides} />
 )}
 </AnimatePresence>,
 document.body
 )}

 <section
 id="foundation"
 className="relative overflow-hidden "
 style={{ height: '100vh', background: '#09090b', zIndex: 62 }}
 >
 <GrainOverlay />

 {/*
 Two-column on desktop, two-row on mobile.
 paddingTop: 88px accounts for fixed nav (~64px) + 24px gap below it.
 */}
 <div
 className="flex flex-col md:flex-row"
 style={{ height: '100%' }}
 >
 {/* ── Left column: heading + subtext + button ── */}
 <div
 className="w-full md:w-1/2 flex flex-col shrink-0 pl-4 pr-4 md:pl-6 md:pr-6"
 style={{ paddingTop: 88 }}
 >
 <motion.h2
 initial={{ opacity: 0, y: 28 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: false, amount: 0.4 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 style={{ margin: 0, padding: 0, lineHeight: 0.96 }}
 >
 <span style={{ display: 'block', fontFamily: 'Kegilka, serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.88, fontWeight: 400, color: '#ffffff' }}>BEYOND</span>
 <span style={{ display: 'block', fontFamily: 'Mona Sans, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', lineHeight: 0.88, fontWeight: 300, color: '#ffffff' }}>THE PITCH</span>
 </motion.h2>

 <motion.p
 initial={{ opacity: 0, y: 18 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-10%" }}
 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
 style={{
 fontFamily: 'Mona Sans, sans-serif',
 fontSize: 'var(--body-text-size)',
 lineHeight: 1.72,
 color: 'rgba(255,255,255,0.48)',
 margin: '18px 0 28px',
 maxWidth: 600,
 width: '100%',
 }}
 >
 Goals and assists tell part of the story. Bukayo Saka&apos;s most important work happens far from any football pitch.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 14 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-10%" }}
 transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
 >
 <FillButton label="Read More" onClick={() => setShowOverlay(true)} />
 </motion.div>
 </div>

 {/* ── Right column: cover image ── */}
 <div className="flex-1 flex items-end justify-end pl-4 pr-4 pb-4 md:pl-0 md:pr-6 md:pb-6 min-h-0 overflow-hidden">
 <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: false, amount: 0.4 }}
 transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
 style={{ position: 'relative' }}
 >
 <motion.div
 initial={{ scaleX: 1 }}
 whileInView={{ scaleX: 0 }}
 viewport={{ once: false, amount: 0.4 }}
 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
 style={{
 position: 'absolute',
 inset: 0,
 background: '#09090b',
 transformOrigin: 'left',
 zIndex: 10,
 }}
 />
 <Image
 src="/Beyond the pitch cover.png"
 alt="Beyond the Pitch"
 width={1200}
 height={900}
 sizes="(max-width: 767px) 92vw, 50vw"
 style={{
 maxHeight: 'min(58vh, calc(100vh - 200px))',
 width: 'auto',
 height: 'auto',
 maxWidth: '100%',
 display: 'block',
 }}
 />
 </motion.div>
 </div>

 </div>
 </section>
 </>
 )
}
