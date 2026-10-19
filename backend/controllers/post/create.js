import Post from "../../models/post.model.js"
import { errorHandler } from "../../utils/error.js"
import { invalidateCache } from "../../utils/cache.js"

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fields!"))
  }

  const sanitizeSlug = (raw) => {
    if (!raw) return `article-${Date.now()}`
    let clean = raw
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0900-\u097F\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")

    if (!clean || clean.length < 2) {
      clean = `article-${Date.now()}`
    }
    return clean
  }

  const slug = sanitizeSlug(req.body.slug || req.body.title)

  const status = req.user.isAdmin ? "approved" : "pending"

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    status,
  })

  try {
    const savedPost = await newPost.save()
    invalidateCache("posts")
    res.status(201).json(savedPost)
  } catch (error) {
    next(error)
  }
}
