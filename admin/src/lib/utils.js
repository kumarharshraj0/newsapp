import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function convertToReadableFormat(input) {
  // Convert the date string to a JavaScript Date object
  const dateObj = new Date(input)

  // Format the date into a readable format
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const readableDate = dateObj.toLocaleString("en-US", options)

  return readableDate
}

export function getPostUrl(post) {
  if (!post) return "#"
  const cat = post.category || "general"
  if (post.subcategory && post.subcategory !== "all") {
    return `/news/${cat}/${post.subcategory}/article/${post.slug}`
  }
  return `/news/${cat}/article/${post.slug}`
}

export function getCategoryUrl(categorySlug, subcategorySlug) {
  if (!categorySlug || categorySlug === "all") return "/search"
  if (subcategorySlug && subcategorySlug !== "all") {
    return `/news/${categorySlug}/${subcategorySlug}`
  }
  return `/news/${categorySlug}`
}
