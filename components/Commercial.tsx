'use client'

import { motion } from 'framer-motion'

const brands = [
  {
    name: 'New Balance',
    role: 'Signature Boot Partner',
    product: 'Furon v8 "7egacy" Edition',
    productDesc:
      'Co-designed with Bukayo, the Furon v8 "7egacy" features intricate lion and dove hand embroidery — a nod to his Nigerian heritage and peaceful character. Finished in Rich Burgundy and Metallic Silver, it\'s one of the most coveted signature boots in world football.',
    cta: 'Shop Now at New Balance',
    ctaHref: '#',
    tag: 'Footwear · Signature Collection',
    color: '#EF0107',
    accent: '#3d0c11',
    featured: true,
    details: ['Furon v8 Silo', '"7egacy" Colourway', 'Lion & Dove Embroidery', 'Burgundy / Silver'],
  },
  {
    name: "Nando's",
    role: 'Brand Ambassador',
    product: '"Peri-Peri Saka" Hot Sauce',
    productDesc:
      'The Nando\'s x Saka collaboration produced the limited-edition "Peri-Peri Saka" sauce — a fan-favourite that sold out across the UK. His genuine love for Nando\'s became one of football\'s most authentic partnerships.',
    cta: 'Find Your Nearest Nando\'s',
    ctaHref: '#',
    tag: 'FMCG · Limited Edition',
    color: '#c0392b',
    accent: '#1a0806',
    featured: false,
    details: ['Limited Edition Sauce', 'Peri-Peri Blend', 'UK Wide', 'Sold Out Nationally'],
  },
  {
    name: 'Fashion & Editorial',
    role: 'Style Icon',
    product: 'GQ · Burberry · More',
    productDesc:
      'Saka\'s off-pitch style has caught the attention of the world\'s foremost fashion houses. He has appeared on the cover of GQ and in Burberry campaigns — bridging elite sport and high fashion with effortless cool.',
    cta: 'View Editorial Archive',
    ctaHref: '#',
    tag: 'Fashion · Press',
    color: '#C0C0C0',
    accent: '#1a1a1a',
    featured: false,
    details: ['GQ Magazine Cover', 'Burberry Campaign', 'Nike Collaborations', 'Style Awards'],
  },
]

export default function Commercial() {
  const [featured, ...rest] = brands

  return (
    <section
      id="commercial"
      className="relative w-full py-32 px-4 md:px-6 overflow-hidden"
    >
      {/* Burgundy glow */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#3d0c11]/20 to-transparent pointer-events-none" />

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
          Brands &amp; Collaborations
        </p>
        <h2
          className="text-6xl md:text-8xl lg:text-[9vw] leading-none font-normal"
          style={{ fontFamily: 'Notable, serif' }}
        >
          <span className="text-white">MERCH</span>
          <br />
          <span style={{ WebkitTextStroke: '2px #EF0107', color: 'transparent' }}>
            &amp; BRANDS
          </span>
        </h2>
      </motion.div>

      {/* Featured brand — New Balance hero card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
        className="relative z-10 mb-8 border border-white/10 overflow-hidden group hover:border-[#EF0107]/30 transition-colors duration-500"
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, #3d0c11 0%, #1a0305 40%, #09090b 100%)`,
          }}
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-[#EF0107]/10 to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row gap-0">
          {/* Left — brand info */}
          <div className="flex-1 p-10 md:p-14 lg:p-16">
            <p
              className="text-[#EF0107] text-xs tracking-[0.4em] uppercase mb-6"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {featured.tag}
            </p>
            <h3
              className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none mb-2"
              style={{ fontFamily: 'Notable, serif' }}
            >
              {featured.name}
            </h3>
            <p
              className="text-zinc-500 text-sm tracking-wider uppercase mb-6"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {featured.role}
            </p>

            <div className="mb-8 pb-8 border-b border-white/10">
              <p
                className="text-[#EF0107] text-xs tracking-[0.3em] uppercase mb-2"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                Signature Product
              </p>
              <p
                className="text-white text-xl font-normal"
                style={{ fontFamily: 'Notable, serif' }}
              >
                {featured.product}
              </p>
            </div>

            <p
              className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-lg"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {featured.productDesc}
            </p>

            <a
              href={featured.ctaHref}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#EF0107] text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200 group/btn"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {featured.cta}
              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Right — boot details panel */}
          <div className="lg:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 p-10 flex flex-col justify-center gap-6">
            <p
              className="text-zinc-600 text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              Boot Details
            </p>
            {featured.details.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF0107]" />
                <span
                  className="text-zinc-300 text-sm"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  {d}
                </span>
              </div>
            ))}

            {/* Color swatches for 7egacy */}
            <div className="mt-4 pt-6 border-t border-white/10">
              <p
                className="text-zinc-600 text-xs tracking-widest uppercase mb-3"
                style={{ fontFamily: 'Urbanist, sans-serif' }}
              >
                7egacy Colourway
              </p>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-[#3d0c11] border border-white/20" title="Burgundy" />
                <div className="w-6 h-6 rounded-full bg-[#C0C0C0] border border-white/20" title="Silver" />
                <div className="w-6 h-6 rounded-full bg-[#1a0305] border border-white/20" title="Deep Red" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Other brands */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {rest.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="border border-white/10 p-8 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${brand.color}08 0%, transparent 60%)` }}
            />

            <div className="absolute top-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" style={{ background: brand.color }} />

            <p
              className="text-xs tracking-[0.35em] uppercase mb-4 font-medium"
              style={{ color: brand.color, fontFamily: 'Urbanist, sans-serif' }}
            >
              {brand.tag}
            </p>
            <h3
              className="text-3xl md:text-4xl font-normal text-white mb-1 leading-tight"
              style={{ fontFamily: 'Notable, serif' }}
            >
              {brand.name}
            </h3>
            <p
              className="text-zinc-600 text-xs tracking-wider uppercase mb-6"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {brand.role} · {brand.product}
            </p>
            <p
              className="text-zinc-500 text-sm leading-relaxed mb-8"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              {brand.productDesc}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {brand.details.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 border border-white/10 text-zinc-500 text-xs"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                >
                  {d}
                </span>
              ))}
            </div>

            <a
              href={brand.ctaHref}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors group/link"
              style={{ color: brand.color, fontFamily: 'Urbanist, sans-serif' }}
            >
              {brand.cta}
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
