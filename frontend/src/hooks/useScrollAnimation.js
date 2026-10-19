import { useEffect, useRef } from "react"

/**
 * useScrollAnimation hook
 * Uses IntersectionObserver to directly add 'is-visible' class on intersection.
 * Completely eliminates synchronous layout reading (getBoundingClientRect / offsetTop)
 * and bypasses React state re-renders to prevent Layout Thrashing.
 */
const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref]
}

export default useScrollAnimation
