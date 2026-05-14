'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SignatureStroke from './SignatureStroke'

export default function SignatureReveal() {
  const [show, setShow] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 6500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
      window.dispatchEvent(new Event('lenis:stop'))
    } else {
      document.body.style.overflow = ''
      window.dispatchEvent(new Event('lenis:start'))
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [show])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#7B1218',
            zIndex: 10001,
          }}
        >
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
            <SignatureStroke
              className="w-[50%] max-w-[300px] md:max-w-[400px] lg:max-w-[500px] select-none pointer-events-none"
              startDelay={0.8}
              glow
              loop={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
