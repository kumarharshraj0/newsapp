import Post from "../../models/post.model.js"
import { errorHandler } from "../../utils/error.js"
import { invalidateCache } from "../../utils/cache.js"

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

