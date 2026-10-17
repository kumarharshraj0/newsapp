import Post from "../../models/post.model.js"
import { errorHandler } from "../../utils/error.js"
import memoryCache, { invalidateCache } from "../../utils/cache.js"

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }
    const userIndex = post.likes.indexOf(req.user.id)
    if (userIndex === -1) {
      post.likes.push(req.user.id)
      post.numberOfLikes += 1
    } else {
      post.likes.splice(userIndex, 1)
      post.numberOfLikes -= 1
    }
    await post.save()
    invalidateCache("posts")
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

export const approvePost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Only admins can approve posts!"))
  }
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { status: "approved" } },
      { new: true }
    )
    if (!post) return next(errorHandler(404, "Post not found"))
    invalidateCache("posts")
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

export const rejectPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Only admins can reject posts!"))
  }
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: { status: "rejected" } },
      { new: true }
    )
    if (!post) return next(errorHandler(404, "Post not found"))
    invalidateCache("posts")
    res.status(200).json(post)
  } catch (error) {
    next(error)
  }
}

export const trackView = async (req, res, next) => {
  try {
    const { postId } = req.params
    if (!postId) {
      return next(errorHandler(400, "Post ID or slug is required"))
    }

    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || req.socket?.remoteAddress || "local"
    const readerToken = req.cookies?.reader_id
    const ipKey = `viewed_ip_${clientIp}_${postId}`
    const tokenKey = readerToken ? `viewed_tok_${readerToken}_${postId}` : null

    const alreadyViewed = (tokenKey && memoryCache.has(tokenKey)) || memoryCache.has(ipKey)

    if (alreadyViewed) {
      return res.status(200).json({ success: true, message: "View already counted recently" })
    }

    memoryCache.set(ipKey, true, 1800)
    const activeToken = readerToken || `r_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    memoryCache.set(`viewed_tok_${activeToken}_${postId}`, true, 1800)

    if (!readerToken) {
      const isProd = process.env.NODE_ENV === "production"
      res.cookie("reader_id", activeToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        ...(isProd && { domain: ".newpulse.in" }),
      })
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(postId)
    const query = isObjectId ? { _id: postId } : { slug: postId }

    const post = await Post.findOneAndUpdate(
      query,
      { $inc: { views: 1 } },
      { new: true, timestamps: false }
    ).select("views")

    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }

    res.status(200).json({ success: true, views: post.views })
  } catch (error) {
    next(error)
  }
}

