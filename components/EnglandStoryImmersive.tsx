'use client'

import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { MotionValue, useTransform, motion, useMotionValue, useSpring } from 'framer-motion'
import type { SanityCareerChapter } from '@/lib/sanity/queries'

// ── Scene configuration ───────────────────────────────────────────────────────
const SCENE_DEPTH  = 8800   // camera stops when last images are ~200 units ahead
const PERSPECTIVE  = 1100   // base CSS perspective

// Tight fade-in so items only emerge when genuinely close (chapter-by-chapter reveal).
// Heading at z=-500 exactly equals FADE_IN_END → it's at 100% on entry.
// Images are 550+ units further back → invisible until camera approaches.
const FADE_IN_START  = -650   // start fading in at 650 units ahead
const FADE_IN_END    = -500   // fully opaque at 500 units ahead (~69% scale — swell continues)

// Generous fade-out so items linger well after camera crosses them.
const FADE_OUT_START = 450
const FADE_OUT_END   = 850

const IMAGE_HEIGHT = 420    // all images the same height (px); width is auto

const ENG_FG     = '#0A1946'
const ENG_FG_DIM = 'rgba(10,25,70,0.72)'

// Subtle mouse parallax — premium stiff feel
const PARALLAX_X = 3
const PARALLAX_Y = 1.8

// ── Chapter / image data ──────────────────────────────────────────────────────
const CHAPTERS = [
  {
    lines: ['INTERNATIONAL', 'DEBUT'],
    subtitle: 'October 2020 · First England Cap',
    headingZ: -500,
    headingX: 0,
    headingY: -10,
    images: [
      { src: '/October, 2020 vs Republic of Ireland.jpg', alt: 'vs Republic of Ireland, October 2020', x: -22, y:  6, z: -1050 },
      { src: '/Euro 2020 vs Czech Republic.jpg',          alt: 'Euro 2020 vs Czech Republic',          x:  18, y: -8, z: -1600 },
    ],
  },
  {
    lines: ['WORLD CUP', '2022'],
    subtitle: 'Qatar · Group Stage',
    headingZ: -2600,
    headingX: 4,
    headingY: -8,
    images: [
      { src: '/vs Iran, 2022.jpg',    alt: 'vs Iran, Qatar 2022', x: -28, y:  6, z: -3150 },
      { src: '/World Cup 2022.jpg',   alt: 'World Cup 2022',      x:  22, y:-10, z: -3700 },
      { src: '/World Cup 2022 2.jpg', alt: 'World Cup 2022',      x:  -8, y: 18, z: -4250 },
      { src: '/World Cup 2022 3.png', alt: 'World Cup 2022',      x:  18, y:  4, z: -4800 },
    ],
  },
  {
    lines: ["ENGLAND MEN'S", 'PLAYER OF', 'THE YEAR'],
    subtitle: '2023',
    headingZ: -5900,
    headingX: -4,
    headingY: -8,
    images: [
      { src: '/England Player of the Year.png', alt: "England Men's Player of the Year 2023", x: 0, y: 10, z: -6550 },
    ],
  },
  {
    lines: ['EURO', '2024'],
    subtitle: 'Berlin · Final vs Spain',
    headingZ: -7700,
    headingX: 0,
    headingY: -8,
    images: [
      { src: '/Euro 2024.jpg',   alt: 'Euro 2024', x: -26, y:  5, z: -8200 },
      { src: '/Euro 2024 2.png', alt: 'Euro 2024', x:  20, y: -9, z: -8600 },
      { src: '/Euro 2024 3.jpg', alt: 'Euro 2024', x:  -6, y: 16, z: -9000 },
      { src: '/Euro 2024 4.jpg', alt: 'Euro 2024', x:  26, y: 12, z: -9000 },
    ],
  },
]

// ── Draggable image — spring-lagged drag + velocity throw + 2% hover zoom ────
// Spring settings: moderate stiffness gives the soft "pulling through honey"
// feel while dragging, then the throw carries momentum after release.
const SPRING = { stiffness: 80, damping: 20, mass: 1.2 }
const THROW  = 160   // px of extra travel per px/ms of release velocity

function DraggableImage({ src, alt }: { src?: string; alt?: string }) {
  const rawX    = useMotionValue(0)
  const rawY    = useMotionValue(0)
  const springX = useSpring(rawX, SPRING)
  const springY = useSpring(rawY, SPRING)

  // Ref for immediate movement logic; state for visual cursor/hover re-renders
  const draggingRef  = useRef(false)
  const [dragging, setDragging] = useState(false)
  const startPtr  = useRef({ x: 0, y: 0 })
  const startMot  = useRef({ x: 0, y: 0 })
  const lastPtr   = useRef({ x: 0, y: 0, t: 0 })
  const vel       = useRef({ x: 0, y: 0 })

  return (
    <motion.div
      style={{ x: springX, y: springY, touchAction: 'none', userSelect: 'none',
               cursor: dragging ? 'grabbing' : 'grab' }}
      whileHover={!dragging ? { scale: 1.02 } : {}}
      transition={{ scale: { duration: 0.3, ease: 'easeOut' } }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        draggingRef.current = true
        setDragging(true)
        startPtr.current = { x: e.clientX, y: e.clientY }
        startMot.current = { x: rawX.get(), y: rawY.get() }
        lastPtr.current  = { x: e.clientX, y: e.clientY, t: performance.now() }
        vel.current      = { x: 0, y: 0 }
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current) return
        const now = performance.now()
        const dt  = now - lastPtr.current.t
        if (dt > 0) {
          vel.current.x = (e.clientX - lastPtr.current.x) / dt
          vel.current.y = (e.clientY - lastPtr.current.y) / dt
        }
        lastPtr.current = { x: e.clientX, y: e.clientY, t: now }
        rawX.set(startMot.current.x + (e.clientX - startPtr.current.x))
        rawY.set(startMot.current.y + (e.clientY - startPtr.current.y))
      }}
      onPointerUp={() => {
        draggingRef.current = false
        setDragging(false)
        // Extend target by velocity to create throw momentum
        rawX.set(rawX.get() + vel.current.x * THROW)
        rawY.set(rawY.get() + vel.current.y * THROW)
      }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        style={{
          display: 'block',
          height: 'auto',
          width: 'auto',
          maxHeight: `min(${IMAGE_HEIGHT}px, 45vh)`,
          maxWidth: '70vw',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </motion.div>
  )
}

// ── Flatten into a single item list for the RAF loop ─────────────────────────
interface SceneItem {
  type: 'heading' | 'image'
  x: number; y: number; z: number
  lines?: string[]; subtitle?: string
  src?: string; alt?: string
}

type ChapterInput = typeof CHAPTERS[number] | SanityCareerChapter

function buildSceneItems(chapters: ChapterInput[]): SceneItem[] {
  const items: SceneItem[] = []
  for (const ch of chapters) {
    items.push({ type: 'heading', x: ch.headingX ?? 0, y: ch.headingY ?? 0, z: ch.headingZ, lines: ch.lines, subtitle: ch.subtitle })
    for (const img of ch.images) {
      items.push({ type: 'image', x: img.x, y: img.y, z: img.z, src: img.src ?? undefined, alt: img.alt })
    }
  }
  return items
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  progress: MotionValue<number>
  chapters?: SanityCareerChapter[]
}

export default function EnglandStoryImmersive({ progress, chapters }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef    = useRef<HTMLDivElement>(null)
  const itemRefs    = useRef<(HTMLDivElement | null)[]>([])

  // Build scene items from Sanity chapters when available, fall back to hardcoded
  const sceneItems = useMemo(
    () => buildSceneItems(chapters?.length ? chapters : CHAPTERS),
    [chapters],
  )
  const sceneItemsRef = useRef(sceneItems)
  useEffect(() => { sceneItemsRef.current = sceneItems }, [sceneItems])

  const velocityRef     = useRef(0)
  const prevProgressRef = useRef(0)
  const perspRef        = useRef(PERSPECTIVE)

  // Mouse position — normalised −1 … +1
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  // Smoothed perspective origin (starts at 50% 50%)
  const curOXRef  = useRef(50)
  const curOYRef  = useRef(50)

  const cameraZ      = useTransform(progress, [0, 1], [0, SCENE_DEPTH])
  // Scroll hint fades out after the first tiny scroll
  const scrollHintOp = useTransform(progress, [0, 0.04], [1, 0])

  useEffect(() => {
    let rafId: number
    let lastTime = performance.now()

    const tick = (time: number) => {
      const dt = Math.max(1, time - lastTime)
      lastTime = time

      const p  = progress.get()
      const cz = cameraZ.get()

      // Velocity — smoothed per-frame delta
      const rawVel = (p - prevProgressRef.current) / (dt / 1000)
      prevProgressRef.current = p
      velocityRef.current += (rawVel - velocityRef.current) * 0.12

      // Dynamic perspective narrows at speed ("warp" feel)
      const absVel = Math.abs(velocityRef.current)
      const targetPersp = PERSPECTIVE - Math.min(absVel * 350, 450)
      perspRef.current += (targetPersp - perspRef.current) * 0.08

      // Smooth mouse-parallax on perspective origin
      const tox = 50 + mouseXRef.current * PARALLAX_X
      const toy = 50 + mouseYRef.current * PARALLAX_Y
      curOXRef.current += (tox - curOXRef.current) * 0.10
      curOYRef.current += (toy - curOYRef.current) * 0.10

      if (viewportRef.current) {
        viewportRef.current.style.perspective       = `${Math.max(450, perspRef.current)}px`
        viewportRef.current.style.perspectiveOrigin = `${curOXRef.current}% ${curOYRef.current}%`
      }

      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(${cz}px)`
      }

      sceneItemsRef.current.forEach((item, i) => {
        const el = itemRefs.current[i]
        if (!el) return

        const ez = item.z + cz   // effective Z relative to camera

        // Fade in as items approach — completes well before camera reaches them
        let alpha = 1
        if (ez < FADE_IN_START) {
          alpha = 0
        } else if (ez < FADE_IN_END) {
          alpha = (ez - FADE_IN_START) / (FADE_IN_END - FADE_IN_START)
        }
        // Fade out slowly after camera passes — lingers at full opacity
        if (ez > FADE_OUT_START) {
          alpha *= Math.max(0, 1 - (ez - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START))
        }

        const a = Math.max(0, Math.min(1, alpha))
        el.style.opacity    = `${a}`
        el.style.visibility = a <= 0 ? 'hidden' : 'visible'

        // Chromatic-aberration hint on headings at speed
        if (item.type === 'heading') {
          const h = el.querySelector('.eng-heading') as HTMLElement | null
          if (h) {
            if (absVel > 0.25) {
              const off = velocityRef.current * 2.5
              h.style.textShadow = `${off}px 0 rgba(255,0,60,0.25), ${-off}px 0 rgba(0,230,255,0.25)`
            } else {
              h.style.textShadow = 'none'
            }
          }
        }
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progress, cameraZ])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseXRef.current = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
    mouseYRef.current = (e.clientY - r.top   - r.height / 2) / (r.height / 2)
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = 0
    mouseYRef.current = 0
  }, [])

  const setItemRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[idx] = el
  }, [])

  return (
    <div style={{ height: '820vh', position: 'relative' }}>
      {/* Sticky "camera lens" viewport */}
      <div
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: '50% 50%',
          background: '#ffffff',
        }}
      >
        {/* World — moves along Z axis */}
        <div
          ref={worldRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {sceneItems.map((item, i) => (
            <div
              key={i}
              ref={setItemRef(i)}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate3d(${item.x}vw, ${item.y}vh, ${item.z}px)`,
                backfaceVisibility: 'hidden',
                opacity: 0,
                visibility: 'hidden',
                willChange: 'opacity, visibility',
                pointerEvents: item.type === 'image' ? 'auto' : 'none',
              }}
            >
              {item.type === 'heading' ? (

                /* ── Chapter heading ── */
                <div style={{ transform: 'translate(-50%, -50%)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <p
                    className="eng-heading"
                    style={{
                      fontFamily: 'Kegilka, serif',
                      fontSize: 'clamp(3rem, 10vw, 8rem)',
                      lineHeight: 0.92,
                      fontWeight: 400,
                      color: ENG_FG,
                      textTransform: 'uppercase',
                      margin: 0,
                      letterSpacing: '-0.02em',
                      userSelect: 'none',
                    }}
                  >
                    {item.lines!.map((line, li) => (
                      <span key={li}>{li > 0 && <br />}{line}</span>
                    ))}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Mona Sans, sans-serif',
                      fontSize: '0.65rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: ENG_FG_DIM,
                      margin: '18px 0 0',
                      fontWeight: 600,
                    }}
                  >
                    {item.subtitle}
                  </p>
                </div>

              ) : (

                /* ── Image — spring drag + hover zoom ── */
                <div style={{ transform: 'translate(-50%, -50%)' }}>
                  <DraggableImage src={item.src} alt={item.alt} />
                </div>

              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator — visible on entry, fades out immediately on scroll */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            style={{
              opacity: scrollHintOp,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: ENG_FG_DIM,
                userSelect: 'none',
              }}
            >
              Scroll
            </span>
            <motion.div
              style={{
                width: 1,
                height: 36,
                background: ENG_FG_DIM,
                originY: 0,
              }}
              animate={{ scaleY: [1, 0.15, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Radial vignette to soften the viewport edges */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle, transparent 45%, rgba(255,255,255,0.65) 120%)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      </div>
    </div>
  )
}
