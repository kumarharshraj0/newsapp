import express from "express"
import {
  createPage,
  deletePage,
  getPage,
  getPages,
  updatePage,
} from "../controllers/page.controller.js"
import { verifyToken, isAdmin } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create", verifyToken, isAdmin, createPage)
router.get("/getPages", getPages)
router.get("/getPage/:slug", getPage)
router.put("/update/:id", verifyToken, isAdmin, updatePage)
router.delete("/delete/:id", verifyToken, isAdmin, deletePage)

export default router
