'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { saveShortLink, formatUrl, isValidUrl } from '@/lib/shortlink'

interface ShortLink {
  code: string
  originalUrl: string
  createdAt: string
  clicks: number
}

interface ShortlinkFormProps {
  onShortlinkCreated?: (shortlink: ShortLink) => void
}

export function ShortlinkForm({ onShortlinkCreated }: ShortlinkFormProps) {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdCode, setCreatedCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!url.trim()) {
      setError('Masukkan URL yang ingin diperpendek')
      return
    }

    const formattedUrl = formatUrl(url)

    if (!isValidUrl(formattedUrl)) {
      setError('URL tidak valid. Silakan cek kembali.')
      return
    }

    if (customCode && !/^[a-zA-Z0-9_-]+$/.test(customCode)) {
      setError('Short code hanya boleh mengandung huruf, angka, underscore, dan dash')
      return
    }

    setIsLoading(true)

    try {
      const shortlink = saveShortLink(formattedUrl, customCode || undefined)
      
      setSuccess(true)
      setCreatedCode(shortlink.code)
      setUrl('')
      setCustomCode('')
      
      if (onShortlinkCreated) {
        onShortlinkCreated(shortlink)
      }

      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Terjadi kesalahan saat membuat short link')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const shortlinkUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${createdCode}`

  return (
    <Card className="w-full max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL yang akan diperpendek
          </label>
          <Input
            id="url"
            type="text"
            placeholder="https://example.com/very/long/url/path"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="custom-code" className="text-sm font-medium">
            Short Code (opsional)
          </label>
          <Input
            id="custom-code"
            type="text"
            placeholder="custom-code atau biarkan kosong untuk auto-generate"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value.toLowerCase())}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground">
            Biarkan kosong untuk membuat kode acak 6 karakter
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
            <p className="text-sm font-medium text-green-900">Short link berhasil dibuat!</p>
            <div className="bg-white rounded p-2 font-mono text-sm break-all text-green-700">
              {shortlinkUrl}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(shortlinkUrl)
              }}
              className="text-sm text-green-700 hover:text-green-900 font-medium underline"
            >
              Salin ke clipboard
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Membuat...' : 'Buat Short Link'}
        </Button>
      </form>
    </Card>
  )
}
