'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const milestones = [
  {
    year: '2001',
    title: 'Ealing Born',
    body: 'Born on 5 September 2001 in Ealing, West London, to Nigerian parents from Ondo State. Raised in a tight-knit, faith-driven household that shaped his humility, drive, and infectious warmth.',
  },
  {
    year: '2008',
    title: 'Hale End Academy',
    body: 'Joins Arsenal\'s Hale End Academy at just seven years old — the same grassroots system that produced Ashley Cole and Jack Wilshere. From day one, coaches saw something different.',
  },
  {
    year: '2016',
    title: '4 A*s at GCSE',
    body: 'Achieves four A* grades at GCSE whilst training full-time at Arsenal\'s academy. A reminder that Bukayo Saka is not just a footballer — he is one of the most quietly intelligent people in the game.',
  },
  {
    year: '2018',
    title: 'Professional Debut',
    body: 'Makes his senior Arsenal debut on 29 November 2018 in the UEFA Europa League against Vorskla Poltava, aged 17. The journey officially begins.',
  },
  {
    year: '2020',
    title: 'FA Cup Winner & England Call-Up',
    body: 'Wins his first major honour — the FA Cup — and earns his first England call-up. One of the most important years of his football life, all before his 19th birthday.',
  },
  {
    year: '2021',
    title: 'Euro 2020 Heartbreak',
    body: 'The youngest player in England\'s squad at Euro 2020. Steps up for the decisive penalty in the final against Italy. The internet shows its ugliest face. Saka shows his character — publicly supported by teammates, the Club, and millions worldwide.',
  },
  {
    year: '2023',
    title: 'The Number 7',
    body: 'Permanently handed the iconic Number 7 shirt at Arsenal — a number worn by legends. Mikel Arteta calls him "the heart of this team." Arsenal\'s city rivals can only watch.',
  },
  {
    year: '2024',
    title: 'Euro 2024 & Beyond',
    body: 'Continues as England\'s first-choice wide attacker at Euro 2024. Now Arsenal\'s all-time leading Premier League goalscorer for the England men\'s team — a record that keeps growing.',
  },
]

export default function Story() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section
      id="story"
      ref={ref}
      className="relative w-full py-32 px-4 md:px-6"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-24"
      >

        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal text-white flex flex-col md:flex-row items-start md:items-baseline gap-2 md:gap-6"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-xl md:text-3xl lg:text-4xl translate-y-0 md:-translate-y-8">
            THE
          </span>
          <span
            style={{
              WebkitTextStroke: '2px white',
              color: 'transparent',
            }}
          >
            STORY
          </span>
        </h2>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-0 md:left-28 top-0 bottom-0 w-px bg-white/10" />

        <div className="flex flex-col gap-0">
          {milestones.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="relative flex flex-col md:flex-row gap-6 md:gap-16 pb-16 group"
            >
              {/* Year */}
              <div className="md:w-28 flex-shrink-0 flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-0">
                <span
                  className="text-3xl md:text-4xl text-zinc-600 group-hover:text-[#EF0107] transition-colors duration-300 font-normal"
                  style={{ fontFamily: 'Notable, serif' }}
                >
                  {item.year}
                </span>
                {/* Dot on line */}
                <div className="absolute left-0 md:left-28 top-2 w-3 h-3 rounded-full border-2 border-zinc-700 group-hover:border-[#EF0107] group-hover:bg-[#EF0107] transition-all duration-300 -translate-x-1.5 bg-[#09090b]" />
              </div>

              {/* Content */}
              <div className="pl-8 md:pl-0 flex-1 border-b border-white/5 pb-16">
                <h3
                  className="text-xl md:text-2xl text-white font-normal mb-3 group-hover:text-[#EF0107] transition-colors duration-300"
                  style={{ fontFamily: 'Notable, serif' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-zinc-500 text-base leading-relaxed max-w-2xl"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Heritage callout */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 border border-white/10 p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-[#EF0107]" />
        <p
          className="text-[#EF0107] text-xs tracking-[0.3em] uppercase mb-4"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          On Identity
        </p>
        <blockquote
          className="text-2xl md:text-4xl text-white font-normal leading-snug max-w-4xl"
          style={{ fontFamily: 'Notable, serif' }}
        >
          &ldquo;I feel like when I play, you can see my personality — I like to be direct, I like to be brave.&rdquo;
        </blockquote>
        <p
          className="mt-6 text-zinc-500 text-sm tracking-wide"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          — Bukayo Saka
        </p>
      </motion.div>
    </section>
  )
}
