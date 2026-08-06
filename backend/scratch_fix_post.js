import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Post from "./models/post.model.js";

dotenv.config({ path: "./.env" });

async function fixPost() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the user @harsh raj
    const harshUser = await User.findOne({ username: { $regex: /harsh/i } }) || await User.findOne({ email: { $regex: /harsh/i } });
    
    if (!harshUser) {
      console.log("Could not find @harsh raj in the DB. Did you sign up again?");
      const allUsers = await User.find({}, { email: 1, username: 1 });
      console.log("All users in DB:", allUsers);
      process.exit(1);
    }
    
    console.log("Found user:", harshUser.email, harshUser.username, harshUser._id);
    
    // Find the dummy post
    const dummyPost = await Post.findOne({ slug: { $regex: /ai-reshaping-modern-news/i } });
    
    if (!dummyPost) {
      console.log("Could not find the dummy post.");
      process.exit(1);
    }
    
    // Update the post's userId
    dummyPost.userId = harshUser._id;
    await dummyPost.save();
    
    console.log("Successfully updated post's userId to belong to", harshUser.username);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixPost();
