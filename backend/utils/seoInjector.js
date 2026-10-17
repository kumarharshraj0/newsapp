import path from "path"
import fs from "fs"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

const __dirname = path.resolve()

// Helper to escape HTML characters in strings for meta tag attributes
const escapeHtml = (str) => {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

/**
 * Injects dynamic SEO, OpenGraph, Twitter, and Schema.org metadata into index.html
 * for crawlers (WhatsApp, Facebook, Twitter, Googlebot/Discover).
 */
export const injectArticleMeta = async (req, res, next) => {
  try {
    // 1. Identify the slug from parameters or request path
    let slug = req.params.slug || req.params.postSlug

    if (!slug) {
      // If path is like /post/my-slug or /news/sports/article/my-slug or /my-slug
      const segments = req.path.split("/").filter(Boolean)
      slug = segments[segments.length - 1]
    }

    if (!slug) return next()

    // Skip if requesting static assets, api routes, or admin routes
    if (
      slug.includes(".") ||
      req.path.startsWith("/api") ||
      req.path.startsWith("/admin") ||
      slug === "search" ||
      slug === "sign-in" ||
      slug === "sign-up" ||
      slug === "dashboard" ||
      slug === "about"
    ) {
      return next()
    }

    // Locate index.html (production build first, fallback to source)
    let indexPath = path.join(__dirname, "../frontend/dist/index.html")
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(__dirname, "../frontend/index.html")
    }

    if (!fs.existsSync(indexPath)) {
      return next()
    }

    let html = fs.readFileSync(indexPath, "utf-8")

    // 2. Fetch the article document from MongoDB
    const post = await Post.findOne({ slug })
    if (!post) {
      // Article not found, let frontend handle 404 or SPA route
      return res.send(html)
    }

    // Fetch Author info
    let authorName = "Newpulse Editorial Team"
    if (post.userId) {
      try {
        const user = await User.findById(post.userId).select("username")
        if (user && user.username) {
          authorName = user.username
        }
      } catch (e) {
        // Fallback to default authorName
      }
    }

    const title = post.metaTitle || post.title || ""
    const description = post.metaDescription || post.seoDescription || ""
    const keywords = post.keywords || ""
    const canonicalUrl = post.canonicalUrl || ""
    const metaRobots = post.metaRobots || "index, follow, max-image-preview:large"
    const image = post.image || ""
    const imageAlt = post.imageAlt || title
    const schemaScript = post.schemaScript
      ? post.schemaScript.replace(/<\/?script[^>]*>/gi, "").trim()
      : ""
    const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : ""
    const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : ""
    const category = post.category || ""

    // 3. Remove existing meta/OG/Twitter/title tags and existing schemas to avoid duplicates
    html = html
      .replace(/<title>[\s\S]*?<\/title>/gi, "")
      .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, "")
      .replace(/<meta\s+name=["']keywords["'][\s\S]*?>/gi, "")
      .replace(/<link\s+rel=["']canonical["'][\s\S]*?>/gi, "")
      .replace(/<meta\s+name=["']robots["'][\s\S]*?>/gi, "")
      .replace(/<meta\s+property=["']og:[\s\S]*?>/gi, "")
      .replace(/<meta\s+property=["']article:[\s\S]*?>/gi, "")
      .replace(/<meta\s+name=["']twitter:[\s\S]*?>/gi, "")
      .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, "")

    // 4. Build dynamic replacement tags from backend admin fields
    let dynamicTags = `\n    <!-- Dynamic Meta Tags from Backend Admin -->`
    if (title) {
      dynamicTags += `\n    <title>${escapeHtml(title)}</title>`
      dynamicTags += `\n    <meta property="og:title" content="${escapeHtml(title)}" />`
      dynamicTags += `\n    <meta name="twitter:title" content="${escapeHtml(title)}" />`
    }
    if (metaRobots) {
      dynamicTags += `\n    <meta name="robots" content="${escapeHtml(metaRobots)}" />`
    }
    if (description) {
      dynamicTags += `\n    <meta name="description" content="${escapeHtml(description)}" />`
      dynamicTags += `\n    <meta property="og:description" content="${escapeHtml(description)}" />`
      dynamicTags += `\n    <meta name="twitter:description" content="${escapeHtml(description)}" />`
    }
    if (keywords) {
      dynamicTags += `\n    <meta name="keywords" content="${escapeHtml(keywords)}" />`
    }
    if (canonicalUrl) {
      dynamicTags += `\n    <link rel="canonical" href="${canonicalUrl}" />`
      dynamicTags += `\n    <meta property="og:url" content="${canonicalUrl}" />`
    }
    if (image) {
      let ogImage = image
      if (ogImage.includes("res.cloudinary.com")) {
        // WhatsApp link crawler strictly rejects .webp; convert Cloudinary URL to optimized 1200x630 JPG
        ogImage = ogImage.replace(/\.webp($|\?)/i, ".jpg$1")
        if (!ogImage.includes("/f_jpg") && ogImage.includes("/upload/")) {
          ogImage = ogImage.replace("/upload/", "/upload/f_jpg,w_1200,h_630,c_fill/")
        }
      }

      dynamicTags += `\n    <meta property="og:image" content="${ogImage}" />`
      dynamicTags += `\n    <meta property="og:image:secure_url" content="${ogImage}" />`
      dynamicTags += `\n    <meta property="og:image:type" content="image/jpeg" />`
      dynamicTags += `\n    <meta property="og:image:width" content="1200" />`
      dynamicTags += `\n    <meta property="og:image:height" content="630" />`
      if (imageAlt) {
        dynamicTags += `\n    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`
        dynamicTags += `\n    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`
      }
      dynamicTags += `\n    <meta name="twitter:image" content="${ogImage}" />`
      dynamicTags += `\n    <meta name="twitter:card" content="summary_large_image" />`
    }
    dynamicTags += `\n    <meta property="og:type" content="article" />`
    if (publishedTime) {
      dynamicTags += `\n    <meta property="article:published_time" content="${publishedTime}" />`
    }
    if (modifiedTime) {
      dynamicTags += `\n    <meta property="article:modified_time" content="${modifiedTime}" />`
    }
    if (category) {
      dynamicTags += `\n    <meta property="article:section" content="${escapeHtml(category)}" />`
    }
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach((tag) => {
        dynamicTags += `\n    <meta property="article:tag" content="${escapeHtml(tag)}" />`
      })
    }
    if (schemaScript) {
      dynamicTags += `\n    <script type="application/ld+json">\n${schemaScript}\n    </script>`
    }

    // Inject before </head>
    html = html.replace("</head>", `${dynamicTags}\n  </head>`)

    // Send rendered response
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    return res.send(html)
  } catch (error) {
    console.error("SEO Meta Injection Error:", error)
    next(error)
  }
}
