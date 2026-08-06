import { useEffect, useRef, useState } from "react"

/**
 * useScrollAnimation hook
 * Returns a ref and a boolean `isVisible`.
 * When the element enters the viewport, isVisible becomes true.
 */
const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Unobserve after first trigger (animate once)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: options.threshold || 0.12,
        rootMargin: options.rootMargin || "0px 0px -40px 0px",
      }
    )

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

export default useScrollAnimation
