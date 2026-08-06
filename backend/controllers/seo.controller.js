import SEO from "../models/seo.model.js"

export const getSEO = async (req, res, next) => {
  try {
    const seoData = await SEO.find().lean()
    res.status(200).json(seoData)
  } catch (error) {
    next(error)
  }
}

export const getSEOByPage = async (req, res, next) => {
  try {
    const { pageIdentifier } = req.params
    const seoData = await SEO.findOne({ pageIdentifier }).lean()
    res.status(200).json(seoData || {})
  } catch (error) {
    next(error)
  }
}

export const updateSEO = async (req, res, next) => {
  try {
    const { pageIdentifier } = req.body
    
    let seoData = await SEO.findOne({ pageIdentifier })
    
    if (seoData) {
      seoData = await SEO.findOneAndUpdate(
        { pageIdentifier },
        { $set: req.body },
        { new: true }
      )
    } else {
      const newSEO = new SEO(req.body)
      seoData = await newSEO.save()
    }
    
    res.status(200).json(seoData)
  } catch (error) {
    next(error)
  }
}
