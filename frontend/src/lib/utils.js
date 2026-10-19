import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" })
const longDateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "2-digit", year: "numeric" })

export function convertToReadableFormat(input) {
  const dateObj = new Date(input)
  return longDateFormatter.format(dateObj)
}

export function formatDate(input, formatStyle = "long") {
  const dateObj = new Date(input)
  if (formatStyle === "short") {
    return shortDateFormatter.format(dateObj)
  }
  return longDateFormatter.format(dateObj)
}

export function timeAgo(dateParam) {
  if (!dateParam) return null
  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam)
  const today = new Date()
  const seconds = Math.round((today - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)
  const months = Math.round(days / 30.416)
  const years = Math.round(days / 365)

  if (seconds < 60) return "just now"
  else if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  else if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  else if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  else if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`
  else return `${years} year${years > 1 ? "s" : ""} ago`
}

export function getPostUrl(post) {
  if (!post) return "#"
  return `/post/${post.slug}`
}

export function getCategoryUrl(categorySlug, subcategorySlug) {
  if (!categorySlug || categorySlug === "all") return "/search"
  if (subcategorySlug && subcategorySlug !== "all") {
    return `/news/${categorySlug}/${subcategorySlug}`
  }
  return `/news/${categorySlug}`
}
