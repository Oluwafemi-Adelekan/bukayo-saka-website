'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  label: string
  onClick?: () => void
  href?: string
  as?: React.ElementType
}

export default function FillButton({ label, onClick, href, as }: Props) {
  const [hovered, setHovered] = useState(false)
  const Tag = as || (href ? 'a' : 'button')

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
        padding: '13px 26px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {/* Fill — grows from bottom upward */}
      <motion.span
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 55, damping: 17, mass: 1.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          transformOrigin: 'bottom',
          pointerEvents: 'none',
        }}
      />

      {/* Label */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'Mona Sans, sans-serif',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 700,
          color: hovered ? '#09090b' : '#ffffff',
          transition: 'color 0.22s ease',
        }}
      >
        {label}
      </span>

      {/* Arrow */}
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'inline-flex',
          alignItems: 'center',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path
            d="M1 5h12M8 1l5 4-5 4"
            stroke={hovered ? '#09090b' : '#ffffff'}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 0.22s ease' }}
          />
        </svg>
      </span>
    </Tag>
  )
}
