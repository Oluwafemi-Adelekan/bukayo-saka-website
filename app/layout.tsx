import type { Metadata, Viewport } from 'next'
import './globals.css'
import 'lenis/dist/lenis.css'
import Navigation from '@/components/Navigation'
import SmoothScroll from '@/components/SmoothScroll'
import { Analytics } from '@vercel/analytics/next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bukayosaka.com'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bukayo Saka | From Ealing to the World',
    template: '%s | Bukayo Saka',
  },
  description:
    'The official digital home of Bukayo Saka — Arsenal No.7, England international, and one of the most exciting footballers on the planet. Born in Ealing, London, Saka rose from the Hale End Academy to become a Premier League star, FA Cup winner, and Euro finalist.',
  keywords: [
    'Bukayo Saka', 'Arsenal', 'Arsenal No 7', 'England', 'England football',
    'Premier League', 'Premier League player', 'Hale End Academy', 'Ealing',
    'FA Cup 2024', 'Euro 2024', 'World Cup 2022', 'footballer',
    'Big Shoe Foundation', 'Saka goals', 'Saka assists', 'Little Chilli',
  ],
  authors: [{ name: 'Bukayo Saka Fan Site' }],
  creator: 'bukayosaka.com',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/Saka Favicon.png',
    apple: '/Saka Favicon.png',
  },
  openGraph: {
    title: 'Bukayo Saka | From Ealing to the World',
    description:
      'Arsenal No.7. England international. FA Cup winner. Philanthropist. From the streets of Ealing to the world stage — the immersive story of Bukayo Saka.',
    type: 'website',
    url: SITE_URL,
    locale: 'en_GB',
    siteName: 'Bukayo Saka',
    images: [
      {
        url: '/0_Bukayo-Saka.jpg',
        width: 1200,
        height: 800,
        alt: 'Bukayo Saka — Arsenal No.7, England International',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bukayo Saka | From Ealing to the World',
    description: 'Arsenal No.7. England international. FA Cup winner. The immersive story of Bukayo Saka.',
    creator: '@BukayoSaka87',
    site: '@BukayoSaka87',
    images: ['/0_Bukayo-Saka.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Bukayo Saka',
  alternateName: ['Bukayo Ayoyinka Saka', 'Little Chilli', 'Saka'],
  birthDate: '2001-09-05',
  birthPlace: { '@type': 'Place', name: 'Ealing, London, England' },
  nationality: [
    { '@type': 'Country', name: 'England' },
    { '@type': 'Country', name: 'Nigeria' },
  ],
  jobTitle: 'Professional Footballer',
  description:
    'Bukayo Saka is an English professional footballer who plays as a winger for Arsenal and the England national team. Born in Ealing, London, he rose through the Hale End Academy to become one of the Premier League\'s most complete attacking players, winning the FA Cup in 2024 and reaching the Euro 2024 final.',
  image: `${SITE_URL}/0_Bukayo-Saka.jpg`,
  url: SITE_URL,
  memberOf: [
    {
      '@type': 'SportsTeam',
      name: 'Arsenal F.C.',
      sameAs: 'https://www.arsenal.com',
    },
    {
      '@type': 'SportsTeam',
      name: 'England national football team',
      sameAs: 'https://www.thefa.com',
    },
  ],
  award: [
    "England Men's Player of the Year 2023",
    'FA Cup Winner 2024',
    'PFA Young Player of the Year',
    'Arsenal Players\' Player of the Season',
    'Premier League Player of the Month',
  ],
  sameAs: [
    'https://www.instagram.com/bukayosaka87',
    'https://twitter.com/BukayoSaka87',
    'https://www.tiktok.com/@bukayosaka87',
    'https://en.wikipedia.org/wiki/Bukayo_Saka',
    'https://www.arsenal.com/players/bukayo-saka',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* Mona Sans (GitHub, open source, via Fontsource CDN) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/fontsource/fonts/mona-sans:vf@latest/latin-wght-normal.css"
        />
        {/* Fallbacks for Kegilka and old fonts during transition */}
        <link
          href="https://fonts.googleapis.com/css2?family=Notable&family=Urbanist:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-white overflow-x-hidden antialiased">
        <SmoothScroll />
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
