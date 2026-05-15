'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FillButton from './FillButton'

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

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/bukayosaka87/' },
  { label: 'Twitter / X', href: 'https://x.com/BukayoSaka87' },
  { label: 'Facebook', href: 'https://web.facebook.com/BukayoSakaOfficial' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bukayosaka87' },
]

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const prevMenuOpen = useRef(false)

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

  useEffect(() => {
    if (menuOpen !== prevMenuOpen.current) {
      prevMenuOpen.current = menuOpen
      window.dispatchEvent(new Event(menuOpen ? 'lenis:stop' : 'lenis:start'))
    }
  }, [menuOpen])

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const offset = sectionId === 'story'
      ? (el.offsetHeight - window.innerHeight) * 0.33
      : 0
    const top = el.getBoundingClientRect().top + window.scrollY + offset
    setTimeout(() => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(top, {})
      else window.scrollTo({ top, behavior: 'smooth' })
    }, 50)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent, link: typeof links[0]) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSection(link.sectionId)
  }, [scrollToSection])

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

      </header>

      {/* Mobile hamburger — single button that morphs between 3 bars and X.
          Sits at z-[220] (above the overlay) so the same element is visible
          and animating whether the menu is closed or open. */}
      <button
        className="lg:hidden fixed top-5 right-4 z-[220] flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <span
          className="block w-6 h-0.5 bg-white origin-center"
          style={{
            transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'rotate(0deg) translateY(0)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <span
          className="block w-6 h-0.5 bg-white"
          style={{
            opacity: menuOpen ? 0 : 1,
            transition: 'opacity 0.25s ease',
          }}
        />
        <span
          className="block w-6 h-0.5 bg-white origin-center"
          style={{
            transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'rotate(0deg) translateY(0)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            // Open: curtain glides down with the same spring physics as
            // FillButton's hover fill (stiffness 55 / damping 17 / mass 1.3).
            // Close: same spring, with a 0.3s delay so inner elements fade out first.
            transition={{
              type: 'spring', stiffness: 55, damping: 17, mass: 1.3,
              delay: menuOpen ? 0 : 0.3,
            }}
            className="lg:hidden fixed inset-0 z-[210] bg-[#09090b] flex flex-col"
          >
            {/* Top spacer matching the hamburger area so links don't sit under it */}
            <div className="px-4 py-5" style={{ flexShrink: 0, height: 64 }} />

            {/* Nav links — fade in after curtain lands; fade out FIRST on close */}
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { delayChildren: 0.7, staggerChildren: 0.06 } },
                exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              }}
              className="flex flex-col px-6"
              style={{ flexShrink: 0 }}
            >
              {links.map((link) => {
                const isActive = activeSection === link.sectionId
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleClick(e, link)}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                      exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeIn' } },
                    }}
                    style={{
                      fontFamily: 'Mona Sans, sans-serif',
                      fontSize: '0.75rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                      textDecoration: 'none',
                      display: 'block',
                      paddingTop: '1.1rem',
                      paddingBottom: '1.1rem',
                      borderBottom: isActive ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
                      transition: 'color 0.3s ease, border-color 0.3s ease',
                    }}
                  >
                    {link.label}
                  </motion.a>
                )
              })}
            </motion.nav>

            <div className="flex-1" />

            {/* Get in Touch button — matches the footer's FillButton */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ delay: 0.7 + links.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center px-6 pb-8"
              style={{ flexShrink: 0 }}
            >
              <FillButton label="Get in Touch" onClick={() => {
                setMenuOpen(false)
                setTimeout(() => {
                  const footer = document.querySelector('footer')
                  if (!footer) return
                  const top = footer.getBoundingClientRect().top + window.scrollY
                  const lenis = getLenis()
                  if (lenis) lenis.scrollTo(top, {})
                  else window.scrollTo({ top, behavior: 'smooth' })
                }, 50)
              }} />
            </motion.div>

            {/* Social links — centered, last to fade in / first to fade out */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2, ease: 'easeIn' } }}
              transition={{ delay: 0.8 + links.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center flex-wrap gap-6 px-6 pb-10"
              style={{ flexShrink: 0 }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Mona Sans, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'none',
                  }}
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
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
