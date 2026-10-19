import React, { useEffect, useRef } from "react"

/**
 * ScrollReveal — wraps any element and animates it on scroll using IntersectionObserver.
 * Directly toggles 'is-visible' on DOM to avoid React re-renders and layout thrashing.
 */
const ScrollReveal = ({
  children,
  animation = "animate-on-scroll",
  delay = "",
  className = "",
  as: Tag = "div",
  threshold = 0.1,
}) => {
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
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      className={`${animation} ${delay} ${className}`}
    >
      {children}
    </Tag>
  )
}

export default ScrollReveal
