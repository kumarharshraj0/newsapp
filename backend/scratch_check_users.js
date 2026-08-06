import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config({ path: "./.env" });

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { email: 1, username: 1 });
    console.log("All users in DB:");
    users.forEach(u => console.log(u.email, u.username));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkUsers();
