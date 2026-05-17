'use client'

import { useEffect, useId, useRef, useState } from 'react'

type Props = {
  className?: string
  /** Per-character fade-in stagger delay in seconds. 0 = render statically. */
  staggerDelay?: number
  /** Override text color. Defaults to #ffffff. */
  color?: string
}

/**
 * BUKAYO SAKA brand text that fills its container's width.
 *
 * Uses plain HTML <span> with a font-size measured to fit the actual rendered
 * width — NO SVG. iOS WebKit doesn't ship the SVG text quirks when we let the
 * browser lay out HTML text natively.
 *
 * Two key CSS tricks that fix the "glyphs overflow the wrapper" problem with
 * Kegilka's tall vertical metrics:
 *
 *   text-box-trim: trim-both;
 *   text-box-edge: cap alphabetic;
 *
 * They trim the line-box to the actual visible glyph extent (cap top down to
 * the baseline), so the wrapper height EQUALS the visible text height. No
 * ghost ascender/descender padding above or below.
 *
 * Supported in Chrome 133+, iOS Safari 18.2+, and Edge. Firefox falls back to
 * normal line-box behavior (slight extra space above/below) — acceptable.
 *
 * Measurement is on a SEPARATE absolute-positioned reference at a fixed
 * 100px reference size, isolated from the visible element so animations and
 * trim CSS can't interfere with the measurement.
 */
export default function BrandText({
  className = '',
  staggerDelay = 0.6,
  color = '#ffffff',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState<number>(0)
  const animId = useId().replace(/:/g, '')

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const text = measureRef.current
      if (!container || !text) return
      const containerWidth = container.offsetWidth
      if (containerWidth <= 0) return
      const naturalWidth = text.getBoundingClientRect().width
      if (naturalWidth > 0) {
        // -1px safety buffer guards against subpixel rounding overflow.
        const newSize = (100 * (containerWidth - 1)) / naturalWidth
        setFontSize(newSize)
      }
    }
    measure()
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(measure)
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const ready = fontSize > 0

  // text-box-trim trims the line-box to cap-height → baseline so the
  // wrapper's height matches the visible glyphs exactly. The vendor-prefixed
  // -webkit-* form is included for iOS Safari versions before the unprefixed
  // form fully landed.
  const trimStyle: React.CSSProperties = {
    // Standard
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic',
    // Webkit fallback (older iOS Safari pre-18.2 may understand these)
    WebkitTextBoxTrim: 'trim-both',
    WebkitTextBoxEdge: 'cap alphabetic',
  } as React.CSSProperties

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', textAlign: 'center', lineHeight: 1 }}
    >
      {/* Hidden absolute reference at a known size, isolated from the visible
          element so animations and trim never affect measurement. */}
      <span
        ref={measureRef}
        aria-hidden
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          fontFamily: 'Kegilka, serif',
          fontSize: '100px',
          fontWeight: 400,
          lineHeight: 1,
          left: 0,
          top: 0,
        }}
      >
        BUKAYO SAKA
      </span>

      {/* Visible text — inline-block so it shrinks to text width and centers
          within the parent. text-box-trim collapses the line-box to the
          visible glyph extent (cap top → baseline). */}
      <span
        style={{
          fontFamily: 'Kegilka, serif',
          fontSize: ready ? `${fontSize}px` : '0px',
          fontWeight: 400,
          color,
          whiteSpace: 'nowrap',
          display: 'inline-block',
          lineHeight: 1,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.2s',
          ...trimStyle,
        }}
      >
        {staggerDelay > 0 ? (
          'BUKAYO SAKA'.split('').map((char, i) => (
            <span
              key={i}
              style={{
                opacity: 0,
                animation: `brand-fade-${animId} 0.18s ${staggerDelay + i * 0.05}s both`,
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))
        ) : (
          'BUKAYO SAKA'
        )}
      </span>

      {staggerDelay > 0 && (
        <style>{`
          @keyframes brand-fade-${animId} {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>
      )}
    </div>
  )
}
