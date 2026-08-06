import React from "react"
import useScrollAnimation from "@/hooks/useScrollAnimation"

/**
 * ScrollReveal — wraps any element and animates it on scroll.
 *
 * Props:
 *   animation: "animate-on-scroll" | "animate-slide-left" | "animate-slide-right" | "animate-fade" | "animate-scale"
 *   delay:     "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500"
 *   className: extra classes
 *   as:        HTML tag to render (default "div")
 */
const ScrollReveal = ({
  children,
  animation = "animate-on-scroll",
  delay = "",
  className = "",
  as: Tag = "div",
  threshold,
}) => {
  const [ref, isVisible] = useScrollAnimation({ threshold })

  return (
    <Tag
      ref={ref}
      className={`${animation} ${delay} ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  )
}

export default ScrollReveal
