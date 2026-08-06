import Category from "../models/category.model.js"
import { errorHandler } from "../utils/error.js"
import NodeCache from "node-cache"

// Cache categories for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 })

export const createCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create categories!"))
  }

  const { name, nameHi } = req.body
  if (!name || name.trim() === "") {
    return next(errorHandler(400, "Category name is required!"))
  }

  const slug = name
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")

  try {
    const existing = await Category.findOne({ slug })
    if (existing) {
      return next(errorHandler(400, "Category already exists!"))
    }

    const newCategory = new Category({
      name,
      nameHi: nameHi || "",
      slug,
      subcategories: [],
    })

    const savedCategory = await newCategory.save()
    
    // Clear cache when new category is created
    cache.del("all_categories")

    return res.status(201).json(savedCategory)
  } catch (error) {
    return next(error)
  }
}

export const getCategories = async (req, res, next) => {
  try {
    const cacheKey = "all_categories"
    if (cache.has(cacheKey)) {
      return res.status(200).json(cache.get(cacheKey))
    }

    const categories = await Category.find().sort({ createdAt: -1 }).lean()
    
    cache.set(cacheKey, categories)
    return res.status(200).json(categories)
  } catch (error) {
    return next(error)
  }
}

export const addSubcategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to manage categories!"))
  }

  const { categoryId } = req.params
  const { name, nameHi } = req.body

  if (!name || name.trim() === "") {
    return next(errorHandler(400, "Subcategory name is required!"))
  }

  const slug = name
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")

  try {
    const category = await Category.findById(categoryId)
    if (!category) {
      return next(errorHandler(404, "Category not found!"))
    }

    // Check if subcategory already exists under this category
    const subExists = category.subcategories.some(sub => sub.slug === slug)
    if (subExists) {
      return next(errorHandler(400, "Subcategory already exists under this category!"))
    }

    category.subcategories.push({ name, nameHi: nameHi || "", slug })
    const updatedCategory = await category.save()

    // Clear cache when subcategory is added
    cache.del("all_categories")

    return res.status(200).json(updatedCategory)
  } catch (error) {
    return next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to delete categories!"))
  }

  const { categoryId } = req.params

  try {
    const category = await Category.findByIdAndDelete(categoryId)
    if (!category) {
      return next(errorHandler(404, "Category not found!"))
    }

    // Clear cache when category is deleted
    cache.del("all_categories")

    return res.status(200).json("Category deleted successfully.")
  } catch (error) {
    return next(error)
  }
}
