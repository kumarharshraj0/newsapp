import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";

dotenv.config({ path: "./.env" });

async function addPost() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Try to find the specific user, or fallback to any regular user
    let user = await User.findOne({ email: { $regex: /harshsawarn2/i } });
    
    if (!user) {
      user = await User.findOne({ isAdmin: false });
    }
    
    if (!user) {
      user = await User.findOne(); // Absolute fallback
    }

    if (!user) {
      console.log("No users exist in the database at all!");
      process.exit(1);
    }

    const newPost = new Post({
      userId: user._id,
      title: "Exclusive: How AI is Reshaping Modern News Delivery",
      content: "<p>This is a featured sample article submitted by a regular publisher. The news industry is currently undergoing a massive transformation with the introduction of LLMs.</p>",
      category: "technology",
      slug: "ai-reshaping-modern-news-" + Date.now(),
      status: "pending", // Regular users have pending status
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    });

    await newPost.save();
    console.log("Post added successfully for user:", user.username);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

addPost();
