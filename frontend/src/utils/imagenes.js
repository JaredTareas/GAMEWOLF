const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'

export function getImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path

  if (path.includes('storage/')) {
    const cleanPath = path.startsWith('/') ? path : '/' + path
    return BACKEND_URL + cleanPath
  }

  return path
}
