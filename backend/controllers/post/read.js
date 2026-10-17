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
    
    // Bypass cache for admin or direct single article reads
    if (!isAdmin && !req.query.slug && memoryCache.has(cacheKey)) {
      res.setHeader("X-Cache", "HIT")
      return res.status(200).json(memoryCache.get(cacheKey))
    }

    // Automatically count view on direct article read (with anti-spam refresh protection)
    if (!isAdmin && req.query.slug) {
      const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || req.socket?.remoteAddress || "local"
      const readerToken = req.cookies?.reader_id
      const ipKey = `viewed_ip_${clientIp}_${req.query.slug}`
      const tokenKey = readerToken ? `viewed_tok_${readerToken}_${req.query.slug}` : null

      const alreadyViewed = (tokenKey && memoryCache.has(tokenKey)) || memoryCache.has(ipKey)

      if (!alreadyViewed) {
        // Cooldown for 30 minutes so refreshing the same article does NOT increase views
        memoryCache.set(ipKey, true, 1800)

        const activeToken = readerToken || `r_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        memoryCache.set(`viewed_tok_${activeToken}_${req.query.slug}`, true, 1800)

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

        await Post.findOneAndUpdate(
          { slug: req.query.slug },
          { $inc: { views: 1 } },
          { timestamps: false }
        )
      }
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
        $or: [
          {
            createdAt: {
              $gte: new Date(new Date(req.query.date).setHours(0, 0, 0, 0)),
              $lt: new Date(new Date(req.query.date).setHours(23, 59, 59, 999)),
            },
          },
          {
            updatedAt: {
              $gte: new Date(new Date(req.query.date).setHours(0, 0, 0, 0)),
              $lt: new Date(new Date(req.query.date).setHours(23, 59, 59, 999)),
            },
          },
        ],
      }),
      ...(req.query.tag && { tags: req.query.tag }),
      ...(req.query.tags && {
        tags: {
          $in: Array.isArray(req.query.tags)
            ? req.query.tags
            : req.query.tags.split(",").map((t) => t.trim()).filter(Boolean),
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

    // Sorting: popular (by views & likes), views, updatedAt, or default createdAt (publish date)
    let sortObj = { createdAt: sortDirection }
    if (req.query.sort === "popular") {
      sortObj = { views: -1, numberOfLikes: -1, createdAt: -1 }
    } else if (req.query.sort === "views") {
      sortObj = { views: -1, createdAt: -1 }
    } else if (req.query.sort === "updatedAt") {
      sortObj = { updatedAt: sortDirection }
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
    
    // Cache for 120 seconds (2 mins) for public queries (except single article reads)
    if (!isAdmin && !req.query.slug) {
      memoryCache.set(cacheKey, result, 120)
    }
    res.setHeader("X-Cache", "MISS")

    return res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

// Fetch related posts based on tags & category for high engagement & SEO internal linking
export const getRelatedPosts = async (req, res, next) => {
  try {
    const { postId, tags, category, limit = 4 } = req.query
    const parsedLimit = Math.min(12, Math.max(1, parseInt(limit) || 4))

    const filter = {
      ...(postId && { _id: { $ne: postId } }),
      $or: [{ status: "approved" }, { status: { $exists: false } }, { status: null }],
    }

    const orConditions = []
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean)
      if (tagList.length > 0) {
        orConditions.push({ tags: { $in: tagList } })
      }
    }
    if (category && category !== "all" && category !== "uncategorized") {
      orConditions.push({ category })
    }

    if (orConditions.length > 0) {
      filter.$and = [{ $or: orConditions }]
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(parsedLimit)
      .select("title slug image imageAlt imageCaption category createdAt updatedAt numberOfLikes tags")
      .lean()

    res.status(200).json(posts)
  } catch (error) {
    next(error)
  }
}

