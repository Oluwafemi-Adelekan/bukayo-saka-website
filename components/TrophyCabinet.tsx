'use client'

import { motion } from 'framer-motion'

const trophies = [
  {
    icon: '🏆',
    title: 'FA Cup',
    year: '2020',
    type: 'Team',
    color: '#EF0107',
    desc: 'Arsenal 2–1 Chelsea. Wembley. His first major senior honour.',
  },
  {
    icon: '🛡️',
    title: 'Community Shield',
    year: '2020',
    type: 'Team',
    color: '#EF0107',
    desc: 'Arsenal 1–1 (5–4 pens) Liverpool. A statement before the season started.',
  },
  {
    icon: '🛡️',
    title: 'Community Shield',
    year: '2023',
    type: 'Team',
    color: '#EF0107',
    desc: 'Arsenal 4–1 Manchester City. Title challengers announcing themselves.',
  },
  {
    icon: '⭐',
    title: 'PFA Young Player of the Year',
    year: '2022',
    type: 'Individual',
    color: '#C0C0C0',
    desc: 'Voted by his peers — the highest form of respect in professional football.',
  },
  {
    icon: '🔴',
    title: 'Arsenal Player of the Season',
    year: '2021/22',
    type: 'Individual',
    color: '#EF0107',
    desc: 'Dominant from wide right. The team\'s most influential player by far.',
  },
  {
    icon: '🔴',
    title: 'Arsenal Player of the Season',
    year: '2022/23',
    type: 'Individual',
    color: '#EF0107',
    desc: 'Back-to-back. Consistency is the mark of a true elite performer.',
  },
  {
    icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    title: 'England Men\'s Player of the Year',
    year: '2023',
    type: 'Individual',
    color: '#C0C0C0',
    desc: 'National recognition for an international-class season.',
  },
  {
    icon: '⚡',
    title: 'Premier League Player of Month',
    year: 'Multiple',
    type: 'Individual',
    color: '#C0C0C0',
    desc: 'A consistent presence in monthly awards throughout his career.',
  },
]

export default function TrophyCabinet() {
  const team = trophies.filter((t) => t.type === 'Team')
  const individual = trophies.filter((t) => t.type === 'Individual')

  return (
    <section
      id="trophies"
      className="relative w-full py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Bg texture lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-white"
            style={{ top: `${i * 10}%` }}
          />
        ))}
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="mb-20 relative z-10"
      >
        <p
          className="text-[#EF0107] text-xs tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Honours &amp; Accolades
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-white">TROPHY</span>
          <br />
          <span style={{ WebkitTextStroke: '2px #EF0107', color: 'transparent' }}>
            CABINET
          </span>
        </h2>
      </motion.div>

      {/* Team trophies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-12"
      >
        <p
          className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-6"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Team Trophies
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {team.map((trophy, i) => (
            <TrophyCard key={`${trophy.title}-${trophy.year}`} trophy={trophy} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div className="relative z-10 flex items-center gap-6 my-12">
        <div className="flex-1 h-px bg-white/10" />
        <span
          className="text-zinc-700 text-xs tracking-[0.4em] uppercase"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Individual Awards
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Individual trophies */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {individual.map((trophy, i) => (
          <TrophyCard key={`${trophy.title}-${trophy.year}`} trophy={trophy} index={i + team.length} />
        ))}
      </div>
    </section>
  )
}

function TrophyCard({
  trophy,
  index,
}: {
  trophy: (typeof trophies)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="relative border border-white/10 p-6 flex flex-col gap-3 group cursor-default hover:border-white/20 transition-all duration-300 overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${trophy.color}15, transparent 70%)`,
        }}
      />

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
        style={{ background: trophy.color }}
      />

      <div className="text-3xl" role="img" aria-label={trophy.title}>
        {trophy.icon}
      </div>

      <div>
        <div
          className="text-white font-normal text-base leading-snug"
          style={{ fontFamily: 'Notable, serif' }}
        >
          {trophy.title}
        </div>
        <div
          className="text-xs mt-0.5 font-medium"
          style={{ color: trophy.color, fontFamily: 'Urbanist, sans-serif' }}
        >
          {trophy.year}
        </div>
      </div>

      <p
        className="text-zinc-600 text-xs leading-relaxed group-hover:text-zinc-500 transition-colors"
        style={{ fontFamily: 'Urbanist, sans-serif' }}
      >
        {trophy.desc}
      </p>
    </motion.div>
  )
}
