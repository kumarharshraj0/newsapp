import Post from "../../models/post.model.js"
import NodeCache from "node-cache"

// Cache for 60 seconds
const cache = new NodeCache({ stdTTL: 60 })

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 8
    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const isAdmin = req.query.isAdmin === "true"

    // Generate a unique cache key based on query parameters
    const cacheKey = `posts_${JSON.stringify(req.query)}`
    
    if (cache.has(cacheKey)) {
      console.log("Serving from Cache")
      return res.status(200).json(cache.get(cacheKey))
    }

    const statusFilter = isAdmin
      ? req.query.status ? { status: req.query.status } : {}
      : { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] }

    // Apply select for optimization: exclude content if fetching multiple posts for listing
    const isSinglePostRequest = req.query.slug || req.query.postId || req.query.content === 'true'
    const selectFields = isSinglePostRequest ? "" : "-content -metaDescription -metaTitle -keywords"

    const queryFilter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && req.query.category !== "all" && { category: req.query.category }),
      ...(req.query.subcategory && req.query.subcategory !== "all" && { subcategory: req.query.subcategory }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.language && req.query.language !== "all" && { language: req.query.language }),
      ...(req.query.date && {
        updatedAt: {
          $gte: new Date(new Date(req.query.date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(req.query.date).setHours(23, 59, 59, 999))
        }
      }),
      ...statusFilter,
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // Using .lean() for performance optimization
    const query = Post.find(queryFilter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      
    if (!isSinglePostRequest) {
      query.select(selectFields)
    }

    const posts = await query.lean()

    const countFilter = isAdmin ? {} : { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] }
    const totalPosts = await Post.countDocuments(countFilter)
    const totalFilteredPosts = await Post.countDocuments(queryFilter)

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...countFilter,
    })

    const result = { posts, totalPosts, totalFilteredPosts, lastMonthPosts }
    
    // Set cache
    cache.set(cacheKey, result)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
