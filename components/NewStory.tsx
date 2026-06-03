'use client'

import { VimeoCover } from './VimeoCover';
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion'
import GrainOverlay from './GrainOverlay'
import StoryDetailOverlay, { type StoryDetail } from './StoryDetailOverlay'
import FillButton from './FillButton'
import RevealArrowCta from './RevealArrowCta'

type StoryItem = {
  id: string
  title: string
  desc: string
  href: string
  media: {
    type: 'image' | 'video'
    src: string
    position?: string
  }
}

const storyItems: StoryItem[] = [
  {
    id: 'early-life',
    title: 'Early Life',
    desc: 'Born in Ealing to a close Nigerian family, Bukayo learns the values that shape everything still to come.',
    href: '#story',
    media: { type: 'image', src: '/Ealry Life.png', position: 'center' },
  },
  {
    id: 'hale-end-academy',
    title: 'Hale End Academy',
    desc: 'A seven-year-old joins Arsenal and grows through Hale End with the balance, humility, and bravery of a future star.',
    href: '#story',
    media: { type: 'image', src: '/under-10-120311pafc-3105x2023.webp', position: 'center 34%' },
  },
  {
    id: 'professional-debut',
    title: 'Professional Debut',
    desc: 'At seventeen, the first senior minutes arrive in Europe and the pathway from academy promise becomes real.',
    href: '#story',
    media: {
      type: 'video',
      src: '1198207080',
    },
  },
  {
    id: 'england-call-up',
    title: 'England Call Up',
    desc: 'The Three Lions call comes early, opening a new chapter on international nights and tournament stages.',
    href: '#story',
    media: {
      type: 'video',
      src: '1198207081',
    },
  },
]

const storyDetails: Record<string, StoryDetail> = {
  'early-life': {
    id: 'early-life',
    title: ['EARLY', 'LIFE'],
    intro:
      'Born in Ealing and raised in Greenford, Bukayo Ayoyinka Temidayo Moses Saka grew up in a close Nigerian family where school, family, humility, and football all shaped the same story.',
    heroImage: {
      src: '/Ealry Life.png',
      alt: 'Aerial view of Ealing and Greenford streets',
      position: 'center',
    },
    panels: [
      {
        type: 'text',
        body:
          "Before Arsenal, there was Greenford Celtic. At around six years old, Saka's family looked for a local team and he quickly stood out, playing with the joy and balance that would later define him. He has often credited his father, Yomi, as the person who kept him grounded and humble from childhood.",
      },
      {
        type: 'image',
        src: '/story/early-life/saka-greenford.jpg',
        alt: 'Young footballers in Greenford Celtic shirts',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'image',
        src: '/story/early-life/saka-watford.jpg',
        alt: 'Young Bukayo Saka in a Watford youth shirt',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'image',
        src: '/story/early-life/saka-early-life-last.jpg',
        alt: 'Bukayo Saka portrait against a grey wall',
        variant: 'wide',
        position: 'center',
      },
    ],
  },
  'hale-end-academy': {
    id: 'hale-end-academy',
    title: ['HALE END', 'ACADEMY'],
    intro:
      'From pre-academy sessions to signing his first Arsenal forms in 2010, Saka grew inside Hale End with the work ethic, courage, and humility that still define his game.',
    heroImage: {
      src: '/story/hale-end-academy/hale-end-academy-cover.webp',
      alt: 'Young Bukayo Saka in Arsenal academy colours',
      position: 'center 28%',
    },
    panels: [
      {
        type: 'text',
        body:
          'Saka signed official forms with Arsenal on May 5, 2010, aged eight, joining the under-nines after time in the pre-academy. Hale End placed him among a gifted generation and sharpened the habits that followed him into the first team: constant learning, quick combinations, and the confidence to play across positions when coaches asked more of him.',
      },
      {
        type: 'image',
        src: '/story/hale-end-academy/saka-hale-end-academy-2.webp',
        alt: 'Arsenal Hale End under-10 academy group',
        variant: 'card',
        position: 'center',
        aspectRatio: '589 / 309',
        ratio: 589 / 309,
      },
      {
        type: 'image',
        src: '/story/hale-end-academy/saka-hale-end-academy-4.webp',
        alt: 'Young Bukayo Saka in academy football',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'image',
        src: '/story/hale-end-academy/saka-hale-end-academy-3.webp',
        alt: 'Bukayo Saka during his Hale End academy years',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'image',
        src: '/gettyimages-928190422-3000x2093.jpg',
        alt: 'Bukayo Saka as an Arsenal academy graduate',
        variant: 'wide',
        position: 'center',
      },
    ],
  },
  'professional-debut': {
    id: 'professional-debut',
    title: ['PROFESSIONAL', 'DEBUT'],
    intro:
      'On 29 November 2018, a 17-year-old Bukayo Saka stepped onto the pitch in Poltava, Ukraine, to make his senior professional debut for Arsenal in the UEFA Europa League against Vorskla Poltava. The journey from Hale End to the first team was complete, and a new chapter was just beginning.',
    heroImage: {
      src: '/story/professional-debut/professional-debut-cover.webp',
      alt: 'Bukayo Saka making his professional debut for Arsenal',
      position: 'center',
    },
    panels: [
      {
        type: 'text',
        body:
          'Coming on as a substitute in the freezing cold of Ukraine, Saka showed the same directness and fearlessness that had defined his academy years. At 17 years and 86 days old, he became one of the youngest players to represent Arsenal in European competition. Unai Emery gave him the nod, and Saka repaid the trust with a composed, confident cameo that hinted at the superstar within.',
      },
      {
        type: 'image',
        src: '/story/professional-debut/professional-debut-2.webp',
        alt: 'Bukayo Saka in action during his professional debut',
        variant: 'card',
        position: 'center',
        aspectRatio: '2356 / 1693',
        ratio: 2356 / 1693,
      },
      {
        type: 'text',
        body:
          'His home debut followed on 13 December 2018 against Qarabag at the Emirates, and by New Year\'s Day 2019 he had made his Premier League bow against Fulham. The pathway from academy promise to first-team regular was accelerating faster than anyone had predicted. By the end of the 2019-20 season, Saka had cemented himself as one of Arsenal\'s most important players, versatile, brave, and relentlessly effective.',
      },
      {
        type: 'image',
        src: '/story/professional-debut/professional-debut-3.webp',
        alt: 'Bukayo Saka celebrating in Arsenal colours',
        variant: 'card',
        position: 'center',
        aspectRatio: '2356 / 1661',
        ratio: 2356 / 1661,
      },
      {
        type: 'text',
        heading: 'FA CUP WINNER',
        body:
          'On 1 August 2020, Arsenal lifted their 14th FA Cup, defeating Chelsea 2-1 at an empty Wembley. Pierre-Emerick Aubameyang scored twice, the second a cool, arcing chip, to seal Mikel Arteta\'s first trophy as manager. And Saka, just 18 years old, was on the pitch for every second of it. His performances throughout the tournament, fearless, direct, and tactically mature, underlined his emergence as indispensable to this Arsenal side.',
      },
      {
        type: 'video',
        src: '1198205616',
        variant: 'card',
        aspectRatio: '16 / 9',
        ratio: 16 / 9,
      },
      {
        type: 'text',
        heading: 'PREMIER LEAGUE CHAMPIONS',
        body:
          'In May 2026, Arsenal crowned a spectacular league campaign by winning the Premier League title, the club\'s first in over two decades. Saka was at the heart of everything, delivering world-class performances week after week under relentless title-race pressure. From match-winning goals to decisive assists, he was the talisman who carried the Gunners to the summit of English football. The boy from Ealing had helped bring the league title back to North London.',
      },
      {
        type: 'video',
        embedSrc: 'https://player.vimeo.com/video/1195264554?background=1&autoplay=1&muted=1&loop=1&controls=0&autopause=0&badge=0&byline=0&title=0&portrait=0&quality=1080p&dnt=1',
        variant: 'card',
        aspectRatio: '16 / 9',
        ratio: 16 / 9,
        label: 'Saka EPL Winner',
      },
      {
        type: 'image',
        src: '/story/professional-debut/saka-professional-debut-end.webp',
        alt: 'Bukayo Saka celebrating the FA Cup win',
        variant: 'wide',
        position: 'center',
      },
    ],
  },
  'england-call-up': {
    id: 'england-call-up',
    title: ['ENGLAND', 'CALL-UP'],
    intro:
      "Bukayo Saka's journey with the England national team has been one of immense pride, heartbreaking setbacks, and incredible redemption. From making his debut in 2020 to becoming the nation's undisputed star boy, he has captured the hearts of the country.",
    heroImage: {
      src: '/England Call up cover.png',
      alt: 'Bukayo Saka in England kit',
      position: 'center',
    },
    panels: [
      {
        type: 'text',
        body: 'Saka made his senior international debut on 8 October 2020 against Wales. By the time Euro 2020 rolled around, he had become a fan favourite, propelling the Three Lions to their first major final in 55 years. But the final at Wembley ended in heartbreak, as Saka bravely stepped up to take the decisive penalty only to see it saved.',
      },
      {
        type: 'image',
        src: '/England Call up 2.png',
        alt: 'Saka playing for England',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'text',
        body: "The aftermath was intensely difficult, but Saka's response defined him. He said: \"I have faith in God, to come back from something like that was really difficult. I used it to make me stronger.\" His performances for both club and country reached new heights as he channeled that pain into becoming one of the most effective and unstoppable wingers in world football.",
      },
      {
        type: 'image',
        src: '/England Call up 3.png',
        alt: 'Saka smiling with England teammates',
        variant: 'card',
        position: 'center',
      },
      {
        type: 'text',
        heading: 'REDEMPTION AT EURO 2024',
        body: "His ultimate moment of redemption arrived in the Euro 2024 quarter-final against Switzerland. With England trailing and time running out, Saka cut inside and curled a stunning 80th-minute equaliser in off the post. When the match went to penalties, he fearlessly stepped up and dispatched his spot-kick, burying the ghosts of 2020. \"I believed, I felt like we dominated the whole game,\" he said. \"The chance would come and it did come, I was the one who took it so I'm proud of myself for that.\"",
      },
      {
        type: 'image',
        src: '/England Call up last.jpg',
        alt: 'Bukayo Saka celebrating his goal against Switzerland at Euro 2024',
        variant: 'wide',
        position: 'center',
      },
    ],
  },
}

function StoryBackground({ item, active }: { item: StoryItem; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (active) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [active])

  return (
    <motion.div
      key={item.title}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 1 : 1.012,
      }}
      transition={{
        opacity: { duration: 1.45, ease: [0.45, 0, 0.2, 1] },
        scale: { duration: 2.2, ease: [0.16, 1, 0.3, 1] },
      }}
      className="absolute inset-0"
    >
      {item.media.type === 'image' ? (
        <Image
          src={item.media.src}
          alt=""
          fill
          unoptimized={true}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: item.media.position || 'center' }}
        />
      ) : (
        <VimeoCover id={item.media.src} />
      )}
    </motion.div>
  )
}

function StoryCard({
  item,
  active,
  onActivate,
  detailId,
}: {
  item: StoryItem
  active: boolean
  onActivate: () => void
  detailId?: string
}) {
  return (
    <a
      href={detailId ? `#story-${detailId}` : item.href}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      className="group relative flex min-h-0 flex-col justify-end overflow-hidden px-4 pb-4 pt-5 text-left md:px-6 md:pb-7 md:pt-6"
      style={{ textDecoration: 'none' }}
    >
      <motion.div
        animate={{ scaleY: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 55, damping: 17, mass: 1.3 }}
        className="absolute inset-0 bg-[#111111]/95"
        style={{ originY: 1 }}
      />

      <div
        className="relative z-10 flex h-full flex-col justify-end"
      >
        <h3
          style={{
            fontFamily: 'Kegilka, serif',
            fontSize: 'clamp(1.55rem, 2.6vw, 2.55rem)',
            fontWeight: 400,
            lineHeight: 1,
            color: active ? '#ffffff' : 'rgba(255,255,255,0.45)',
            margin: '0 0 12px',
            minHeight: '2em',
            display: 'flex',
            alignItems: 'flex-end',
            transition: 'color 0.35s ease',
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: 'var(--body-text-size)',
            lineHeight: 'var(--body-line-height)',
            color: active ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.35)',
            margin: '0 0 24px',
            maxWidth: 520,
            minHeight: 'calc(var(--body-text-size) * var(--body-line-height) * 3)',
            transition: 'color 0.35s ease',
          }}
        >
          {item.desc}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', minHeight: 18, marginTop: 16 }}>
          <RevealArrowCta as="div" label="EXPLORE" active={active} />
        </div>
      </div>
    </a>
  )
}

function StoryMobileContent({ item, detailId }: { item: StoryItem; detailId?: string }) {
  return (
    <a
      href={detailId ? `#story-${detailId}` : item.href}
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 0,
        textDecoration: 'none',
        textShadow: '0 2px 18px rgba(0,0,0,0.55)',
      }}
    >
      <h3
        style={{
          fontFamily: 'Kegilka, serif',
          fontSize: 'clamp(1.85rem, 9vw, 2.55rem)',
          fontWeight: 400,
          lineHeight: 1,
          color: '#ffffff',
          margin: '0 0 14px',
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontFamily: 'Mona Sans, sans-serif',
          fontSize: 'var(--body-text-size)',
          lineHeight: 'var(--body-line-height)',
          color: 'rgba(255,255,255,0.72)',
          margin: '0 0 28px',
          maxWidth: 520,
        }}
      >
        {item.desc}
      </p>
        <div style={{ display: 'flex', alignItems: 'center', minHeight: 18 }}>
          <FillButton as="div" label="EXPLORE" />
        </div>
    </a>
  )
}

export default function NewStory() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartXRef = useRef(0)
  const baseTrackXRef = useRef(0)
  const hasMovedRef = useRef(false)
  const animRef = useRef<AnimationPlaybackControls | null>(null)
  const commitTokenRef = useRef<{ cancelled: boolean } | null>(null)
  const wasInViewRef = useRef(false)
  const hasEnteredOnceRef = useRef(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [dotIdx, setDotIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const [isSectionInView, setIsSectionInView] = useState(false)
  const active = storyItems[activeIdx]
  const nextIdx = (activeIdx + 1) % storyItems.length
  const prevIdx = (activeIdx - 1 + storyItems.length) % storyItems.length
  const trackX = useMotionValue(0)

  const getCarouselWidth = useCallback(() => {
    if (typeof window === 'undefined') return 1
    return carouselRef.current?.offsetWidth ?? window.innerWidth
  }, [])

  const activeClip = useTransform(trackX, (v) => {
    const w = getCarouselWidth()
    const pct = Math.min(100, (Math.abs(v) / w) * 100)
    if (v < 0) return `inset(0 ${pct}% 0 0)`
    if (v > 0) return `inset(0 0 0 ${pct}%)`
    return 'inset(0 0% 0 0)'
  })
  const nextOpacity = useTransform(trackX, (v) => (v < 0 ? 1 : 0))
  const prevOpacity = useTransform(trackX, (v) => (v > 0 ? 1 : 0))
  const nextClip = useTransform(trackX, (v) => {
    if (v >= 0) return 'inset(0 0 0 100%)'
    const w = getCarouselWidth()
    const pct = Math.min(100, (Math.abs(v) / w) * 100)
    return `inset(0 0 0 ${100 - pct}%)`
  })
  const prevClip = useTransform(trackX, (v) => {
    if (v <= 0) return 'inset(0 100% 0 0)'
    const w = getCarouselWidth()
    const pct = Math.min(100, (Math.abs(v) / w) * 100)
    return `inset(0 ${100 - pct}% 0 0)`
  })

  const PEEL_SPRING = { type: 'spring' as const, stiffness: 55, damping: 17, mass: 1.3 }

  const setActive = useCallback((idx: number) => {
    setActiveIdx(idx)
    setDotIdx(idx)
  }, [])

  const commit = useCallback((direction: 'forward' | 'backward') => {
    if (commitTokenRef.current) commitTokenRef.current.cancelled = true
    animRef.current?.stop()

    const w = getCarouselWidth()
    const target = direction === 'forward' ? -w : w
    const newIdx = direction === 'forward'
      ? (activeIdx + 1) % storyItems.length
      : (activeIdx - 1 + storyItems.length) % storyItems.length

    const token = { cancelled: false }
    commitTokenRef.current = token
    setDotIdx(newIdx)

    const playback = animate(trackX, target, PEEL_SPRING)
    animRef.current = playback

    playback.then(() => {
      if (!token.cancelled && commitTokenRef.current === token) {
        setActiveIdx(newIdx)
        trackX.set(0)
        commitTokenRef.current = null
      }
    })
  }, [activeIdx, getCarouselWidth, trackX])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node || typeof window === 'undefined') return

    const check = () => {
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const inView = rect.top < vh * 0.72 && rect.bottom > vh * 0.2

      if (inView === wasInViewRef.current) return
      wasInViewRef.current = inView
      node.dataset.inView = inView ? 'true' : 'false'
      setIsSectionInView(inView)

      if (inView && !hasEnteredOnceRef.current) {
        hasEnteredOnceRef.current = true
        if (commitTokenRef.current) commitTokenRef.current.cancelled = true
        animRef.current?.stop()
        trackX.set(0)
        setActive(0)
      }
    }

    const interval = window.setInterval(check, 200)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    node.dataset.inView = 'false'
    check()

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [setActive, trackX])

  useEffect(() => {
    if (!isSectionInView || isInteracting) return
    const interval = isMobile ? 10000 : 5000
    const id = setInterval(() => {
      if (isMobile) commit('forward')
      else setActive((activeIdx + 1) % storyItems.length)
    }, interval)
    return () => clearInterval(id)
  }, [activeIdx, commit, isInteracting, isMobile, isSectionInView, setActive])

  useEffect(() => {
    return () => {
      if (commitTokenRef.current) commitTokenRef.current.cancelled = true
      animRef.current?.stop()
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      id="story"
      className="relative bg-[#09090b]"
      data-in-view="true"
      style={{ height: '250vh' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        #story[data-in-view="true"] .new-story-reveal,
        #story[data-in-view="true"] .new-story-reveal-line,
        #story[data-in-view="true"] .new-story-reveal-card,
        #story[data-in-view="true"] .new-story-reveal-mobile {
          opacity: 1 !important;
          transform: translate3d(0, 0, 0) scale(1) !important;
        }
      `}} />
      <section className="sticky top-0 min-h-[100svh] overflow-hidden bg-[#09090b]">
        {storyItems.map((item, i) => (
          <StoryBackground key={item.title} item={item} active={i === activeIdx} />
        ))}

        <div className="absolute inset-0 bg-black/58" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/18 to-black/62" />
        <GrainOverlay className="z-[3]" />

        <div
          className="relative z-10 flex min-h-[100svh] flex-col px-4 pb-6 pt-[88px] md:px-6 md:pb-6"
        >
          <div
            className="new-story-reveal-heading"
          >
            <h2 style={{ margin: 0, padding: 0, lineHeight: 0.96 }}>
              <span
                className="new-story-reveal-line new-story-reveal-line-0"
                style={{
                  display: 'block',
                  fontFamily: 'Kegilka, serif',
                  fontSize: 'clamp(3.2rem, 6.5vw, 7.2rem)',
                  lineHeight: 0.96,
                  fontWeight: 400,
                  color: '#ffffff',
                }}
              >
                THE
              </span>
              <span
                className="new-story-reveal-line new-story-reveal-line-1"
                style={{
                  display: 'block',
                  fontFamily: 'Mona Sans, sans-serif',
                  fontSize: 'clamp(3.2rem, 6.5vw, 7.2rem)',
                  lineHeight: 0.96,
                  fontWeight: 300,
                  color: '#ffffff',
                }}
              >
                STORY
              </span>
            </h2>

            <p
              className="new-story-reveal-line new-story-reveal-line-2"
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 'var(--body-line-height)',
                color: 'rgba(255,255,255,0.82)',
                margin: '28px 0 0',
                maxWidth: 760,
              }}
            >
              From Ealing streets to Hale End, from a first senior shirt to England nights, trace the moments that shaped Bukayo Saka's rise.
            </p>
          </div>

          <div
            ref={carouselRef}
            className="new-story-reveal new-story-reveal-mobile relative mt-8 min-h-0 flex-1 overflow-hidden md:hidden"
            onTouchStart={(e) => {
              touchStartXRef.current = e.touches[0].clientX
              hasMovedRef.current = false
              setIsInteracting(true)
            }}
            onTouchMove={(e) => {
              const dx = e.touches[0].clientX - touchStartXRef.current
              if (!hasMovedRef.current && Math.abs(dx) > 5) {
                hasMovedRef.current = true
                if (commitTokenRef.current) commitTokenRef.current.cancelled = true
                animRef.current?.stop()
                baseTrackXRef.current = trackX.get()
              }
              if (!hasMovedRef.current) return
              const w = getCarouselWidth()
              let next = baseTrackXRef.current + dx
              if (next > w) next = w + (next - w) * 0.25
              if (next < -w) next = -w + (next + w) * 0.25
              trackX.set(next)
            }}
            onTouchEnd={(e) => {
              if (!hasMovedRef.current) {
                setIsInteracting(false)
                return
              }
              const dx = e.changedTouches[0].clientX - touchStartXRef.current
              const threshold = getCarouselWidth() * 0.22
              if (dx < -threshold) commit('forward')
              else if (dx > threshold) commit('backward')
              else animRef.current = animate(trackX, 0, PEEL_SPRING)
              setIsInteracting(false)
            }}
            onTouchCancel={() => {
              if (hasMovedRef.current) animRef.current = animate(trackX, 0, PEEL_SPRING)
              setIsInteracting(false)
            }}
          >
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: nextOpacity, clipPath: nextClip }}>
              <StoryMobileContent item={storyItems[nextIdx]} />
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: prevOpacity, clipPath: prevClip }}>
              <StoryMobileContent item={storyItems[prevIdx]} />
            </motion.div>
            <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, clipPath: activeClip }}>
              <StoryMobileContent
                item={active}
                detailId={storyDetails[active.id] ? active.id : undefined}
              />
            </motion.div>
          </div>

          <div
            className="relative z-20 mt-4 flex shrink-0 justify-start gap-2 md:hidden"
          >
            {storyItems.map((item, i) => (
              <button
                key={item.title}
                onClick={() => {
                  if (commitTokenRef.current) commitTokenRef.current.cancelled = true
                  animRef.current?.stop()
                  trackX.set(0)
                  setActive(i)
                }}
                aria-label={`Show ${item.title}`}
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

          <div
            className="mt-auto hidden min-h-[280px] grid-cols-4 md:grid"
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsInteracting(true) }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') setIsInteracting(false) }}
          >
            {storyItems.map((item, i) => (
              <div
                key={item.title}
                className={`new-story-reveal-card new-story-reveal-card-${i} min-h-0`}
              >
                <StoryCard
                  item={item}
                  active={i === activeIdx}
                  onActivate={() => setActive(i)}
                  detailId={storyDetails[item.id] ? item.id : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {Object.values(storyDetails).map((detail) => (
        <StoryDetailOverlay key={detail.id} detail={detail} />
      ))}
    </div>
  )
}
