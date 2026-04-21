'use client'

import { useState } from 'react'
import { ShortlinkForm } from '@/components/shortlink-form'
import { LinkHistory } from '@/components/link-history'
import { Link as LinkIcon } from 'lucide-react'

interface ShortLink {
  code: string
  originalUrl: string
  createdAt: string
  clicks: number
}

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState(false)

  const handleShortlinkCreated = (shortlink: ShortLink) => {
    setRefreshHistory(!refreshHistory)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <LinkIcon className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            ASEP Kopling
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Perpendek URL panjang menjadi link yang ringkas dan mudah dibagikan
          </p>
        </div>

        {/* Form Section */}
        <div className="flex justify-center">
          <ShortlinkForm onShortlinkCreated={handleShortlinkCreated} />
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">Riwayat Link</h2>
            <p className="text-muted-foreground mt-1">Kelola semua short link yang telah Anda buat</p>
          </div>
          <LinkHistory refresh={refreshHistory} />
        </div>
      </div>
    </main>
  )
}
