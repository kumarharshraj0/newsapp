import mongoose from "mongoose"

const seoSchema = new mongoose.Schema(
  {
    pageIdentifier: {
      type: String,
      required: true,
      unique: true, // e.g., 'home', 'about', 'search'
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
  },
  { timestamps: true }
)

const SEO = mongoose.model("SEO", seoSchema)

export default SEO
