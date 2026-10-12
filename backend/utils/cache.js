import NodeCache from "node-cache"

// High-performance In-Memory Cache for 1,000+ to 100,000+ daily readers
// stdTTL: 120 seconds (2 minutes default), checkperiod: 60s
const memoryCache = new NodeCache({
  stdTTL: 120,
  checkperiod: 60,
  useClones: false, // Disabling clones gives 2x-3x faster memory lookups
  maxKeys: 5000,    // Prevent unbounded memory growth
})

/**
 * Cache middleware for Express routes
 * @param {number} durationSeconds - Cache duration in seconds
 */
export const cacheMiddleware = (durationSeconds = 120) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next()
    }

    // Do not cache authenticated user-specific queries if needed
    const cacheKey = `cache_${req.originalUrl || req.url}`
    const cachedData = memoryCache.get(cacheKey)

    if (cachedData) {
      // Add debug and browser HTTP cache headers
      res.setHeader("X-Cache", "HIT")
      res.setHeader("Cache-Control", `public, max-age=${Math.min(durationSeconds, 60)}`)
      return res.status(200).json(cachedData)
    }

    // Intercept res.json to store into cache
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode === 200 && body) {
        memoryCache.set(cacheKey, body, durationSeconds)
        res.setHeader("X-Cache", "MISS")
        res.setHeader("Cache-Control", `public, max-age=${Math.min(durationSeconds, 60)}`)
      }
      return originalJson(body)
    }

    next()
  }
}

/**
 * Clear cache by prefix or clear all
 * @param {string} prefix - Optional key prefix to invalidate (e.g. 'posts', 'categories')
 */
export const invalidateCache = (prefix = "") => {
  if (!prefix) {
    memoryCache.flushAll()
    return
  }

  const keys = memoryCache.keys()
  const matchingKeys = keys.filter((key) => key.includes(prefix))
  if (matchingKeys.length > 0) {
    memoryCache.del(matchingKeys)
  }
}

export default memoryCache
