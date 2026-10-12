import Page from "../models/page.model.js"
import { errorHandler } from "../utils/error.js"
import memoryCache, { invalidateCache } from "../utils/cache.js"

export const createPage = async (req, res, next) => {
  try {
    const rawSlug = req.body.slug && req.body.slug.trim() 
      ? req.body.slug.trim() 
      : req.body.title;
      
    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return next(errorHandler(400, "A page with this slug or title already exists. Please choose a unique slug."));
    }

    const newPage = new Page({
      ...req.body,
      slug,
    })
    const savedPage = await newPage.save()
    invalidateCache("page_")
    res.status(201).json(savedPage)
  } catch (error) {
    next(error)
  }
}

export const getPages = async (req, res, next) => {
  try {
    const cacheKey = "page_all_pages"
    if (memoryCache.has(cacheKey)) {
      return res.status(200).json(memoryCache.get(cacheKey))
    }

    const pages = await Page.find().lean()
    memoryCache.set(cacheKey, pages, 300) // 5 minutes cache
    res.status(200).json(pages)
  } catch (error) {
    next(error)
  }
}

export const getPage = async (req, res, next) => {
  try {
    const cacheKey = `page_single_${req.params.slug}`
    if (memoryCache.has(cacheKey)) {
      return res.status(200).json(memoryCache.get(cacheKey))
    }

    const page = await Page.findOne({ slug: req.params.slug }).lean()
    if (!page) {
      return next(errorHandler(404, "Page not found"))
    }
    memoryCache.set(cacheKey, page, 300) // 5 minutes cache
    res.status(200).json(page)
  } catch (error) {
    next(error)
  }
}

export const updatePage = async (req, res, next) => {
  try {
    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    invalidateCache("page_")
    res.status(200).json(updatedPage)
  } catch (error) {
    next(error)
  }
}

export const deletePage = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.id)
    invalidateCache("page_")
    res.status(200).json("Page has been deleted")
  } catch (error) {
    next(error)
  }
}

