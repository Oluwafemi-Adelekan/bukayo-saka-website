'use client'

import { useScroll, useTransform, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function FixedBrand() {
  const { scrollY } = useScroll()
  const [vh, setVh] = useState(1000)
  const [targetScale, setTargetScale] = useState(0.12)
  const [viewBox, setViewBox] = useState('0 0 1000 145')
  const textRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const fitText = () => {
      const text = textRef.current
      if (!text) return
      try {
        const bb = text.getBBox()
        if (bb.width > 0) {
          setViewBox(`${bb.x} ${bb.y} ${bb.width} ${bb.height}`)
        }
      } catch {}
    }

    const handleResize = () => {
      setVh(window.innerHeight)
      const finalWidth = window.innerWidth < 768 ? 120 : 160
      setTargetScale(finalWidth / window.innerWidth)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Measure immediately, then again once fonts are confirmed loaded
    fitText()
    document.fonts.ready.then(fitText)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const opacity = useTransform(scrollY, [0, vh * 0.5], [1, 0.5])
  const scale = useTransform(scrollY, [0, vh * 0.5], [1, targetScale])
  const y = useTransform(scrollY, [0, vh * 0.5], [0, -24])

  return (
    <motion.div
      style={{ opacity, scale, y, transformOrigin: 'bottom center' }}
      className="fixed bottom-0 inset-x-0 z-50 pointer-events-none select-none w-full px-4 md:px-6"
    >
      <svg
        className="block w-full overflow-visible"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMax meet"
        aria-label="Bukayo Saka"
      >
        <text
          ref={textRef}
          x="500"
          y="138"
          textAnchor="middle"
          fontSize="155"
          fill="#ffffff"
          style={{ fontFamily: 'Notable, serif', fontWeight: 400 }}
        >
          {"BUKAYO SAKA".split('').map((char, index) => (
            <motion.tspan
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + (index * 0.15), duration: 0.05 }}
            >
              {char}
            </motion.tspan>
          ))}
        </text>
      </svg>
    </motion.div>
  )
}
