export interface ShortLink {
  code: string
  originalUrl: string
  createdAt: string
  clicks: number
}

const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const STORAGE_KEY = 'shortlinks'

export function generateShortCode(length: number = 6): string {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }
  return code
}

export function getShortLinks(): ShortLink[] {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveShortLink(originalUrl: string, customCode?: string): ShortLink {
  const links = getShortLinks()
  
  let code = customCode || generateShortCode()
  
  // Ensure code is unique
  while (links.some(link => link.code === code)) {
    code = generateShortCode()
  }
  
  const newLink: ShortLink = {
    code,
    originalUrl,
    createdAt: new Date().toISOString(),
    clicks: 0
  }
  
  links.push(newLink)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
  
  return newLink
}

export function getShortLinkByCode(code: string): ShortLink | null {
  const links = getShortLinks()
  return links.find(link => link.code === code) || null
}

export function incrementClicks(code: string): void {
  const links = getShortLinks()
  const link = links.find(l => l.code === code)
  
  if (link) {
    link.clicks += 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
  }
}

export function deleteShortLink(code: string): void {
  const links = getShortLinks()
  const filtered = links.filter(link => link.code !== code)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url
  }
  return url
}
