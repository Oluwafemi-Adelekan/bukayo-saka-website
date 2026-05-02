'use client'

import { motion } from 'framer-motion'

const initiatives = [
  {
    tag: 'BigShoe Foundation · Nigeria',
    title: '120 Lives Changed',
    headline: 'Funding Life-Changing Surgery for Children in Kano',
    body: 'Partnering with the BigShoe Foundation, Bukayo personally funded 120 transformative medical operations for children in Kano, Nigeria — treating hernias, brain tumours, and conditions that would otherwise remain unaddressed due to poverty. The children who receive these operations often have no other route to treatment. This is not charity for a press release — it is sustained, personal commitment.',
    impact: '120 Operations Funded',
    color: '#EF0107',
    number: '120',
    suffix: ' ops',
  },
  {
    tag: 'Ealing Community · London',
    title: '1,000+ Uniform Donations',
    headline: 'Back to School in the Borough That Made Him',
    body: 'Recognising the devastating impact of the cost-of-living crisis on families in his hometown of Ealing, Bukayo donated over 1,000 school uniforms to local children and their families — enabling kids to return to education with dignity. Born and raised in these streets, he has never forgotten where he came from, nor the people who shared that journey with him.',
    impact: '1,000+ Uniforms Donated',
    color: '#C0C0C0',
    number: '1K+',
    suffix: ' uniforms',
  },
]

export default function BeyondThePitch() {
  return (
    <section
      id="foundation"
      className="relative w-full py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Subtle red background glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#EF0107]/5 to-transparent pointer-events-none" />

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
          Impact &amp; Giving Back
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-white">BEYOND</span>
          <br />
          <span style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
            THE PITCH
          </span>
        </h2>
        <p
          className="mt-6 text-zinc-500 text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Goals and assists tell part of the story. Bukayo Saka&apos;s most important work happens far from any football pitch.
        </p>
      </motion.div>

      {/* Initiatives */}
      <div className="relative z-10 flex flex-col gap-6 lg:gap-8">
        {initiatives.map((init, i) => (
          <motion.div
            key={init.tag}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="relative border border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-500"
          >
            {/* Left accent */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ background: init.color }}
            />

            <div className="flex flex-col lg:flex-row">
              {/* Big number panel */}
              <div
                className="lg:w-64 flex-shrink-0 flex items-center justify-center p-10 lg:p-16 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10"
                style={{ background: `${init.color}08` }}
              >
                <div className="text-center">
                  <span
                    className="block text-6xl md:text-7xl font-normal leading-none"
                    style={{ fontFamily: 'Notable, serif', color: init.color }}
                  >
                    {init.number}
                  </span>
                  <span
                    className="block text-zinc-500 text-xs tracking-widest uppercase mt-2"
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                  >
                    {init.impact}
                  </span>
                </div>
              </div>

              {/* Content panel */}
              <div className="flex-1 p-8 md:p-10 lg:p-12">
                <p
                  className="text-xs tracking-[0.35em] uppercase mb-3"
                  style={{ color: init.color, fontFamily: 'Urbanist, sans-serif' }}
                >
                  {init.tag}
                </p>
                <h3
                  className="text-2xl md:text-3xl lg:text-4xl font-normal text-white mb-4 leading-tight"
                  style={{ fontFamily: 'Notable, serif' }}
                >
                  {init.headline}
                </h3>
                <p
                  className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-3xl"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  {init.body}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Character quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 relative z-10 text-center max-w-4xl mx-auto"
      >
        <div className="text-6xl text-[#EF0107] mb-6" style={{ fontFamily: 'Notable, serif' }}>
          &ldquo;
        </div>
        <blockquote
          className="text-xl md:text-3xl text-white font-light leading-relaxed"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          Football is a platform. Every goal I score gives me a bigger voice. I want to use that voice for people who don&apos;t have one.
        </blockquote>
        <p
          className="mt-6 text-zinc-600 text-xs tracking-widest uppercase"
          style={{ fontFamily: 'Urbanist, sans-serif' }}
        >
          — Bukayo Saka
        </p>
      </motion.div>
    </section>
  )
}
