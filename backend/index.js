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

// Optimize Express settings for High Throughput
app.set("etag", "strong") // HTTP 304 Not Modified caching support
app.disable("x-powered-by") // Security & tiny header byte reduction

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.ADMIN_URL ? [process.env.ADMIN_URL] : []),
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app") || origin.endsWith("newpulse.in")) {
      return callback(null, true)
    }
    return callback(null, true) // Permissive for production deployment
  },
  credentials: true,
}))

// Trust proxy for AWS EC2 / Elastic Beanstalk / Reverse Proxy (Nginx / ALB)
app.set("trust proxy", 1)

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}))

// Compress Responses (Gzip/Brotli)
app.use(compression())

// Rate Limiting (1500 requests per 15 minutes per IP for high traffic news portal)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." }
})
app.use("/api/", limiter)

// for allowing large base64 image uploads without 413 Payload Too Large error
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
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

// Serve dynamic sitemaps directly at root domain (https://newpulse.in/sitemap.xml & /news-sitemap.xml)
import { generateSitemap, generateNewsSitemap } from "./controllers/seo.controller.js"
app.get("/sitemap.xml", generateSitemap)
app.get("/news-sitemap.xml", generateNewsSitemap)

// --- Server-Side SEO Injection for Dynamic Routes (Production/Sharing) ---
const __dirname = path.resolve()
// Serve static admin build files
app.use("/admin", express.static(path.join(__dirname, "../admin/dist"), { index: false }))

// Serve static frontend build files
app.use(express.static(path.join(__dirname, "../frontend/dist"), { index: false }))

// Dynamic SEO Meta Injection for WhatsApp, Facebook, Twitter, and Google Discover
import { injectArticleMeta } from "./utils/seoInjector.js"

app.get("/post/:postSlug", injectArticleMeta)
app.get("/page/:slug", injectArticleMeta)
app.get("/news/:category/article/:postSlug", injectArticleMeta)
app.get("/news/:category/:subcategory/article/:postSlug", injectArticleMeta)

// Catch-all route to serve the Admin SPA
app.get("/admin/*", (req, res) => {
  const indexPath = path.join(__dirname, "../admin/dist/index.html")
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send("Admin build not found. Please run 'npm run build' in the admin directory.")
  }
})

// Catch-all route to serve the Frontend SPA (with SEO injection for direct slug URLs e.g. /:slug)
app.get("*", async (req, res, next) => {
  // If the path could be an article slug (not static files / root / common static paths)
  const pathname = req.path.replace(/^\/|\/$/g, "")
  if (pathname && !pathname.includes(".") && !pathname.startsWith("api") && !pathname.startsWith("admin")) {
    try {
      const postExists = await Post.exists({ slug: pathname })
      if (postExists) {
        req.params.slug = pathname
        return injectArticleMeta(req, res, next)
      }
    } catch (e) {
      // Continue to default SPA fallback
    }
  }

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
