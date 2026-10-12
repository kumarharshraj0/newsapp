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
      language: req.body.language,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      keywords: req.body.keywords,
      canonicalUrl: req.body.canonicalUrl,
      schemaScript: req.body.schemaScript,
    }

    if (req.body.slug) {
      updateFields.slug = req.body.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\u0900-\u097F-]/g, "")
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

