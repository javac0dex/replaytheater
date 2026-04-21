'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getShortLinks, deleteShortLink } from '@/lib/shortlink'
import { Trash2, Copy, Link as LinkIcon, BarChart3 } from 'lucide-react'

interface ShortLink {
  code: string
  originalUrl: string
  createdAt: string
  clicks: number
}

interface LinkHistoryProps {
  refresh?: boolean
  onDelete?: (code: string) => void
}

export function LinkHistory({ refresh, onDelete }: LinkHistoryProps) {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Delay untuk memastikan localStorage sudah updated
    const timer = setTimeout(() => {
      setLinks(getShortLinks())
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [refresh])

  const handleDelete = (code: string) => {
    deleteShortLink(code)
    setLinks(links.filter(link => link.code !== code))
    if (onDelete) {
      onDelete(code)
    }
  }

  const handleCopy = (code: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${code}`
    navigator.clipboard.writeText(url)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Memuat...</div>
  }

  if (links.length === 0) {
    return (
      <Card className="p-8 text-center">
        <LinkIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Belum ada short link. Buat yang pertama sekarang!</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-4 font-medium">Short Code</th>
              <th className="text-left p-4 font-medium">URL Asli</th>
              <th className="text-left p-4 font-medium">Dibuat</th>
              <th className="text-center p-4 font-medium">Klik</th>
              <th className="text-right p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {links.map((link) => (
              <tr key={link.code} className="hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <code className="bg-muted px-2 py-1 rounded text-sm font-mono font-medium">
                    {link.code}
                  </code>
                </td>
                <td className="p-4">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    title={link.originalUrl}
                  >
                    {truncateUrl(link.originalUrl)}
                  </a>
                </td>
                <td className="p-4 text-muted-foreground text-xs">
                  {formatDate(link.createdAt)}
                </td>
                <td className="p-4 text-center font-medium">
                  <span className="inline-flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {link.clicks}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(link.code)}
                      title="Salin ke clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.code)}
                      className="text-destructive hover:text-destructive"
                      title="Hapus link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
