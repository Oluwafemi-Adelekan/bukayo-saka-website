import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Bukayo Saka | From Ealing to the World',
  description:
    'The official digital home of Bukayo Saka — Arsenal No.7, England international, and one of the most exciting footballers on the planet.',
  openGraph: {
    title: 'Bukayo Saka | From Ealing to the World',
    description:
      'Arsenal No.7. England international. Philanthropist. From Ealing to the World.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bukayo Saka | From Ealing to the World',
    description: 'Arsenal No.7. England international. From Ealing to the World.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Notable&family=Urbanist:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-white overflow-x-hidden antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  )
}
