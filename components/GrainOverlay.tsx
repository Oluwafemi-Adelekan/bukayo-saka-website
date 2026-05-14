'use client'

/**
 * GrainOverlay — sits between a section's background and its content.
 * Uses an inline SVG feTurbulence filter for a film-grain texture.
 *
 * Usage: drop <GrainOverlay /> inside any section wrapper that has
 * `position: relative` (or sticky). It will cover the full parent area
 * without blocking pointer events.
 */
export default function GrainOverlay({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        filter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='grain' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' seed='2' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'%3E%3C/feTurbulence%3E%3CfeColorMatrix type='saturate' values='0' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' result='colormatrix'%3E%3C/feColorMatrix%3E%3CfeComponentTransfer x='0%25' y='0%25' width='100%25' height='100%25' in='colormatrix' result='componentTransfer'%3E%3CfeFuncR type='linear' slope='3'%3E%3C/feFuncR%3E%3CfeFuncG type='linear' slope='3'%3E%3C/feFuncG%3E%3CfeFuncB type='linear' slope='3'%3E%3C/feFuncB%3E%3C/feComponentTransfer%3E%3CfeColorMatrix x='0%25' y='0%25' width='100%25' height='100%25' in='componentTransfer' result='colormatrix2' type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -11'%3E%3C/feColorMatrix%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E#grain")`,
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
    />
  )
}
