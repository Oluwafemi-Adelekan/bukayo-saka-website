'use client'

import { ArrowUpRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { ElementType, MouseEventHandler } from 'react'

type Props = {
  label: string
  active: boolean
  as?: ElementType
  href?: string
  target?: string
  rel?: string
  onClick?: MouseEventHandler<HTMLElement>
}

export default function RevealArrowCta({
  label,
  active,
  as,
  href,
  target,
  rel,
  onClick,
}: Props) {
  const Tag = as || (href ? 'a' : 'div')

  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        cursor: href ? 'pointer' : 'inherit',
      }}
    >
      <motion.span
        animate={{
          opacity: active ? 1 : 0,
          maxWidth: active ? 180 : 0,
          paddingRight: active ? 6 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          fontFamily: 'Mona Sans, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#ffffff',
          fontWeight: 700,
        }}
      >
        {label}
      </motion.span>
      <ArrowUpRight
        size={13}
        color={active ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}
        weight="bold"
      />
    </Tag>
  )
}
