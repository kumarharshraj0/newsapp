import Post from "../../models/post.model.js"
import { errorHandler } from "../../utils/error.js"
import { invalidateCache } from "../../utils/cache.js"

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to update this post!"))
  }

  try {
    const updateFields = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      subcategory: req.body.subcategory,
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      imageCaption: req.body.imageCaption,
      language: req.body.language,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      keywords: req.body.keywords,
      canonicalUrl: req.body.canonicalUrl,
      metaRobots: req.body.metaRobots,
      schemaScript: req.body.schemaScript,
      tags: req.body.tags,
    }

    if (req.body.slug) {
      let clean = req.body.slug
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0900-\u097F\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")

      if (clean && clean.length >= 2) {
        updateFields.slug = clean
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateFields },
      { new: true }
    )

    invalidateCache("posts")
    res.status(200).json(updatedPost)
  } catch (error) {
    next(error)
  }
}

