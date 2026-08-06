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
  sizes = "(max-width: 768px) 100vw, 420px",
  quality = 40,
  widths = [320, 420, 640],
  ...rest
}) => {
  // Check if image supports URL query params (Unsplash, Appwrite, Cloudinary)
  const isOptimizable = src && (
    src.includes("unsplash.com") ||
    src.includes("images.unsplash.com") ||
    src.includes("cloud.appwrite.io") ||
    src.includes("res.cloudinary.com") ||
    src.includes("pexels.com")
  )

  // Build optimized src with proper width and quality
  const getOptimizedSrc = (w) => {
    if (!isOptimizable || !src) return src
    
    // Cloudinary optimization
    if (src.includes("res.cloudinary.com")) {
      const parts = src.split("/upload/")
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_${w},q_${quality},f_webp/${parts[1]}`
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
      url.searchParams.set("q", quality)
      if (src.includes("unsplash.com")) {
        url.searchParams.set("auto", "format")
        url.searchParams.set("fit", "crop")
      }
    }
    return url.toString()
  }

  // Generate srcSet for responsive images
  const srcSet = isOptimizable
    ? widths.map(w => `${getOptimizedSrc(w)} ${w}w`).join(", ")
    : undefined

  const optimizedSrc = isOptimizable
    ? getOptimizedSrc(widths[1] || 420) // Default to 420px width
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
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      {...rest}
    />
  )
})

OptimizedImage.displayName = "OptimizedImage"

export default OptimizedImage
