import Post from "../../models/post.model.js"
import { errorHandler } from "../../utils/error.js"

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to delete this post!"))
  }

  try {
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json("Post has been deleted!")
  } catch (error) {
    next(error)
  }
}
