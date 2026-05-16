'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { createPortal } from 'react-dom'
import GrainOverlay from './GrainOverlay'
import FillButton from './FillButton'

// ─── Legal overlay (shared shell) ──────────────────────────────────────────
function LegalOverlay({
  onClose,
  children,
}: {
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: '#09090b', overflowY: 'auto',
      }}
      data-lenis-prevent="true"
    >
      <GrainOverlay />

      {/* Vertical rule */}
      <div
        style={{
          position: 'fixed', left: 24, top: 24, bottom: 24,
          width: 1, background: 'rgba(255,255,255,0.15)',
          pointerEvents: 'none', zIndex: 2,
        }}
      />

      <div
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: 720, margin: '0 auto',
          padding: '72px 24px 80px 64px',
        }}
      >
        {children}
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 md:top-6 md:right-6"
        style={{
          zIndex: 3,
          color: 'rgba(255,255,255,0.45)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          width: 40, height: 40, borderRadius: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
          <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>
    </motion.div>
  )
}

// ─── Terms & Conditions ─────────────────────────────────────────────────────
function TermsContent() {
  const h = (text: string) => (
    <h3 style={{
      fontFamily: 'Kegilka, serif', fontWeight: 400,
      fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: '#fff',
      margin: '32px 0 10px', lineHeight: 1.1,
    }}>{text}</h3>
  )
  const p = (text: string) => (
    <p style={{
      fontFamily: 'Mona Sans, sans-serif',
      fontSize: 'clamp(0.8rem, 1vw, 0.88rem)',
      lineHeight: 1.78, color: 'rgba(255,255,255,0.55)',
      margin: '0 0 12px',
    }}>{text}</p>
  )

  return (
    <>
      <h1 style={{
        fontFamily: 'Kegilka, serif', fontWeight: 400,
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: 0.92, color: '#fff', marginBottom: 8,
      }}>
        TERMS &amp;
      </h1>
      <h1 style={{
        fontFamily: 'Mona Sans, sans-serif', fontWeight: 300,
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: 0.92, color: '#fff', marginBottom: 40,
      }}>
        CONDITIONS
      </h1>

      <p style={{
        fontFamily: 'Mona Sans, sans-serif', fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: 32,
      }}>
        Last updated: May 2026
      </p>

      {h('1. Nature of This Website')}
      {p('This is an unofficial fan tribute website dedicated to Bukayo Saka. It is not affiliated with, endorsed by, or connected to Bukayo Saka, his management or representatives, Arsenal Football Club, The Football Association, or any other organisation, brand, or individual mentioned herein. All trademarks, names, and likenesses belong to their respective owners.')}

      {h('2. Purpose')}
      {p('The content on this website, including statistics, biographical information, fixture data, and editorial content, is provided for entertainment, informational, and fan engagement purposes only. Nothing on this site constitutes official communication from any of the parties named.')}

      {h('3. Intellectual Property')}
      {p('Third-party logos, imagery, and trademarks referenced on this site are the property of their respective owners. Their use on this fan tribute site is not intended to infringe upon any intellectual property rights. If you are a rights holder and have concerns about specific content, please contact us and we will address them promptly.')}

      {h('4. Accuracy of Information')}
      {p('Fixture schedules, statistics, and other time-sensitive data are sourced from third-party services and are provided "as is". We make no warranties regarding accuracy, completeness, or timeliness. Always verify match details through official club or league channels.')}

      {h('5. External Links')}
      {p('This site may contain links to external websites including official club sites, retail partners, and social media profiles. We are not responsible for the content, privacy practices, or availability of those sites. Links are provided for convenience only.')}

      {h('6. Limitation of Liability')}
      {p('This website and its contents are provided without warranties of any kind, either express or implied. To the fullest extent permitted by law, we exclude all liability for any damages, losses, or claims arising from your use of or reliance on this site or its content.')}

      {h('7. Changes')}
      {p('We reserve the right to update these terms at any time. Your continued use of the website following any changes constitutes your acceptance of the updated terms.')}

      {h('8. Governing Law')}
      {p('These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.')}
    </>
  )
}

// ─── Privacy Policy ─────────────────────────────────────────────────────────
function PrivacyContent() {
  const h = (text: string) => (
    <h3 style={{
      fontFamily: 'Kegilka, serif', fontWeight: 400,
      fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: '#fff',
      margin: '32px 0 10px', lineHeight: 1.1,
    }}>{text}</h3>
  )
  const p = (text: string) => (
    <p style={{
      fontFamily: 'Mona Sans, sans-serif',
      fontSize: 'clamp(0.8rem, 1vw, 0.88rem)',
      lineHeight: 1.78, color: 'rgba(255,255,255,0.55)',
      margin: '0 0 12px',
    }}>{text}</p>
  )

  return (
    <>
      <h1 style={{
        fontFamily: 'Kegilka, serif', fontWeight: 400,
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: 0.92, color: '#fff', marginBottom: 8,
      }}>
        PRIVACY
      </h1>
      <h1 style={{
        fontFamily: 'Mona Sans, sans-serif', fontWeight: 300,
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        lineHeight: 0.92, color: '#fff', marginBottom: 40,
      }}>
        POLICY
      </h1>

      <p style={{
        fontFamily: 'Mona Sans, sans-serif', fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: 32,
      }}>
        Last updated: May 2026
      </p>

      {h('1. Overview')}
      {p('This fan tribute website does not collect, store, or process any personal data from visitors. We are committed to protecting your privacy and being transparent about how this site operates.')}

      {h('2. Data We Do Not Collect')}
      {p('We do not collect your name, email address, IP address, location data, or any other personally identifiable information. We do not require you to create an account or provide any personal details to use this website.')}

      {h('3. Cookies')}
      {p('This site does not set any tracking, advertising, or analytics cookies. Your browser\'s session storage may be used to preserve basic UI state (such as open/closed menus) during your visit. This data exists only in your browser and is never transmitted to any server.')}

      {h('4. Third-Party Services')}
      {p('This site fetches match fixture data from third-party services including TheSportsDB, API-Football, and football-data.org. These requests are made server-side and your browser does not interact with those services directly. Each service has its own privacy policy which we encourage you to review.')}

      {h('5. Embedded Content and Links')}
      {p('Links to external sites (social media, retail partners, official club pages) are provided for convenience. Once you leave this site, you are subject to the privacy policies of those external sites. We have no control over and accept no responsibility for their practices.')}

      {h('6. Analytics')}
      {p('This site does not use Google Analytics, Meta Pixel, or any other analytics or tracking service. No data about your visit is captured or shared with third-party analytics providers.')}

      {h('7. Children\'s Privacy')}
      {p('This website does not knowingly collect any information from children under the age of 13. If you are under 13, please use this site only with the involvement of a parent or guardian.')}

      {h('8. Changes to This Policy')}
      {p('This privacy policy may be updated from time to time to reflect changes in how the site operates. Any updates will be reflected on this page.')}

      {h('9. Governing Law')}
      {p('This policy is governed by the laws of England and Wales. Any disputes relating to this policy shall be subject to the exclusive jurisdiction of the courts of England and Wales.')}
    </>
  )
}

// ─── Social link ─────────────────────────────────────────────────────────────
const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/bukayosaka87/' },
  { label: 'Twitter / X', href: 'https://x.com/BukayoSaka87' },
  { label: 'Facebook', href: 'https://web.facebook.com/BukayoSakaOfficial' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@bukayosaka87' },
]

// ─── Footer ──────────────────────────────────────────────────────────────────
export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  // Mirror of the hero shrink, but inverted: scroll-tied scale that grows from
  // FixedBrand's final shrunken state (≈0.12) → full size as the footer enters view.
  // Range: from "brand top hits viewport bottom" → "brand top hits viewport top".
  const brandRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: brandProgress } = useScroll({
    target: brandRef,
    offset: ['start end', 'start start'],
  })
  const brandScale = useTransform(brandProgress, [0, 0.5], [0.12, 1])

  useEffect(() => { setMounted(true) }, [])

  const year = new Date().getFullYear()

  return (
    <>
      {mounted && createPortal(
        <AnimatePresence>
          {showTerms && (
            <LegalOverlay key="terms" onClose={() => setShowTerms(false)}>
              <TermsContent />
            </LegalOverlay>
          )}
          {showPrivacy && (
            <LegalOverlay key="privacy" onClose={() => setShowPrivacy(false)}>
              <PrivacyContent />
            </LegalOverlay>
          )}
        </AnimatePresence>,
        document.body
      )}

      <footer
        style={{ background: '#09090b', position: 'relative', overflow: 'hidden' }}
      >
        <GrainOverlay />

        {/* Brand text — scale tracks scroll position (visible grow as footer enters view) */}
        <motion.div
          ref={brandRef}
          className="px-4 md:px-6"
          style={{
            paddingTop: 80,
            paddingBottom: 0,
            scale: brandScale,
            transformOrigin: 'bottom center',
            overflow: 'visible',
          }}
        >
          <svg
            viewBox="0 0 1050 135"
            className="block w-full overflow-visible"
            preserveAspectRatio="xMidYMax meet"
            aria-label="Bukayo Saka"
          >
            <text
              x="0"
              y="128"
              textAnchor="start"
              fontSize="155"
              textLength="1050"
              lengthAdjust="spacingAndGlyphs"
              fill="#ffffff"
              style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}
            >
              BUKAYO SAKA
            </text>
          </svg>
        </motion.div>

        {/* ── Get in touch ── */}
        <div
          className="px-4 md:px-6 flex flex-col items-center text-center"
          style={{ paddingTop: 140, paddingBottom: 120 }}
        >
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'Kegilka, serif',
                fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)',
                lineHeight: 0.88, fontWeight: 400, color: '#ffffff',
              }}
            >
              GET IN
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'clamp(1.7rem, 3.6vw, 3.4rem)',
                lineHeight: 0.88, fontWeight: 300, color: '#ffffff',
              }}
            >
              TOUCH
            </span>
          </div>

          <p
            style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'var(--body-text-size)',
              lineHeight: 'var(--body-line-height)',
              color: 'rgba(255,255,255,0.42)',
              margin: '0 auto 28px',
              maxWidth: 360,
            }}
          >
            For press enquiries, partnerships, or anything else, reach out to the team.
          </p>

          <FillButton label="Contact Us" />
        </div>

        {/* ── Divider ── */}
        <div
          className="px-4 md:px-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        />

        {/* ── Bottom bar ── */}
        <div
          className="px-4 md:px-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-0"
          style={{ paddingTop: 24, paddingBottom: 32 }}
        >
          {/* Copyright */}
          <p
            className="text-center md:text-left"
            style={{
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.06em',
              margin: 0,
              flexShrink: 0,
            }}
          >
            © {year} Bukayo Saka. All rights reserved.
          </p>

          {/* Socials */}
          <div
            className="flex-1 flex flex-wrap gap-x-8 gap-y-2 justify-center"
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                style={{
                  fontFamily: 'Mona Sans, sans-serif',
                  fontSize: '0.68rem',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div
            className="flex items-center gap-5 justify-center md:justify-end"
            style={{ flexShrink: 0 }}
          >
            <button
              onClick={() => setShowTerms(true)}
              className="footer-legal-btn"
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.68rem', letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.28)',
                position: 'relative', display: 'inline-block',
              }}
            >
              Terms &amp; Conditions
            </button>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.6rem' }}>|</span>
            <button
              onClick={() => setShowPrivacy(true)}
              className="footer-legal-btn"
              style={{
                background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.68rem', letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.28)',
                position: 'relative', display: 'inline-block',
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* ── Underline hover animations ── */}
        <style jsx>{`
          .footer-social::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(255, 255, 255, 0.6);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .footer-social:hover {
            color: rgba(255, 255, 255, 0.85);
          }
          .footer-social:hover::after {
            transform: scaleX(1);
          }
          .footer-legal-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 1px;
            background: rgba(255, 255, 255, 0.35);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .footer-legal-btn:hover {
            color: rgba(255, 255, 255, 0.55) !important;
          }
          .footer-legal-btn:hover::after {
            transform: scaleX(1);
          }
        `}</style>
      </footer>
    </>
  )
}
