import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Whitelist — prevents SSRF abuse while allowing our two image sources
const ALLOWED_HOSTS = ['crests.football-data.org', 'www.thesportsdb.com', 'upload.wikimedia.org', 'commons.wikimedia.org', 'media.api-sports.io']

export async function GET(req: NextRequest) {
  // ── ?url= branch — proxies thesportsdb.com (and football-data.org) badges ──
  const urlParam = req.nextUrl.searchParams.get('url')
  if (urlParam) {
    let parsed: URL
    try { parsed = new URL(urlParam) } catch {
      return new NextResponse(null, { status: 400 })
    }
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return new NextResponse(null, { status: 400 })
    }
    try {
      const res = await fetch(urlParam, {
        headers: { 'User-Agent': 'BukayoSakaFanSite/1.0 (contact@example.com)' },
        next: { revalidate: 86400 },
      })
      if (!res.ok) return new NextResponse(null, { status: 404 })
      const body = await res.arrayBuffer()
      return new NextResponse(body, {
        headers: {
          'Content-Type': res.headers.get('content-type') || (urlParam.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png'),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      })
    } catch {
      return new NextResponse(null, { status: 502 })
    }
  }

  // ── ?id= branch — proxies crests.football-data.org by numeric ID ──
  const raw = req.nextUrl.searchParams.get('id') ?? ''
  const id = raw.replace(/^\//, '').replace(/\.png$/i, '')
  if (!id || !/^\d+$/.test(id)) {
    return new NextResponse(null, { status: 400 })
  }

  const url = `https://crests.football-data.org/${id}.png`
  const headers: HeadersInit = {}
  if (process.env.FOOTBALL_DATA_API_KEY) {
    headers['X-Auth-Token'] = process.env.FOOTBALL_DATA_API_KEY
  }

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    })
    if (!res.ok) return new NextResponse(null, { status: 404 })
    const body = await res.arrayBuffer()
    return new NextResponse(body, {
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch {
    return new NextResponse(null, { status: 502 })
  }
}
