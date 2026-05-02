'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Story', href: '#story', sectionId: 'story' },
  { label: 'Club & Country', href: '#club-country', sectionId: 'club-country' },
  { label: 'Stats', href: '#stats', sectionId: 'stats' },
  { label: 'Foundation', href: '#foundation', sectionId: 'foundation' },
  { label: 'Merch', href: '#commercial', sectionId: 'commercial' },
  { label: 'Fixtures', href: '#fixtures', sectionId: 'fixtures' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for active section tracking
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the entry most visible in the viewport
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

    if (visible.length > 0) {
      setActiveSection(visible[0].target.id)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.5],
    })

    // Observe all section targets
    const sectionIds = ['hero', ...links.map((l) => l.sectionId), 'trophies']
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [handleIntersection])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[100] bg-transparent"
    >
      {/* Desktop — full-width spread */}
      <nav className="hidden lg:flex items-center justify-between px-6 py-6">
        {links.map((link, i) => {
          const isActive = activeSection === link.sectionId
          return (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className={`relative text-xs tracking-[0.25em] uppercase font-bold transition-colors duration-200 ${
                isActive ? 'text-[#EF0107]' : 'text-white hover:text-[#EF0107]'
              }`}
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {link.label}
              {/* Active indicator dot */}
              <motion.span
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#EF0107]"
              />
            </motion.a>
          )
        })}
      </nav>

      {/* Mobile — hamburger only */}
      <div className="lg:hidden flex items-center justify-end px-4 py-5">
        <button
          className="flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white origin-center transition-all"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-0.5 bg-white origin-center transition-all"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-[#09090b]/95 backdrop-blur-md border-t border-white/5"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {links.map((link) => {
                const isActive = activeSection === link.sectionId
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-base tracking-wide uppercase py-2 border-b border-white/5 transition-colors ${
                      isActive
                        ? 'text-[#EF0107] font-medium'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                  >
                    {isActive && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EF0107] mr-3 align-middle" />
                    )}
                    {link.label}
                  </a>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
