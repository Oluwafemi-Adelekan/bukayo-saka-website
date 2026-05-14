'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

/**
 * Number7 — standalone section that visually overlaps ProfessionalDebut.
 * margin-top: -200vh pulls the container up so it starts while the England
 * goal video is still fully visible underneath. The panel slides up and
 * covers it as the user scrolls, then the text fades in.
 *
 * Background is a PLACEHOLDER (solid colour). Swap the div for <Image> once
 * confirmed freeze-free.
 */
export default function Number7() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  // Panel: slides up from bottom of viewport as the container enters
  const panelY = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])

  // Text fades in during the final quarter of the panel slide-up — fully opaque by the time it lands
  const textOp = useTransform(scrollYProgress, [0.65, 1.0], [0, 1])
  const textY  = useTransform(scrollYProgress, [0.65, 1.0], [24, 0])



  return (
    /*
     * position: relative + zIndex: 60 puts this container above
     * ProfessionalDebut's highest element (z-40 England goal panel)
     * inside the same root stacking context.
     *
     * margin-top: -200vh overlaps the last ~200vh of ProfessionalDebut so
     * the slide-up starts while the England goal video is still playing.
     * Net new scroll added to the page: 220 − 200 = 20vh.
     */
    <div
      ref={containerRef}
      style={{
        height: '250vh',
        marginTop: '-100vh',
        position: 'relative',
        zIndex: 60,
      }}
    >
      <motion.div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ translateY: panelY, willChange: 'transform' }}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/0_Bukayo-Saka.jpg"
            alt="Bukayo Saka No. 7"
            fill
            className="object-cover object-top"
            unoptimized
            priority
          />
        </div>

        {/* Gradient — strong left band for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.50) 45%, rgba(0,0,0,0.08) 100%)',
          }}
        />

        {/* Top-left text — BTP-style two-line heading + body */}
        <motion.div
          className="absolute top-[80px] md:top-[104px] left-4 md:left-6 max-w-xs md:max-w-md"
          style={{ opacity: textOp, y: textY }}
        >
          <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}>
              NUMBER
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}>
              SEVEN
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: '0.875rem',
              lineHeight: 1.72,
              color: 'rgba(255,255,255,0.78)',
              margin: 0,
              maxWidth: 360,
            }}
          >
            Permanently handed the iconic Number 7 shirt at Arsenal — a number worn by
            legends. Mikel Arteta calls him &quot;the heart of this team.&quot; Arsenal&apos;s
            city rivals can only watch.
          </p>
        </motion.div>

        {/* Bottom-right year — identical style to 2018 / 2020 in ProfessionalDebut */}
        <motion.div
          className="absolute bottom-4 md:bottom-6 right-4 md:right-6 pointer-events-none select-none"
          style={{ opacity: textOp, y: textY }}
        >
          <span
            className="text-7xl md:text-9xl text-transparent tracking-tighter block leading-none"
            style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}
          >
            2021
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
