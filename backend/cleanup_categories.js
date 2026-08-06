import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/category.model.js";
import Post from "./models/post.model.js";

dotenv.config({ path: "./.env" });

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Post.updateMany({ category: "worldnews" }, { category: "world" });
    await Post.updateMany({ category: "sportsnews" }, { category: "sports" });
    await Post.updateMany({ category: "localnews" }, { category: "world" });
    
    await Category.deleteMany({ slug: { $in: ["worldnews", "sportsnews", "localnews"] } });
    
    console.log("Cleaned up duplicate categories.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
cleanup();
