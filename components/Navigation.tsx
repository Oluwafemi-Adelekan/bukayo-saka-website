'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'Story', href: '#story', sectionId: 'story' },
  { label: 'Club & Country', href: '#club-country', sectionId: 'club-country' },
  { label: 'Beyond the Pitch', href: '#foundation', sectionId: 'foundation' },
  { label: 'Merch', href: '#commercial', sectionId: 'commercial' },
  { label: 'Fixtures', href: '#fixtures', sectionId: 'fixtures' },
]

// Lenis instance exposed by SmoothScroll.tsx
type LenisInstance = { scrollTo: (target: HTMLElement | number, opts?: Record<string, unknown>) => void }
function getLenis(): LenisInstance | null {
  return (window as unknown as Record<string, unknown>).__lenis as LenisInstance ?? null
}

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const sectionIds = ['hero', ...links.map((l) => l.sectionId)]
    const update = () => {
      const trigger = window.scrollY + window.innerHeight * 0.4
      let current = ''
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const offsetTop = el.getBoundingClientRect().top + window.scrollY
        if (offsetTop <= trigger) current = id
      }
      setActiveSection(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent, link: typeof links[0]) => {
    e.preventDefault()
    setMenuOpen(false)

    const el = document.getElementById(link.sectionId)
    if (!el) return

    // For Story: land at scrollYProgress 0.33 — THE STORY fully drawn, curtain still closed.
    // useScroll['start start','end end'] maps progress over (sectionHeight - viewportHeight),
    // so the offset must use that denominator, NOT el.offsetHeight.
    const offset = link.sectionId === 'story'
      ? (el.offsetHeight - window.innerHeight) * 0.33
      : 0
    const top = el.getBoundingClientRect().top + window.scrollY + offset

    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(top, {})
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <header
        className="nav-fade-in fixed top-0 left-0 right-0 z-[100] pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center justify-between px-6 py-6 pointer-events-auto">
          {links.map((link, i) => {
            const isActive = activeSection === link.sectionId
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleClick(e, link)}
                className="nav-link-fade relative text-xs tracking-[0.25em] uppercase font-bold text-white"
                style={{ fontFamily: 'Mona Sans, sans-serif', animationDelay: `${0.1 + i * 0.05}s` }}
              >
                {link.label}
                <span
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white transition-opacity duration-200"
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </a>
            )
          })}
        </nav>

        {/* Mobile hamburger */}
        <div className="lg:hidden flex items-center justify-end px-4 py-5 pointer-events-auto">
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white origin-center transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-6 h-0.5 bg-white origin-center transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed top-[74px] left-0 right-0 z-[99] overflow-hidden bg-[#09090b]/95 backdrop-blur-md border-t border-white/5"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {links.map((link) => {
                const isActive = activeSection === link.sectionId
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    className={`text-base tracking-wide uppercase py-2 border-b border-white/5 transition-colors ${
                      isActive ? 'text-[#EF0107] font-medium' : 'text-zinc-300 hover:text-white'
                    }`}
                    style={{ fontFamily: 'Mona Sans, sans-serif' }}
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

      <style jsx>{`
        .nav-fade-in { animation: navFadeIn 0.7s ease-out both; }
        .nav-link-fade { animation: linkFadeIn 0.5s ease-out both; }
        @keyframes navFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes linkFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  )
}
