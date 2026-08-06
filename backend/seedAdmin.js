import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import dotenv from "dotenv"
import User from "./models/user.model.js"

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news-portal"

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Database connected for seeding admin user.")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@news18.com" })
    if (existingAdmin) {
      console.log("Admin user with email admin@news18.com already exists.")
      
      let updated = false;
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true
        updated = true;
      }
      
      if (!existingAdmin.socialLinks || !existingAdmin.socialLinks.facebook?.url) {
        existingAdmin.socialLinks = {
          facebook: { url: "https://facebook.com/admin", visible: true },
          twitter: { url: "https://twitter.com/admin", visible: true },
          instagram: { url: "https://instagram.com/admin", visible: true },
          whatsapp: { url: "https://wa.me/1234567890", visible: true }
        }
        updated = true;
      }

      if (updated) {
        await existingAdmin.save()
        console.log("Existing admin updated with admin rights and social links.")
      }
      
      process.exit(0)
    }

    const hashedPassword = bcryptjs.hashSync("admin123", 10)
    const newAdmin = new User({
      username: "admin",
      email: "admin@news18.com",
      password: hashedPassword,
      isAdmin: true,
      profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      socialLinks: {
        facebook: { url: "https://facebook.com/admin", visible: true },
        twitter: { url: "https://twitter.com/admin", visible: true },
        instagram: { url: "https://instagram.com/admin", visible: true },
        whatsapp: { url: "https://wa.me/1234567890", visible: true }
      }
    })

    await newAdmin.save()
    console.log("Dummy admin user created successfully:")
    console.log("Email: admin@news18.com")
    console.log("Password: admin123")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  }
}

seedAdmin()
