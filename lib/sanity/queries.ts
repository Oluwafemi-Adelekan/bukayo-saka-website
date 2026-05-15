import { groq } from 'next-sanity'
import { client } from './client'

// ── Types ────────────────────────────────────────────────────────────────────

export type SanityTrophy = {
  _id: string
  label: string
  count: number
  image: string | null
  years: string
}

export type SanityBTPSlide = {
  _id: string
  navLabel: string
  headline: string
  body: string
  image: string | null
}

export type SanityChapterImage = {
  src: string | null
  alt: string
  x: number
  y: number
  z: number
}

export type SanityCareerChapter = {
  _id: string
  lines: string[]
  subtitle: string
  order: number
  headingX: number
  headingY: number
  headingZ: number
  images: SanityChapterImage[]
}

export type SanityMilestone = {
  _id: string
  type: 'debut' | 'facup' | 'england_callup' | 'first_goal'
  heading: string
  subheading: string
  body: string
  year: string
}

export type SanitySettings = {
  englandStats: {
    caps: number
    goals: number
    assists: number
    ga: number
    shirt: number
  } | null
  mainQuote: string | null
  arsenalStory: string | null
  englandDescription: string | null
}

// ── Queries ──────────────────────────────────────────────────────────────────

const TROPHIES_QUERY = groq`
  *[_type == "trophy"] | order(order asc) {
    _id,
    label,
    count,
    "image": image.asset->url,
    years
  }
`

const BTP_SLIDES_QUERY = groq`
  *[_type == "beyondThePitchSlide"] | order(order asc) {
    _id,
    navLabel,
    headline,
    body,
    "image": image.asset->url
  }
`

const CAREER_CHAPTERS_QUERY = groq`
  *[_type == "careerChapter"] | order(order asc) {
    _id,
    lines,
    subtitle,
    order,
    headingX,
    headingY,
    headingZ,
    "images": images[] {
      "src": image.asset->url,
      alt,
      x,
      y,
      z
    }
  }
`

const MILESTONES_QUERY = groq`
  *[_type == "careerMilestone"] {
    _id,
    type,
    heading,
    subheading,
    body,
    year
  }
`

const SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    englandStats,
    mainQuote,
    arsenalStory,
    englandDescription
  }
`

// ── Fetchers (server-side, cached) ───────────────────────────────────────────

export async function getTrophies(): Promise<SanityTrophy[]> {
  return client.fetch(TROPHIES_QUERY, {}, { next: { revalidate: 3600 } })
}

export async function getBTPSlides(): Promise<SanityBTPSlide[]> {
  return client.fetch(BTP_SLIDES_QUERY, {}, { next: { revalidate: 3600 } })
}

export async function getCareerChapters(): Promise<SanityCareerChapter[]> {
  return client.fetch(CAREER_CHAPTERS_QUERY, {}, { next: { revalidate: 3600 } })
}

export async function getMilestones(): Promise<SanityMilestone[]> {
  return client.fetch(MILESTONES_QUERY, {}, { next: { revalidate: 3600 } })
}

export async function getSiteSettings(): Promise<SanitySettings | null> {
  return client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600 } })
}
