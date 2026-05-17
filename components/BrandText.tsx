'use client'

import { useEffect, useId, useRef, useState } from 'react'

type Props = {
  className?: string
  /** Per-character fade-in stagger delay in seconds. 0 = render statically. */
  staggerDelay?: number
  /** Override text color. Defaults to #ffffff. */
  color?: string
}

const TEXT = 'BUKAYO SAKA'

/**
 * BUKAYO SAKA brand text that fills its container's width.
 *
 * Uses plain HTML <span> with a font-size measured to fit the actual rendered
 * width — NO SVG.
 *
 * The hidden reference and the visible element use the SAME structure (the
 * text split into per-character <span>s) so that measurement matches rendered
 * width on every browser regardless of how it handles kerning across inline
 * boundaries. iOS WebKit doesn't kern across span boundaries the way
 * Chromium does, and that mismatch is what was making the last "A" spill
 * past the container on iOS.
 *
 * text-box-trim collapses the line-box to the visible glyph extent
 * (cap-top → baseline) so the wrapper height matches the visible text.
 * Supported on iOS Safari 18.2+ and Chrome 133+; older browsers fall back
 * to normal line-box behavior, which is what we had before.
 */
export default function BrandText({
  className = '',
  staggerDelay = 0.6,
  color = '#ffffff',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const lastWidthRef = useRef<number>(0)
  const [fontSize, setFontSize] = useState<number>(0)
  const animId = useId().replace(/:/g, '')

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current
      const text = measureRef.current
      if (!container || !text) return
      const containerWidth = container.offsetWidth
      if (containerWidth <= 0) return
      // Skip re-measurement when container width hasn't actually changed.
      // iOS Safari fires `resize` on every toolbar show/hide even though the
      // container width is unchanged — without this guard those events were
      // causing transient measurements and visible jitter.
      if (containerWidth === lastWidthRef.current && fontSize > 0) return
      lastWidthRef.current = containerWidth
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
  }, [fontSize])

  const ready = fontSize > 0

  const trimStyle: React.CSSProperties = {
    textBoxTrim: 'trim-both',
    textBoxEdge: 'cap alphabetic',
    WebkitTextBoxTrim: 'trim-both',
    WebkitTextBoxEdge: 'cap alphabetic',
  } as React.CSSProperties

  const chars = TEXT.split('')

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', textAlign: 'center', lineHeight: 1 }}
    >
      {/* Hidden reference — same per-character structure as the visible text,
          just no animation. This is the key: structurally identical so the
          reported width MATCHES the rendered width on every browser, regardless
          of how kerning is handled across span boundaries. */}
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
        {chars.map((char, i) => (
          <span key={i}>{char === ' ' ? ' ' : char}</span>
        ))}
      </span>

      {/* Visible text — same per-character structure with the staggered fade. */}
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
        {chars.map((char, i) => (
          <span
            key={i}
            style={
              staggerDelay > 0
                ? {
                    opacity: 0,
                    animation: `brand-fade-${animId} 0.18s ${staggerDelay + i * 0.05}s both`,
                  }
                : undefined
            }
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
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
