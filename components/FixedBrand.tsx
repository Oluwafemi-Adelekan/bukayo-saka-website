'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import BrandText from './BrandText'

/**
 * Small fixed BUKAYO SAKA brand that floats at the bottom of the viewport
 * between the hero and the footer. The HERO has its own full-width visible
 * brand in document flow, and the FOOTER has its own as well — this fixed
 * version only appears in the "in between" scroll range, fading in once the
 * hero leaves view and fading out as the footer enters view.
 */
export default function FixedBrand() {
  const [heroVisible, setHeroVisible] = useState(true)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('#hero')
    let heroObs: IntersectionObserver | null = null
    if (hero) {
      heroObs = new IntersectionObserver(
        ([entry]) => setHeroVisible(entry.isIntersecting),
        { threshold: 0.05 },
      )
      heroObs.observe(hero)
    }

    const footer = document.querySelector('footer')
    let footerObs: IntersectionObserver | null = null
    if (footer) {
      footerObs = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { threshold: 0 },
      )
      footerObs.observe(footer)
    }

    return () => {
      heroObs?.disconnect()
      footerObs?.disconnect()
    }
  }, [])

  const visible = !heroVisible && !footerVisible

  return (
    <div
      className="fixed bottom-4 md:bottom-6 inset-x-0 z-[200] pointer-events-none flex justify-center"
      style={{ overflow: 'visible' }}
    >
      <motion.div
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.7,
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="select-none"
        style={{ transformOrigin: 'bottom center' }}
      >
        <BrandText className="w-[120px] md:w-[160px]" staggerDelay={0} />
      </motion.div>
    </div>
  )
}
