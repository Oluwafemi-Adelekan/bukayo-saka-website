'use client'

import { useRef } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate } from 'framer-motion'
import Image from 'next/image'
import GrainOverlay from './GrainOverlay'

const PORTRAIT = '/sm4_9629_vertical2-1541x2472.png'

const GALLERY = [
  { src: '/under-10-120311pafc-3105x2023.webp',                     alt: 'Hale End Under-10 squad',        pos: 'top',    width: 'w-[60vw] md:w-[24vw]', w: 3105, h: 2023 },
  { src: '/Saka Hale End Academy 2.png',                            alt: 'Saka in action for Hale End Academy', pos: 'bottom', width: 'w-[65vw] md:w-[26vw]', w: 2740, h: 2055 },
  { src: '/arsenal-v-juve-5-lbc-170401pafc-3000x2225.jpg',          alt: 'Arsenal youth action',           pos: 'top',    width: 'w-[60vw] md:w-[24vw]', w: 3000, h: 2225 },
  { src: '/gettyimages-928190422-3000x2093.jpg',                    alt: 'Saka celebrating',               pos: 'bottom', width: 'w-[65vw] md:w-[26vw]', w: 3000, h: 2093 },
]

export default function HaleEndAcademy() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Single track formula: at p=0 → left edge at viewport left; at p=1 → right edge at viewport right
  const pPercent = useTransform(scrollYProgress, [0, 1], [0, -100])
  const pVw     = useTransform(scrollYProgress, [0, 1], [0,  100])
  const trackX  = useMotionTemplate`calc(${pPercent}% + ${pVw}vw)`

  return (
    <div ref={containerRef} style={{ height: '500vh' }} className="relative bg-[#09090b]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <GrainOverlay />

        {/* ── SINGLE UNIFIED TRACK — portrait → text → images → year, all move identically ── */}
        <motion.div
          style={{ x: trackX }}
          className="absolute top-0 bottom-0 left-0 z-10 flex flex-row items-center gap-8 md:gap-16 w-max"
        >
          {/* Portrait — desktop only, stretches full track height with top/bottom padding */}
          <div
            className="hidden md:block flex-shrink-0"
            style={{ width: '32vw', paddingLeft: 24, paddingTop: 104, paddingBottom: 24, alignSelf: 'stretch' }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Image
                src={PORTRAIT}
                alt="Young Bukayo Saka portrait"
                fill
                sizes="32vw"
                style={{ objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
          </div>

          {/* Text block — full width on mobile, sits next to portrait on desktop */}
          <div className="flex-shrink-0 flex flex-col justify-start md:justify-center w-screen md:w-[600px] px-4 md:px-0 pt-[88px] md:pt-0">
            <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
              <span style={{
                display: 'block',
                fontFamily: 'Kegilka, serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 400,
                color: '#ffffff',
              }}>
                HALE END
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 300,
                color: '#ffffff',
              }}>
                ACADEMY
              </span>
            </h2>
            <p style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'var(--body-text-size)',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.72)',
              margin: 0,
              maxWidth: 600,
            }}>
              Joins Arsenal&apos;s Hale End Academy at just seven years old, the same
              grassroots system that produced Ashley Cole and Jack Wilshere. From day
              one, coaches saw something different.
            </p>
          </div>

          {/* Gallery images */}
          {GALLERY.map((img, i) => (
            <div
              key={i}
              className={`flex-shrink-0 ${img.width} ${
                img.pos === 'top' ? 'self-start mt-[80px] md:mt-[104px]' : 'self-end mb-4 md:mb-6'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                sizes="(max-width: 767px) 65vw, 26vw"
                className="w-full h-auto object-cover block"
              />
            </div>
          ))}

          {/* Year */}
          <div className="flex-shrink-0 self-end mb-4 md:mb-6 pr-4 md:pr-6">
            <span
              className="text-7xl md:text-9xl text-transparent tracking-tighter block leading-none"
              style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}
            >
              2008
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
