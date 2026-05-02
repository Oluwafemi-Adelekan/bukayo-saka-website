'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import NextMatch from './NextMatch'
import SignatureStroke from './SignatureStroke'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen w-full flex flex-col overflow-hidden"
    >
      {/* Signature — Absolute centred within the Hero section */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none px-6 z-[20]">
        <SignatureStroke />
      </div>

      {/* Upper area: NextMatch pinned to bottom */}
      <motion.div
        style={{ opacity, paddingBottom: 'calc(12vw + 6px)' }}
        className="relative z-[30] flex-1 flex flex-col justify-end pointer-events-none"
      >
        {/* NextMatch widget — 16 px above BUKAYO SAKA */}
        <div className="relative z-10 px-4 md:px-6 pointer-events-auto">
          <NextMatch />
        </div>
      </motion.div>

      {/* BUKAYO SAKA is now rendered via FixedBrand to allow seamless scroll-shrinking */}
    </section>
  )
}
