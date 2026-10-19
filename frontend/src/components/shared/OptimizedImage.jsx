import React, { memo } from "react"

/**
 * OptimizedImage — Performance-optimized image component.
 *
 * For Unsplash/Appwrite images, it appends width (w) and quality (q) params.
 * For all images, it provides:
 *   - srcSet for responsive loading (browser picks smallest sufficient image)
 *   - sizes attribute for layout hints
 *   - loading="lazy" / "eager" with decoding="async" / "sync"
 *   - width/height to prevent CLS (Cumulative Layout Shift)
 *   - fetchPriority="high" for LCP hero images
 */
const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false, // true = LCP image (eager + fetchPriority="high")
  sizes,
  quality,
  widths,
  ...rest
}) => {
  // Check if image supports URL query params (Unsplash, Appwrite, Cloudinary, Pexels)
  const isOptimizable = src && (
    src.includes("unsplash.com") ||
    src.includes("images.unsplash.com") ||
    src.includes("cloud.appwrite.io") ||
    src.includes("res.cloudinary.com") ||
    src.includes("pexels.com")
  )

  // Intelligent automatic responsive presets when widths or sizes are not manually provided
  let computedWidths = widths
  let computedSizes = sizes
  let computedQuality = quality || 30

  if (!widths && width) {
    if (width <= 140) {
      // Mini thumbnails (e.g. 56px, 80px, 112px, 120px)
      computedWidths = [width, Math.round(width * 1.5), Math.round(width * 2)]
      if (!sizes) computedSizes = `${width}px`
      if (!quality) computedQuality = 25
    } else if (width <= 320) {
      computedWidths = [200, 320, 440]
      if (!sizes) computedSizes = `(max-width: 640px) 100vw, ${width}px`
      if (!quality) computedQuality = 30
    } else if (width <= 500) {
      // Column cards (e.g. 420px)
      computedWidths = [320, 420, 520]
      if (!sizes) computedSizes = `(max-width: 640px) 94vw, ${width}px`
      if (!quality) computedQuality = 25
    } else {
      // Large Hero / Feature images (e.g. 800px)
      computedWidths = [360, 500, 720, 960]
      if (!sizes) computedSizes = `(max-width: 768px) 100vw, 66vw`
      if (!quality) computedQuality = 20
    }
  } else if (!computedWidths) {
    computedWidths = [320, 420, 600]
  }

  if (!computedSizes) {
    computedSizes = "(max-width: 768px) 100vw, 420px"
  }

  // Build optimized src with proper width and quality
  const getOptimizedSrc = (w) => {
    if (!isOptimizable || !src) return src
    
    // Cloudinary optimization
    if (src.includes("res.cloudinary.com")) {
      const parts = src.split("/upload/")
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_${w},q_${computedQuality},f_webp/${parts[1]}`
      }
      return src
    }

    // Unsplash/Appwrite/Pexels optimization
    const url = new URL(src)
    url.searchParams.set("w", w)
    if (src.includes("pexels.com")) {
      url.searchParams.set("auto", "compress")
      url.searchParams.set("fm", "webp")
    } else {
      url.searchParams.set("q", computedQuality)
      if (src.includes("unsplash.com")) {
        url.searchParams.set("auto", "format")
        url.searchParams.set("fit", "crop")
      }
    }
    return url.toString()
  }

  // Generate srcSet for responsive images
  const srcSet = isOptimizable
    ? computedWidths.map(w => `${getOptimizedSrc(w)} ${w}w`).join(", ")
    : undefined

  const optimizedSrc = isOptimizable
    ? getOptimizedSrc(computedWidths[0] || 320)
    : src

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt || ""}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
      {...rest}
    />
  )
})

OptimizedImage.displayName = "OptimizedImage"

export default OptimizedImage
