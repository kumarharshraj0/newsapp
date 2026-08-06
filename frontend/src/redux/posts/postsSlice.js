import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchHomePosts = createAsyncThunk(
  "posts/fetchHome",
  async ({ language = "all" } = {}, { rejectWithValue }) => {
    try {
      // Consume the prefetch promise to eliminate the CSR waterfall delay for LCP!
      if (language === "all" && window.__INITIAL_DATA_PROMISE__) {
        const posts = await window.__INITIAL_DATA_PROMISE__;
        window.__INITIAL_DATA_PROMISE__ = null; // Mark as consumed
        if (posts) return posts;
      }
      
      const langParam = language && language !== "all" ? `&language=${language}` : ""
      const res = await axios.get(`/api/post/getPosts?limit=20${langParam}`)
      return res.data.posts
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// Fetch all categories — shared across Home, Search, CreatePost, EditPost
// Using condition to prevent duplicate requests if already loaded
export const fetchCategories = createAsyncThunk(
  "posts/fetchCategories",
  async (_, { getState, rejectWithValue }) => {
    const { posts } = getState()
    if (posts.categories.length > 0) return posts.categories // already cached
    try {
      const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) return res.data
      return rejectWithValue("Failed to fetch categories")
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchSearchPosts = createAsyncThunk(
  "posts/fetchSearch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiParams = new URLSearchParams()
      if (params.searchTerm) apiParams.set("searchTerm", params.searchTerm)
      if (params.sort) apiParams.set("sort", params.sort)
      if (params.category && params.category !== "all") apiParams.set("category", params.category)
      if (params.subcategory && params.subcategory !== "all") apiParams.set("subcategory", params.subcategory)
      if (params.language && params.language !== "all") apiParams.set("language", params.language)
      apiParams.set("limit", params.limit || 8)
      apiParams.set("startIndex", params.startIndex || 0)
      const res = await axios.get(`/api/post/getposts?${apiParams.toString()}`)
      return { posts: res.data.posts, totalPosts: res.data.totalPosts }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchMoreSearchPosts = createAsyncThunk(
  "posts/fetchMoreSearch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const apiParams = new URLSearchParams()
      if (params.searchTerm) apiParams.set("searchTerm", params.searchTerm)
      if (params.sort) apiParams.set("sort", params.sort)
      if (params.category && params.category !== "all") apiParams.set("category", params.category)
      if (params.subcategory && params.subcategory !== "all") apiParams.set("subcategory", params.subcategory)
      if (params.language && params.language !== "all") apiParams.set("language", params.language)
      apiParams.set("limit", params.limit || 8)
      apiParams.set("startIndex", params.startIndex || 0)
      const res = await axios.get(`/api/post/getposts?${apiParams.toString()}`)
      return { posts: res.data.posts, totalPosts: res.data.totalPosts }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchTickerPosts = createAsyncThunk(
  "posts/fetchTicker",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/post/getposts?limit=5")
      return res.data.posts
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPostBySlug = createAsyncThunk(
  "posts/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/post/getposts?slug=${slug}`)
      if (res.data.posts && res.data.posts.length > 0) {
        return res.data.posts[0]
      }
      return rejectWithValue("Post not found")
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchRecentPosts = createAsyncThunk(
  "posts/fetchRecent",
  async (limit = 3, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/post/getposts?limit=${limit}`)
      return res.data.posts
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchPublisherPosts = createAsyncThunk(
  "posts/fetchPublisherPosts",
  async ({ userId, sort, limit = 6 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/post/getposts?userId=${userId}&limit=${limit}&sort=${sort}`)
      return res.data.posts
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchMorePublisherPosts = createAsyncThunk(
  "posts/fetchMorePublisherPosts",
  async ({ userId, sort, startIndex, limit = 6 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/post/getposts?userId=${userId}&limit=${limit}&startIndex=${startIndex}&sort=${sort}`)
      return res.data.posts
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const likePost = createAsyncThunk(
  "posts/like",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/post/likepost/${postId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

// ─── Slice ───────────────────────────────────────────────────────────────────

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    homePosts: [],
    homeLoading: false,
    searchPosts: [],
    searchTotal: 0,
    searchLoading: false,
    tickerPosts: [],
    currentPost: null,
    currentPostLoading: false,
    recentPosts: [],
    recentPostsLoading: false,
    publisherPosts: [],
    publisherPostsLoading: false,
    publisherShowMore: true,
    // Shared categories — fetched once, reused everywhere
    categories: [],
    categoriesLoading: false,
    error: null,
  },
  reducers: {
    clearSearchPosts(state) {
      state.searchPosts = []
      state.searchTotal = 0
    },
    clearCurrentPost(state) {
      state.currentPost = null
    },
    clearPublisherPosts(state) {
      state.publisherPosts = []
      state.publisherShowMore = true
    }
  },
  extraReducers: (builder) => {
    builder
      // Home
      .addCase(fetchHomePosts.pending, (state) => { state.homeLoading = true; state.error = null })
      .addCase(fetchHomePosts.fulfilled, (state, action) => { state.homeLoading = false; state.homePosts = action.payload })
      .addCase(fetchHomePosts.rejected, (state, action) => { state.homeLoading = false; state.error = action.payload })
      // Search
      .addCase(fetchSearchPosts.pending, (state) => { state.searchLoading = true; state.error = null })
      .addCase(fetchSearchPosts.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchPosts = action.payload.posts
        state.searchTotal = action.payload.totalPosts
      })
      .addCase(fetchSearchPosts.rejected, (state, action) => { state.searchLoading = false; state.error = action.payload })
      // More search
      .addCase(fetchMoreSearchPosts.fulfilled, (state, action) => {
        state.searchPosts = [...state.searchPosts, ...action.payload.posts]
        state.searchTotal = action.payload.totalPosts
      })
      // Ticker
      .addCase(fetchTickerPosts.fulfilled, (state, action) => { state.tickerPosts = action.payload })
      // Single Post
      .addCase(fetchPostBySlug.pending, (state) => { state.currentPostLoading = true; state.error = null })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => { state.currentPostLoading = false; state.currentPost = action.payload })
      .addCase(fetchPostBySlug.rejected, (state, action) => { state.currentPostLoading = false; state.error = action.payload })
      // Recent Posts
      .addCase(fetchRecentPosts.pending, (state) => { state.recentPostsLoading = true })
      .addCase(fetchRecentPosts.fulfilled, (state, action) => { state.recentPostsLoading = false; state.recentPosts = action.payload })
      .addCase(fetchRecentPosts.rejected, (state) => { state.recentPostsLoading = false })
      // Publisher Posts
      .addCase(fetchPublisherPosts.pending, (state) => { state.publisherPostsLoading = true })
      .addCase(fetchPublisherPosts.fulfilled, (state, action) => {
        state.publisherPostsLoading = false
        state.publisherPosts = action.payload
        state.publisherShowMore = action.payload.length >= 6
      })
      .addCase(fetchPublisherPosts.rejected, (state) => { state.publisherPostsLoading = false })
      // More Publisher Posts
      .addCase(fetchMorePublisherPosts.fulfilled, (state, action) => {
        state.publisherPosts = [...state.publisherPosts, ...action.payload]
        state.publisherShowMore = action.payload.length >= 6
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.currentPost && state.currentPost._id === action.payload._id) {
          state.currentPost = action.payload
        }
      })
      // Categories — deduplicated via condition check in thunk
      .addCase(fetchCategories.pending, (state) => { state.categoriesLoading = true })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => { state.categoriesLoading = false })
  },
})

export const { clearSearchPosts, clearCurrentPost, clearPublisherPosts } = postsSlice.actions
export default postsSlice.reducer
