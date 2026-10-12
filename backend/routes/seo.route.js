import express from "express"
import { verifyToken, isAdmin } from "../utils/verifyUser.js"
import { getSEO, getSEOByPage, updateSEO, generateSitemap } from "../controllers/seo.controller.js"

const router = express.Router()

router.get("/get", getSEO)
router.get("/get/:pageIdentifier", getSEOByPage)
router.post("/update", verifyToken, isAdmin, updateSEO)
router.get("/sitemap.xml", generateSitemap)

export default router
