import SEO from "../models/seo.model.js"
import Post from "../models/post.model.js"
import Category from "../models/category.model.js"
import Page from "../models/page.model.js"

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

export const generateSitemap = async (req, res, next) => {
  try {
    const baseUrl = "https://newpulse.in"

    // Fetch approved posts, categories, and dynamic pages in parallel
    const [posts, categories, pages] = await Promise.all([
      Post.find({ status: "approved" }).select("slug updatedAt createdAt").lean(),
      Category.find().select("slug subcategories updatedAt").lean(),
      Page.find().select("slug updatedAt").lean(),
    ])

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

    // 1. Core Static Pages
    const staticPages = [
      { loc: `${baseUrl}/`, priority: "1.0", changefreq: "hourly" },
      { loc: `${baseUrl}/search`, priority: "0.8", changefreq: "daily" },
      { loc: `${baseUrl}/about`, priority: "0.6", changefreq: "monthly" },
    ]

    staticPages.forEach((p) => {
      xml += `  <url>\n    <loc>${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`
    })

    // 2. Categories & Subcategories
    categories.forEach((cat) => {
      xml += `  <url>\n    <loc>${baseUrl}/news/${cat.slug}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`
      if (cat.subcategories && Array.isArray(cat.subcategories)) {
        cat.subcategories.forEach((sub) => {
          xml += `  <url>\n    <loc>${baseUrl}/news/${cat.slug}/${sub.slug}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`
        })
      }
    })

    // 3. Dynamic Policy & Info Pages
    pages.forEach((page) => {
      const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : new Date().toISOString()
      xml += `  <url>\n    <loc>${baseUrl}/page/${page.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`
    })

    // 4. All News Articles
    posts.forEach((post) => {
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : (post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString())
      xml += `  <url>\n    <loc>${baseUrl}/post/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`
    })

    xml += `</urlset>`

    res.header("Content-Type", "application/xml")
    res.status(200).send(xml)
  } catch (error) {
    next(error)
  }
}

export const generateNewsSitemap = async (req, res, next) => {
  try {
    const baseUrl = "https://newpulse.in"
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)

    // Fetch approved posts from last 48 hours, or fallback to the latest 50 posts
    let posts = await Post.find({
      status: "approved",
      createdAt: { $gte: twoDaysAgo }
    }).select("title slug language createdAt updatedAt").sort({ createdAt: -1 }).lean()

    if (!posts || posts.length === 0) {
      posts = await Post.find({ status: "approved" })
        .select("title slug language createdAt updatedAt")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean()
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`

    posts.forEach((post) => {
      const pubDate = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString()
      const title = (post.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
      const lang = post.language === "hindi" ? "hi" : "en"

      xml += `  <url>\n`
      xml += `    <loc>${baseUrl}/post/${post.slug}</loc>\n`
      xml += `    <news:news>\n`
      xml += `      <news:publication>\n`
      xml += `        <news:name>Newpulse</news:name>\n`
      xml += `        <news:language>${lang}</news:language>\n`
      xml += `      </news:publication>\n`
      xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`
      xml += `      <news:title>${title}</news:title>\n`
      xml += `    </news:news>\n`
      xml += `  </url>\n`
    })

    xml += `</urlset>`

    res.header("Content-Type", "application/xml")
    res.status(200).send(xml)
  } catch (error) {
    next(error)
  }
}


