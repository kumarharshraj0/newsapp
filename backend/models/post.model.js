import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    subcategory: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    imageAlt: {
      type: String,
      default: "",
    },
    imageCaption: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    keywords: {
      type: String,
      default: "",
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    metaRobots: {
      type: String,
      default: "index, follow, max-image-preview:large",
    },
    schemaScript: {
      type: String,
      default: "",
    },
    tags: [{
      type: String,
      trim: true,
    }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    language: {
      type: String,
      enum: ["english", "hindi"],
      default: "english",
    },
  },
  { timestamps: true }
)

// Industry-level MongoDB Indexes for fast queries
postSchema.index({ slug: 1 }, { unique: true })
postSchema.index({ category: 1, createdAt: -1 })
postSchema.index({ status: 1, createdAt: -1 })
postSchema.index({ language: 1, createdAt: -1 })
postSchema.index({ tags: 1 })
postSchema.index({ views: -1 })
postSchema.index({ createdAt: -1 })

const Post = mongoose.model("Post", postSchema)

export default Post
