'use client'

import { useEffect, useRef } from 'react'

const TOTAL_DURATION = 5.0

export default function SignatureStroke() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false

    fetch('/saka-signature.svg')
      .then(r => r.text())
      .then(svgText => {
        if (cancelled) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgText, 'image/svg+xml')
        const svgEl = doc.querySelector('svg')
        if (!svgEl) return

        svgEl.setAttribute('width', '100%')
        svgEl.removeAttribute('height')
        svgEl.style.display = 'block'
        svgEl.style.overflow = 'visible'

        const vbW = 4000
        const vbH = 3640
        
        container.appendChild(svgEl)

        const paths = Array.from(svgEl.querySelectorAll('path'))

        // First, calculate tight bounding box while paths are rendered in DOM
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        for (const path of paths) {
          try {
            const bb = path.getBBox()
            // Ignore giant backgrounds
            if (bb.width > vbW * 0.8 || bb.height > vbH * 0.8) continue
            minX = Math.min(minX, bb.x)
            minY = Math.min(minY, bb.y)
            maxX = Math.max(maxX, bb.x + bb.width)
            maxY = Math.max(maxY, bb.y + bb.height)
          } catch {}
        }

        if (isFinite(minX)) {
          const pad = 80
          svgEl.setAttribute(
            'viewBox',
            `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`
          )
        }

        // We will restructure the SVG to use individual masks for each path
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        const inkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        
        // Global hole mask to cleanly cut out holes
        const globalHoleMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
        globalHoleMask.setAttribute('id', 'global-hole-mask')
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        // Ensure rect covers the entire viewBox area
        bgRect.setAttribute('x', '-1000')
        bgRect.setAttribute('y', '-1000')
        bgRect.setAttribute('width', '10000')
        bgRect.setAttribute('height', '10000')
        bgRect.setAttribute('fill', 'white')
        globalHoleMask.appendChild(bgRect)
        defs.appendChild(globalHoleMask)
        
        inkGroup.setAttribute('mask', 'url(#global-hole-mask)')

        const targets: { el: SVGPathElement; len: number }[] = []

        for (const path of paths) {
          const fill = (path.getAttribute('fill') || '').toUpperCase()

          try {
            const bb = path.getBBox()
            // Remove giant backgrounds
            if (bb.width > vbW * 0.8 || bb.height > vbH * 0.8) {
              path.remove()
              continue
            }
          } catch {}

          // Determine if this is an ink layer or a hole cutout
          // Dark fills in the original SVG represent holes (like inside A and 8)
          const isHole = fill === '#000000' || fill === '#010101' || fill === '#393939' || fill === '#DFDFDF' || fill === '#AAAAAA'

          if (isHole) {
            // Cutout hole: fill black inside the global hole mask to make it transparent
            path.setAttribute('fill', 'black')
            path.setAttribute('stroke', 'none')
            globalHoleMask.appendChild(path)
          } else {
            // Create a unique mask for this specific ink path
            const maskId = `mask-${targets.length}`
            const singleMask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
            singleMask.setAttribute('id', maskId)
            defs.appendChild(singleMask)

            // Create a clone to act as the thick brush in the mask
            const maskPath = path.cloneNode() as SVGPathElement
            maskPath.setAttribute('fill', 'none')
            maskPath.setAttribute('stroke', '#ffffff')
            // Reduced to 40px to completely prevent the brush bleeding into its own tight curves
            maskPath.setAttribute('stroke-width', '40px')
            maskPath.setAttribute('stroke-linecap', 'round')
            maskPath.setAttribute('stroke-linejoin', 'round')

            const len = typeof maskPath.getTotalLength === 'function' ? maskPath.getTotalLength() : 2000
            maskPath.style.strokeDasharray = String(len)
            maskPath.style.strokeDashoffset = String(len)
            
            singleMask.appendChild(maskPath)
            targets.push({ el: maskPath, len })

            // Wrap the original ink path in a group that applies ONLY its own mask
            const singleInkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            singleInkGroup.setAttribute('mask', `url(#${maskId})`)

            path.setAttribute('fill', '#ffffff')
            path.setAttribute('stroke', 'none')
            singleInkGroup.appendChild(path)
            
            inkGroup.appendChild(singleInkGroup)
          }
        }

        // Clean SVG and insert restructured groups
        svgEl.innerHTML = ''
        svgEl.appendChild(defs)
        svgEl.appendChild(inkGroup)

        // Force reflow
        svgEl.getBoundingClientRect()

        const totalLen = targets.reduce((s, t) => s + t.len, 0) || 1

        // Animate the mask paths sequentially, waiting for typing animation to finish
        let delay = 3.0
        for (const { el, len } of targets) {
          const dur = Math.max((len / totalLen) * TOTAL_DURATION, 0.02)
          el.style.transition = `stroke-dashoffset ${dur}s ease-in-out ${delay}s`
          el.style.strokeDashoffset = '0'
          delay += dur
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (container) container.innerHTML = ''
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-[70%] max-w-[200px] md:max-w-[280px] lg:max-w-[340px] select-none pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))' }}
    />
  )
}
