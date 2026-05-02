'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function SignatureReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    fetch('/Bukayo Saka signature.svg')
      .then(r => r.text())
      .then(text => {
        // The embedded image uses non-standard 'data:img/png' — fix to 'data:image/png'
        const fixed = text.replace(/data:img\//g, 'data:image/')
        const blob = new Blob([fixed], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)

        const img = new Image()
        img.onload = () => {
          canvas.width = 1000
          canvas.height = 1000
          ctx.drawImage(img, 0, 0, 1000, 1000)

          // Convert dark ink → white opaque, light background → transparent
          const id = ctx.getImageData(0, 0, 1000, 1000)
          const d = id.data
          for (let i = 0; i < d.length; i += 4) {
            const luma = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
            if (luma < 160) {
              const a = Math.round(((160 - luma) / 160) * 255)
              d[i] = d[i + 1] = d[i + 2] = 255
              d[i + 3] = a
            } else {
              d[i + 3] = 0
            }
          }
          ctx.putImageData(id, 0, 0)
          URL.revokeObjectURL(url)
          setReady(true)
        }
        img.onerror = () => URL.revokeObjectURL(url)
        img.src = url
      })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={ready ? { clipPath: 'inset(0 0% 0 0)' } : { clipPath: 'inset(0 100% 0 0)' }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm md:max-w-md lg:max-w-lg select-none pointer-events-none"
      style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.12))' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ opacity: ready ? 0.9 : 0, transition: 'opacity 0.4s' }}
      />
    </motion.div>
  )
}
