import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    nameHi: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    subcategories: [
      {
        name: {
          type: String,
          required: true,
        },
        nameHi: {
          type: String,
          default: "",
        },
        slug: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

const Category = mongoose.model("Category", categorySchema)

export default Category
