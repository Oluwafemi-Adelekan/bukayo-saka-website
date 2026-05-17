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
// Non-breaking space rendered for the inter-word gap. A regular ' ' inside an
// inline-block character span gets collapsed by the browser's default white
// space rules, which made the text render as "BUKAYOSAKA" with no gap.
const NBSP = ' '

/**
 * BUKAYO SAKA brand text that fills its container's width.
 *
 * Critical implementation note: BOTH the container and the measurement
 * reference are read with `offsetWidth`, not `getBoundingClientRect()`.
 * getBoundingClientRect returns rects AFTER ancestor transforms are applied
 * — so if an ancestor is mid-scale animation (Footer's brandScale grows
 * 0.12 → 1 on scroll), the measureRef rect would be scaled-down while
 * container.offsetWidth stays at the true layout width. That mismatch was
 * what caused the "huge B fills the footer" bug. offsetWidth is the raw
 * layout width and is unaffected by ancestor transforms.
 *
 * Both the hidden reference and visible element use the same per-character
 * inline-block structure, so kerning is broken identically in both, and the
 * measurement always matches what's rendered (fixes the "A overflows on iOS"
 * bug that came from iOS not kerning across span boundaries).
 *
 * text-box-trim collapses the line-box to cap-top → baseline (Chrome 133+,
 * iOS Safari 18.2+) so the wrapper height matches the visible glyph extent.
 *
 * ResizeObserver watches the container — only triggers a re-measure when
 * the actual layout width changes, so iOS toolbar show/hide events (which
 * change viewport height but not container width) don't cause jitter.
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
    const container = containerRef.current
    if (!container) return

    const doMeasure = () => {
      const text = measureRef.current
      if (!container || !text) return
      // offsetWidth on BOTH — ignores ancestor transforms, returns the
      // pre-transform layout width. This is the fix for the brandScale bug.
      const containerWidth = container.offsetWidth
      if (containerWidth <= 0) return
      const naturalWidth = text.offsetWidth
      if (naturalWidth > 0) {
        // -1px safety buffer guards against subpixel rounding overflow.
        const newSize = (100 * (containerWidth - 1)) / naturalWidth
        setFontSize(newSize)
      }
    }

    doMeasure()
    // Re-measure after fonts load — initial measurement may have used the
    // fallback serif, which is narrower than Kegilka.
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(doMeasure)
    }

    // ResizeObserver only fires when container width actually changes — iOS
    // toolbar show/hide doesn't trigger it (those don't resize the container).
    const ro = new ResizeObserver(doMeasure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

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
      {/* Hidden reference — same per-character inline-block structure as the
          visible text. No animations. */}
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
          <span key={i} style={{ display: 'inline-block' }}>
            {char === ' ' ? NBSP : char}
          </span>
        ))}
      </span>

      {/* Visible text — same per-character structure with the wave animation */}
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
                    display: 'inline-block',
                    opacity: 0,
                    transform: 'translateY(0.5em)',
                    animation: `brand-wave-${animId} 0.55s ${staggerDelay + i * 0.06}s both`,
                  }
                : { display: 'inline-block' }
            }
          >
            {char === ' ' ? NBSP : char}
          </span>
        ))}
      </span>

      {staggerDelay > 0 && (
        <style>{`
          @keyframes brand-wave-${animId} {
            from {
              opacity: 0;
              transform: translateY(0.5em);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      )}
    </div>
  )
}
