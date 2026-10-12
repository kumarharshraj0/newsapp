import Post from "../../models/post.model.js"
import memoryCache from "../../utils/cache.js"

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 8
    const sortDirection = req.query.sort === "asc" ? 1 : -1
    const isAdmin = req.query.isAdmin === "true"

    // Generate a unique cache key based on query parameters
    const cacheKey = `posts_${JSON.stringify(req.query)}`
    
    if (memoryCache.has(cacheKey)) {
      res.setHeader("X-Cache", "HIT")
      return res.status(200).json(memoryCache.get(cacheKey))
    }

    const statusFilter = isAdmin
      ? req.query.status ? { status: req.query.status } : {}
      : { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] }

    // Optimization: Exclude heavy content unless single article is requested
    const isSinglePostRequest = Boolean(req.query.slug || req.query.postId || req.query.content === "true")
    const selectFields = isSinglePostRequest ? "" : "-content -schemaScript"

    // Timeframe filtering for popular posts
    let timeframeFilter = {}
    if (req.query.timeframe === "week") {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      timeframeFilter = { createdAt: { $gte: oneWeekAgo } }
    } else if (req.query.timeframe === "month") {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      timeframeFilter = { createdAt: { $gte: oneMonthAgo } }
    }

    const queryFilter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && req.query.category !== "all" && { category: req.query.category }),
      ...(req.query.subcategory && req.query.subcategory !== "all" && { subcategory: req.query.subcategory }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.language && req.query.language !== "all" && { language: req.query.language }),
      ...timeframeFilter,
      ...(req.query.date && {
        updatedAt: {
          $gte: new Date(new Date(req.query.date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(req.query.date).setHours(23, 59, 59, 999)),
        },
      }),
      ...statusFilter,
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }

    // Sorting: popular (by numberOfLikes) or updatedAt
    let sortObj = { updatedAt: sortDirection }
    if (req.query.sort === "popular") {
      sortObj = { numberOfLikes: -1, createdAt: -1 }
    }

    // Query with .lean() for maximum JSON serialization performance
    const query = Post.find(queryFilter)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .lean()

    if (!isSinglePostRequest) {
      query.select(selectFields)
    }

    // Execute posts query and counts in parallel
    const countFilter = isAdmin ? {} : { $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }] }
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [posts, totalPosts, totalFilteredPosts, lastMonthPosts] = await Promise.all([
      query,
      Post.countDocuments(countFilter),
      Post.countDocuments(queryFilter),
      Post.countDocuments({ createdAt: { $gte: oneMonthAgo }, ...countFilter }),
    ])

    const result = { posts, totalPosts, totalFilteredPosts, lastMonthPosts }
    
    // Cache for 120 seconds (2 mins)
    memoryCache.set(cacheKey, result, 120)
    res.setHeader("X-Cache", "MISS")

    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

