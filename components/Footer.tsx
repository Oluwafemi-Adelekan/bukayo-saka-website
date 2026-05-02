'use client'

import { motion } from 'framer-motion'

const navLinks = [
  { label: 'Story', href: '#story' },
  { label: 'Club & Country', href: '#club-country' },
  { label: 'Stats', href: '#stats' },
  { label: 'Foundation', href: '#foundation' },
  { label: 'Merch', href: '#commercial' },
  { label: 'Fixtures', href: '#fixtures' },
]

const socialLinks = [
  { label: 'Instagram', href: '#', handle: '@bukayosaka87' },
  { label: 'X / Twitter', href: '#', handle: '@BukayoSaka87' },
  { label: 'TikTok', href: '#', handle: '@bukayosaka87' },
]

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-white/5 overflow-hidden">
      {/* Large background number */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="text-[30vw] font-normal text-white/[0.02] leading-none"
          style={{ fontFamily: 'Notable, serif' }}
        >
          7
        </span>
      </div>

      {/* Red accent top line */}
      <div className="w-full h-px bg-gradient-to-r from-[#EF0107] via-[#EF0107]/50 to-transparent" />

      <div className="relative z-10 px-4 md:px-6 pt-20 pb-12">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 pb-16 border-b border-white/5">
          {/* Brand col */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Monogram */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 border-2 border-[#EF0107] flex items-center justify-center">
                <span
                  className="text-white font-bold text-2xl"
                  style={{ fontFamily: 'Notable, serif' }}
                >
                  7
                </span>
              </div>
              <div>
                <div
                  className="text-white font-normal text-lg leading-tight"
                  style={{ fontFamily: 'Notable, serif' }}
                >
                  Bukayo Saka
                </div>
                <div
                  className="text-zinc-600 text-xs tracking-widest uppercase"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  Official Website
                </div>
              </div>
            </div>
            <p
              className="text-zinc-600 text-sm leading-relaxed mb-8 max-w-xs"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              The official digital home of Bukayo Saka — Arsenal No.7, England international, and a product of Ealing.
            </p>
            {/* Social */}
            <div className="flex flex-col gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="flex items-center justify-between group"
                >
                  <span
                    className="text-zinc-600 text-xs tracking-widest uppercase group-hover:text-white transition-colors"
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-zinc-500 text-xs group-hover:text-[#EF0107] transition-colors"
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                  >
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation col */}
          <div className="flex-1">
            <p
              className="text-zinc-700 text-xs tracking-[0.4em] uppercase mb-6"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              Navigate
            </p>
            <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-zinc-500 hover:text-white text-sm tracking-wide uppercase transition-colors group flex items-center gap-2"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  <span className="text-[#EF0107] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    ▸
                  </span>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Tagline col */}
          <div className="lg:w-64 flex-shrink-0 flex flex-col justify-between">
            <div>
              <p
                className="text-zinc-700 text-xs tracking-[0.4em] uppercase mb-6"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                The Mantra
              </p>
              <blockquote
                className="text-white text-3xl font-normal leading-tight"
                style={{ fontFamily: 'Notable, serif' }}
              >
                From<br />
                <span style={{ color: '#EF0107' }}>Ealing</span><br />
                to the<br />
                World.
              </blockquote>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <a
                href="#fixtures"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#EF0107] text-[#EF0107] text-xs font-semibold uppercase tracking-wider hover:bg-[#EF0107] hover:text-white transition-all duration-300 w-full justify-center"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                View Next Match →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-zinc-700 text-xs"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            © {new Date().getFullYear()} Bukayo Saka. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms', 'Press'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-zinc-700 hover:text-zinc-400 text-xs uppercase tracking-wider transition-colors"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                {item}
              </a>
            ))}
          </div>
          <p
            className="text-zinc-800 text-xs"
            style={{ fontFamily: 'Urbanist, sans-serif' }}
          >
            Built with Next.js · Tailwind CSS · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  )
}
