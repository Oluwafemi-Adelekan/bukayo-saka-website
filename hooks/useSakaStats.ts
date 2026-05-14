'use client'

import { useState, useEffect } from 'react'

export type SakaCareerStats = {
  plGoals:          number
  plAssists:        number
  arsGoals:         number
  arsAssists:       number
  goalInvolvements: number
  shirt:            number
  engCaps:          number
  engGoals:         number
  engAssists:       number
  engGA:            number
}

const FALLBACK: SakaCareerStats = {
  plGoals:          50,
  plAssists:        64,
  arsGoals:         83,
  arsAssists:       64,
  goalInvolvements: 147,
  shirt:            7,
  engCaps:          63,
  engGoals:         16,
  engAssists:       17,
  engGA:            33,
}

// Module-level cache so the fetch only happens once per browser session
let cached: SakaCareerStats | null = null

export function useSakaStats(): { stats: SakaCareerStats; loading: boolean } {
  const [stats, setStats] = useState<SakaCareerStats>(cached ?? FALLBACK)
  const [loading, setLoading] = useState(cached === null)

  useEffect(() => {
    if (cached) return
    fetch('/api/saka-stats')
      .then((r) => r.json())
      .then((data) => {
        if (data?.career) {
          cached = { ...FALLBACK, ...data.career }
          setStats(cached as SakaCareerStats)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}
