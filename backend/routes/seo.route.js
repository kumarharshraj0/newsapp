import express from "express"
import { verifyToken, isAdmin } from "../utils/verifyUser.js"
import { getSEO, getSEOByPage, updateSEO, generateSitemap, generateNewsSitemap, generateRssFeed } from "../controllers/seo.controller.js"

const router = express.Router()

router.get("/get", getSEO)
router.get("/get/:pageIdentifier", getSEOByPage)
router.post("/update", verifyToken, isAdmin, updateSEO)
router.get("/sitemap.xml", generateSitemap)
router.get("/news-sitemap.xml", generateNewsSitemap)
router.get("/sitemap-news.xml", generateNewsSitemap)
router.get("/rss.xml", generateRssFeed)
router.get("/feed", generateRssFeed)

export default router
