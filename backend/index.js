import express from "express"
import mongoose from "mongoose"
import path from "path"
import fs from "fs"
import Post from "./models/post.model.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import compression from "compression"
import rateLimit from "express-rate-limit"
import cors from "cors"

dotenv.config()

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import uploadRoutes from "./routes/upload.route.js"
import categoryRoutes from "./routes/category.route.js"
import pageRoutes from "./routes/page.route.js"
import seoRoutes from "./routes/seo.route.js"
import settingRoutes from "./routes/setting.route.js"

mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: 50, // Industry standard connection pooling for 1 Lakh DAU
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Add production domains here
  credentials: true,
}))

// Security Headers
app.use(helmet())

// Compress Responses (Gzip/Brotli)
app.use(compression())

// Rate Limiting (1500 requests per 15 minutes per IP for high traffic news portal)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." }
})
app.use("/api/", limiter)

// for allowing json object in req body with custom limit for base64 uploads
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/page", pageRoutes)
app.use("/api/seo", seoRoutes)
app.use("/api/settings", settingRoutes)

// --- Server-Side SEO Injection for Dynamic Routes (Production/Sharing) ---
const __dirname = path.resolve()
// Serve static admin build files
app.use("/admin", express.static(path.join(__dirname, "../admin/dist"), { index: false }))

// Serve static frontend build files
app.use(express.static(path.join(__dirname, "../frontend/dist"), { index: false }))

// Intercept specific routes to dynamically inject OG tags before sending HTML
app.get("/post/:postSlug", async (req, res, next) => {
  try {
    const indexPath = path.join(__dirname, "../frontend/dist/index.html")
    if (!fs.existsSync(indexPath)) {
      // Fallback if frontend is not built yet (dev mode)
      return next()
    }

    let html = fs.readFileSync(indexPath, "utf-8")
    const post = await Post.findOne({ slug: req.params.postSlug })

    if (post) {
      const title = post.metaTitle || post.title
      const desc = post.metaDescription || (post.content ? post.content.replace(/<[^>]*>/g, "").substring(0, 155) : "")
      const image = post.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80"
      
      // Inject Post-Specific Meta Tags
      html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${title} | News18 India" />`)
      html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${desc}" />`)
      html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/>/i, `<meta property="og:image" content="${image}" />`)
      
      html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${title} | News18 India" />`)
      html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${desc}" />`)
      html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/i, `<meta name="twitter:image" content="${image}" />`)
      html = html.replace(/<title>.*?<\/title>/i, `<title>${title} | News18 India</title>`)
    }
    
    res.send(html)
  } catch (error) {
    next(error)
  }
})

// Catch-all route to serve the Admin SPA
app.get("/admin/*", (req, res) => {
  const indexPath = path.join(__dirname, "../admin/dist/index.html")
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send("Admin build not found. Please run 'npm run build' in the admin directory.")
  }
})

// Catch-all route to serve the Frontend SPA
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../frontend/dist/index.html")
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send("Frontend build not found. Please run 'npm run build' in the frontend directory.")
  }
})
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
// nodemon trigger
