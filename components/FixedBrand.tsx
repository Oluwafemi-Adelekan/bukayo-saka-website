'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function FixedBrand() {
  const { scrollY } = useScroll()
  const [vh, setVh] = useState(1000)
  const [targetScale, setTargetScale] = useState(0.12)
  const containerRef = useRef<HTMLDivElement>(null)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setVh(window.innerHeight)
      const finalWidth = window.innerWidth < 768 ? 120 : 160
      setTargetScale(finalWidth / window.innerWidth)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Observe footer — when it enters the viewport, hide FixedBrand
    // so it doesn't cover footer content
    const footer = document.querySelector('footer')
    if (footer) {
      const obs = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0 }
      )
      obs.observe(footer)
      return () => {
        obs.disconnect()
        window.removeEventListener('resize', handleResize)
      }
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Scale down from Hero
  const scale = useTransform(() => {
    const currentY = scrollY.get()
    const heroShrinkProgress = Math.min(1, currentY / (vh * 0.5))
    return 1 - (1 - targetScale) * heroShrinkProgress
  })

  // Hide when footer is visible — the footer has its own brand text
  if (footerVisible) return null

  return (
    <div className="fixed bottom-4 md:bottom-6 inset-x-0 z-[200] pointer-events-none">
      <motion.div
        ref={containerRef}
        style={{
          scale,
          transformOrigin: 'bottom center',
        }}
        className="absolute bottom-0 left-4 right-4 md:left-6 md:right-6 select-none"
      >
        <svg
          viewBox="0 0 1000 135"
          className="block w-full overflow-visible"
          preserveAspectRatio="xMidYMax meet"
          aria-label="Bukayo Saka"
        >
          <text
            x="0"
            y="128"
            textAnchor="start"
            fontSize="155"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="#ffffff"
            style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}
          >
            {'BUKAYO SAKA'.split('').map((char, i) => (
              <motion.tspan
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.05 }}
              >
                {char}
              </motion.tspan>
            ))}
          </text>
        </svg>
      </motion.div>
    </div>
  )
}
