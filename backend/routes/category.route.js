import express from "express"
import {
  createCategory,
  getCategories,
  addSubcategory,
  deleteCategory,
} from "../controllers/category.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create", verifyToken, createCategory)
router.get("/getcategories", getCategories)
router.post("/add-subcategory/:categoryId", verifyToken, addSubcategory)
router.delete("/delete/:categoryId", verifyToken, deleteCategory)

export default router
