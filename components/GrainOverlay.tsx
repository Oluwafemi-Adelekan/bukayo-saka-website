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
        backgroundImage:
          `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.72'/%3E%3C/svg%3E")`,
        backgroundSize: '160px 160px',
        opacity: 0.12,
        mixBlendMode: 'screen',
      }}
    />
  )
}
