import Page from "../models/page.model.js"
import { errorHandler } from "../utils/error.js"

export const createPage = async (req, res, next) => {
  try {
    const newPage = new Page({
      ...req.body,
      slug: req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, ""),
    })
    const savedPage = await newPage.save()
    res.status(201).json(savedPage)
  } catch (error) {
    next(error)
  }
}

export const getPages = async (req, res, next) => {
  try {
    const pages = await Page.find().lean() // using .lean() for performance
    res.status(200).json(pages)
  } catch (error) {
    next(error)
  }
}

export const getPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug }).lean()
    if (!page) {
      return next(errorHandler(404, "Page not found"))
    }
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
    res.status(200).json(updatedPage)
  } catch (error) {
    next(error)
  }
}

export const deletePage = async (req, res, next) => {
  try {
    await Page.findByIdAndDelete(req.params.id)
    res.status(200).json("Page has been deleted")
  } catch (error) {
    next(error)
  }
}
