import express from "express"
import { uploadImage } from "../controllers/upload.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

// Secure the route with token verification middleware
router.post("/image", verifyToken, uploadImage)

export default router
