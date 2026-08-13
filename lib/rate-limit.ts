// In-memory sliding-window rate limiter (per serverless instance).
// Good enough to blunt burst attacks; DB-level caps are the authoritative guard.

const store = new Map<string, number[]>()

// Prune old entries every 5 minutes to prevent unbounded growth.
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cutoff = Date.now() - 10 * 60 * 1000
    for (const [key, timestamps] of store.entries()) {
      const fresh = timestamps.filter(t => t > cutoff)
      if (fresh.length === 0) store.delete(key)
      else store.set(key, fresh)
    }
  }, 5 * 60 * 1000)
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key      Unique key, e.g. `post:${ip}`
 * @param limit    Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = (store.get(key) ?? []).filter(t => now - t < windowMs)
  if (timestamps.length >= limit) return false
  timestamps.push(now)
  store.set(key, timestamps)
  return true
}

export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}
