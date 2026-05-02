'use client'

import { useRef, useEffect } from 'react'

interface Props {
  className?: string
  /** Seconds before the trace begins after mount */
  delay?: number
  /** Seconds for the full signature to draw */
  duration?: number
  /** Pen-tip radius in canvas pixels (controls stroke thickness reveal) */
  brush?: number
}

/**
 * SignatureTrace — extracts the embedded PNG from the signature SVG, walks a
 * greedy nearest-neighbour path through every ink pixel, and animates a
 * round "pen-tip" mask along that path. The mask is composited against the
 * white-tinted source so the actual signature shape is revealed stroke by
 * stroke — like Premiere's Stroke Path effect on a real handwriting frame.
 */
export default function SignatureTrace({
  className,
  delay = 0.4,
  duration = 4,
  brush = 7,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let delayTimer = 0
    let active = true

    const start = (imgSrc: string, attempt = 0) => {
      if (!active) return
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        if (!active) return

        // Working resolution — high enough for crisp strokes, low enough for fast NN build
        const W = 600
        const aspect = img.naturalHeight / img.naturalWidth || 1
        const H = Math.max(1, Math.round(W * aspect))

        canvas.width = W
        canvas.height = H

        // 1. Source: render the original PNG
        const source = document.createElement('canvas')
        source.width = W
        source.height = H
        const sCtx = source.getContext('2d')!
        sCtx.imageSmoothingEnabled = true
        sCtx.imageSmoothingQuality = 'high'
        sCtx.drawImage(img, 0, 0, W, H)

        // 2. White-ink source: same shape, recoloured to white
        //    (canvas equivalent of CSS filter: brightness(0) invert(1))
        const whiteInk = document.createElement('canvas')
        whiteInk.width = W
        whiteInk.height = H
        const wCtx = whiteInk.getContext('2d')!
        wCtx.drawImage(source, 0, 0)
        wCtx.globalCompositeOperation = 'source-in'
        wCtx.fillStyle = 'rgba(255,255,255,1)'
        wCtx.fillRect(0, 0, W, H)
        wCtx.globalCompositeOperation = 'source-over'

        // 3. Detect ink pixels — anything visible and not near-white in the source
        const { data } = sCtx.getImageData(0, 0, W, H)
        const ink: [number, number][] = []
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const i = (y * W + x) * 4
            const a = data[i + 3]
            if (a < 30) continue
            const r = data[i], g = data[i + 1], b = data[i + 2]
            if (r > 215 && g > 215 && b > 215) continue
            ink.push([x, y])
          }
        }

        if (ink.length === 0) {
          // Couldn't read pixels (CORS / data URI issue) — fall back to
          // simply showing the white signature so it's at least visible.
          ctx.drawImage(whiteInk, 0, 0)
          return
        }

        // 4. Spatial grid for fast nearest-neighbour search
        const CELL = 5
        const GW = Math.ceil(W / CELL)
        const grid = new Map<number, number[]>()
        for (let i = 0; i < ink.length; i++) {
          const key = ((ink[i][1] / CELL) | 0) * GW + ((ink[i][0] / CELL) | 0)
          let cell = grid.get(key)
          if (!cell) { cell = []; grid.set(key, cell) }
          cell.push(i)
        }

        const visited = new Uint8Array(ink.length)
        const LIFT = 22 // px gap before the algorithm "lifts the pen"
        const LIFT2 = LIFT * LIFT
        const GR = Math.ceil(LIFT / CELL) + 1

        const nearest = (cx: number, cy: number): number => {
          const gx = (cx / CELL) | 0
          const gy = (cy / CELL) | 0
          let best = -1
          let bestD = LIFT2 + 1
          for (let dy = -GR; dy <= GR; dy++) {
            for (let dx = -GR; dx <= GR; dx++) {
              const cell = grid.get((gy + dy) * GW + (gx + dx))
              if (!cell) continue
              for (let k = 0; k < cell.length; k++) {
                const idx = cell[k]
                if (visited[idx]) continue
                const ix = ink[idx][0]
                const iy = ink[idx][1]
                const d = (ix - cx) * (ix - cx) + (iy - cy) * (iy - cy)
                if (d < bestD) { bestD = d; best = idx }
              }
            }
          }
          return best
        }

        // 5. Pre-sort indices in approximate writing order — top-left first.
        //    The x-bias keeps it scanning roughly left → right between strokes.
        const writingOrder = new Int32Array(ink.length)
        for (let i = 0; i < ink.length; i++) writingOrder[i] = i
        const sortKey = (i: number) => ink[i][0] * 0.3 + ink[i][1]
        const sorted = Array.from(writingOrder).sort((a, b) => sortKey(a) - sortKey(b))
        let ptr = 0
        const nextStrokeStart = (): number => {
          while (ptr < sorted.length) {
            const i = sorted[ptr++]
            if (!visited[i]) return i
          }
          return -1
        }

        // 6. Build full traversal: walk each stroke greedily, then jump to next start
        const order = new Int32Array(ink.length)
        let n = 0
        let s = nextStrokeStart()
        while (s >= 0) {
          visited[s] = 1
          order[n++] = s
          let cur = s
          for (;;) {
            const nx = nearest(ink[cur][0], ink[cur][1])
            if (nx < 0) break
            visited[nx] = 1
            order[n++] = nx
            cur = nx
          }
          s = nextStrokeStart()
        }

        // 7. Mask canvas — accumulates pen-tip dabs as the trace plays
        const mask = document.createElement('canvas')
        mask.width = W
        mask.height = H
        const mCtx = mask.getContext('2d')!
        mCtx.fillStyle = 'rgba(255,255,255,1)'
        mCtx.lineCap = 'round'
        mCtx.lineJoin = 'round'
        mCtx.strokeStyle = 'rgba(255,255,255,1)'
        mCtx.lineWidth = brush * 2

        // 8. Animate
        const total = n
        const fps = 60
        const bpf = Math.max(1, Math.ceil(total / (duration * fps)))
        let drawn = 0
        let prevX = -9999
        let prevY = -9999

        const render = () => {
          if (!active) return
          const end = Math.min(drawn + bpf, total)

          // Stamp each new ink point as a pen dab. Using strokes with lineCap=round
          // between consecutive points produces a smooth thick reveal that follows
          // the pen path rather than discrete circles.
          mCtx.beginPath()
          for (let i = drawn; i < end; i++) {
            const idx = order[i]
            const x = ink[idx][0]
            const y = ink[idx][1]
            const d2 = (x - prevX) * (x - prevX) + (y - prevY) * (y - prevY)
            if (d2 > LIFT2) {
              mCtx.moveTo(x + 0.5, y + 0.5)
              // ensure single-point dab is visible
              mCtx.arc(x + 0.5, y + 0.5, brush, 0, Math.PI * 2)
              mCtx.moveTo(x + 0.5, y + 0.5)
            } else {
              mCtx.lineTo(x + 0.5, y + 0.5)
            }
            prevX = x
            prevY = y
          }
          mCtx.stroke()

          // Composite: white signature, masked to the area the pen has covered
          ctx.clearRect(0, 0, W, H)
          ctx.drawImage(whiteInk, 0, 0)
          ctx.globalCompositeOperation = 'destination-in'
          ctx.drawImage(mask, 0, 0)
          ctx.globalCompositeOperation = 'source-over'

          drawn = end
          if (drawn < total) rafId = requestAnimationFrame(render)
        }

        delayTimer = window.setTimeout(() => {
          if (active) rafId = requestAnimationFrame(render)
        }, delay * 1000)
      }

      img.onerror = () => {
        // If SVG load fails and we haven't tried fetching the raw PNG yet, do it
        if (attempt === 0) {
          fetch('/Bukayo%20Saka%20signature.svg')
            .then(r => r.text())
            .then(text => {
              if (!active) return
              const m = text.match(/(?:xlink:)?href\s*=\s*"(data:[^"]+)"/)
              if (m) start(m[1].replace('data:img/', 'data:image/'), 1)
            })
            .catch(() => {})
        }
      }

      img.src = imgSrc
    }

    // Load SVG directly — faster than fetching+parsing the 200KB file
    start('/Bukayo%20Saka%20signature.svg')

    return () => {
      active = false
      clearTimeout(delayTimer)
      cancelAnimationFrame(rafId)
    }
  }, [delay, duration, brush])

  return <canvas ref={canvasRef} className={className} />
}
