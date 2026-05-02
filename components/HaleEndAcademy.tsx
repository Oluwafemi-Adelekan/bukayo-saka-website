'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate } from 'framer-motion'

const PORTRAIT = '/sm4_9629_vertical2-1541x2472.png'

const GALLERY = [
  { 
    src: '/under-10-120311pafc-3105x2023.webp', 
    alt: 'Hale End Under-10 squad',
    pos: 'top',
    width: 'w-[60vw] md:w-[24vw]'
  },
  { 
    src: '/arsenal-u15-v-swindon-u15-11-160901mafc-2740x2055.webp', 
    alt: 'Saka in action for Arsenal U15',
    pos: 'bottom',
    width: 'w-[65vw] md:w-[26vw]'
  },
  { 
    src: '/arsenal-v-juve-5-lbc-170401pafc-3000x2225.jpg', 
    alt: 'Arsenal youth action',
    pos: 'top',
    width: 'w-[60vw] md:w-[24vw]'
  },
  { 
    src: '/gettyimages-928190422-3000x2093.jpg', 
    alt: 'Saka celebrating',
    pos: 'bottom',
    width: 'w-[65vw] md:w-[26vw]'
  }
]

export default function HaleEndAcademy() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasEnteredView, setHasEnteredView] = useState(false)

  // Detect when section enters viewport for text entrance animations
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Portrait slides out left quickly 
  const portraitX = useTransform(scrollYProgress, [0, 0.15], ['0vw', '-40vw'])

  // Text block starts shifted right to sit next to the portrait, then perfectly centers
  const textX = useTransform(scrollYProgress, [0, 0.15], ['14vw', '0vw'])

  // Pure CSS-based horizontal scroll mathematically guarantees right edge alignment
  const trackX = useMotionTemplate`calc(${useTransform(scrollYProgress, [0, 1], [0, -100])}% + ${useTransform(scrollYProgress, [0, 1], [0, 100])}vw)`

  return (
    // 500vh gives plenty of scroll duration
    <div ref={containerRef} style={{ height: '500vh' }} className="relative bg-[#09090b]">
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* CENTER FIXED TEXT */}
        <motion.div 
          style={{ x: textX }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-4 md:px-6"
        >
          <div className="flex flex-col md:flex-row items-start justify-center gap-4 md:gap-10 w-full max-w-4xl">
            {/* Title */}
            <div className="w-full md:w-auto flex-shrink-0">
              <h3 
                className={`text-white text-xl md:text-2xl mb-3 md:mb-0 tracking-widest uppercase text-left transition-all duration-700 ease-out ${
                  hasEnteredView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ fontFamily: 'Notable, serif' }}
              >
                HALE END ACADEMY
              </h3>
            </div>
            {/* Description */}
            <div className="w-full md:flex-1 max-w-sm">
              <p 
                className={`text-zinc-300 text-[11px] md:text-xs leading-relaxed text-left transition-all duration-700 ease-out delay-300 ${
                  hasEnteredView 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Joins Arsenal&apos;s Hale End Academy at just seven years old — the same grassroots system that produced Ashley Cole and Jack Wilshere. From day one, coaches saw something different.
              </p>
            </div>
          </div>
        </motion.div>

        {/* LEFT PORTRAIT */}
        <motion.div
          style={{ x: portraitX }}
          className="absolute left-0 top-0 bottom-0 z-30 w-[80vw] md:w-[32vw] pl-4 md:pl-6 pt-[80px] md:pt-[104px] pb-4 md:pb-6"
        >
          <img
            src={PORTRAIT}
            alt="Young Bukayo Saka portrait"
            className="w-full h-full object-cover object-top block"
          />
        </motion.div>

        {/* HORIZONTAL SCROLLING TRACK (ZIGZAG GALLERY) */}
        <motion.div 
          style={{ x: trackX }} 
          className="absolute top-0 bottom-0 left-0 z-10 flex flex-row items-center gap-16 md:gap-32 w-max pl-[100vw] pr-4 md:pr-6"
        >
          {GALLERY.map((img, i) => (
            <div 
              key={i} 
              className={`flex-shrink-0 ${img.width} ${
                img.pos === 'top' 
                  ? 'self-start mt-[80px] md:mt-[104px]'
                  : 'self-end mb-4 md:mb-6'
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover block"
              />
            </div>
          ))}

          {/* YEAR 2008 AT THE END */}
          <div className="flex-shrink-0 self-end mb-4 md:mb-6 flex items-end">
            <span 
              className="text-7xl md:text-9xl text-transparent tracking-tighter block leading-none" 
              style={{ 
                fontFamily: 'Notable, serif', 
                WebkitTextStroke: '2px white' 
              }}
            >
              2008
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
