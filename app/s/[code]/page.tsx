'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getShortLinkByCode, incrementClicks } from '@/lib/shortlink'

export default function RedirectPage() {
  const params = useParams()
  const code = params.code as string

  useEffect(() => {
    if (code) {
      const shortlink = getShortLinkByCode(code)

      if (shortlink) {
        // Increment clicks
        incrementClicks(code)

        // Redirect to original URL
        window.location.href = shortlink.originalUrl
      } else {
        // Redirect to home if code not found
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }
    }
  }, [code])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Sedang Mengarahkan...</h1>
        <p className="text-muted-foreground">
          {code ? 'Mengalihkan Anda ke URL tujuan...' : 'Short link tidak ditemukan.'}
        </p>
      </div>
    </main>
  )
}
