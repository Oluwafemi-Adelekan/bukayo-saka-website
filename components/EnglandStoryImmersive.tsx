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
    // z = -8900: at final camera position (SCENE_DEPTH = 8800), effective z
    // = -100 → ~92% perspective scale. Punches in ~25% from the previous
    // 73% so the images fill the viewport instead of leaving big white gaps,
    // while still leaving room for all four to coexist in the 4 quadrants.
    // All four at the same Z so none is buried behind another in stacking.
    images: [
      { src: '/Euro 2024.jpg',   alt: 'Euro 2024', x: -30, y: -12, z: -8900 },
      { src: '/Euro 2024 2.png', alt: 'Euro 2024', x:  30, y: -12, z: -8900 },
      { src: '/Euro 2024 3.jpg', alt: 'Euro 2024', x: -28, y:  20, z: -8900 },
      { src: '/Euro 2024 4.jpg', alt: 'Euro 2024', x:  28, y:  20, z: -8900 },
    ],
  },
]

// ── Draggable image — spring-lagged drag + 2% hover zoom ────
// Spring settings: moderate stiffness gives the soft "pulling through honey"
// feel while dragging. Throw momentum was disabled (THROW=0) because users
// reported losing track of images after a fast flick — the image would shoot
// to a position outside the visible area or behind another image and become
// hard to re-grab. With THROW=0 the image stays where you dropped it.
const SPRING = { stiffness: 80, damping: 20, mass: 1.2 }
const THROW  = 0

function DraggableImage({ src, alt, isMagnet = false }: { src?: string; alt?: string; isMagnet?: boolean }) {
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
      style={{
        x: springX,
        y: springY,
        touchAction: 'none',
        userSelect: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      // Scale comes from the JS magnet detection in the parent. When the
      // cursor is the nearest visible image (within snap threshold), the
      // image scales up ~8% — visual "snap" feedback that this is the
      // grabbable target AND simultaneously enlarges the hit area so the
      // click lands easily even at depth.
      animate={{ scale: dragging ? 1 : isMagnet ? 1.08 : 1 }}
      transition={{ scale: { duration: 0.25, ease: 'easeOut' } }}
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
          // 55vw on mobile so 4 images in 4 quadrants don't overlap
          // horizontally; 420px cap keeps desktop sizes unchanged.
          maxWidth: 'min(55vw, 420px)',
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

  // Magnet target — index of the nearest visible image to the cursor
  const [magnetIdx, setMagnetIdx] = useState<number>(-1)
  const magnetIdxRef = useRef<number>(-1)

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

  // Snap threshold — how close (in px) the cursor needs to be to a visible
  // image's bounding rect to "snap" to it. The active image scales up to
  // give the user clear feedback ("you've locked onto this one") and the
  // bigger visual hit area makes the click land easily.
  const MAGNET_THRESHOLD = 80

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseXRef.current = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2)
    mouseYRef.current = (e.clientY - r.top   - r.height / 2) / (r.height / 2)

    // Magnetic snap: find the visible image whose bounding rect is closest
    // to the cursor. Distance is 0 when cursor is inside the rect.
    const cx = e.clientX
    const cy = e.clientY
    let nearestIdx = -1
    let nearestDist = MAGNET_THRESHOLD
    for (let i = 0; i < sceneItemsRef.current.length; i++) {
      if (sceneItemsRef.current[i].type !== 'image') continue
      const el = itemRefs.current[i]
      if (!el) continue
      // Only consider images that are actually painted (alpha > 0.5)
      const op = parseFloat(el.style.opacity || '0')
      if (op < 0.5) continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) continue
      const dx = Math.max(rect.left - cx, 0, cx - rect.right)
      const dy = Math.max(rect.top - cy, 0, cy - rect.bottom)
      const dist = Math.sqrt(dx * dx + dy * dy)
      // Tie-breaker: prefer later DOM index (last-painted = topmost stack)
      if (dist < nearestDist || (dist === nearestDist && i > nearestIdx)) {
        nearestDist = dist
        nearestIdx = i
      }
    }
    if (nearestIdx !== magnetIdxRef.current) {
      magnetIdxRef.current = nearestIdx
      setMagnetIdx(nearestIdx)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = 0
    mouseYRef.current = 0
    if (magnetIdxRef.current !== -1) {
      magnetIdxRef.current = -1
      setMagnetIdx(-1)
    }
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

                /* ── Image — spring drag + magnet snap ── */
                <div style={{ transform: 'translate(-50%, -50%)' }}>
                  <DraggableImage src={item.src} alt={item.alt} isMagnet={magnetIdx === i} />
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
