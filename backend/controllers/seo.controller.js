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

    // 1. Core Static Pages (excluding search pages per Google Search Essentials)
    const staticPages = [
      { loc: `${baseUrl}/`, priority: "1.0", changefreq: "hourly" },
      { loc: `${baseUrl}/about`, priority: "0.6", changefreq: "monthly" },
    ]

    staticPages.forEach((p) => {
      xml += `  <url>\n    <loc>${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`
    })

    // 2. Categories & Subcategories
    categories.forEach((cat) => {
      if (cat.slug) {
        xml += `  <url>\n    <loc>${baseUrl}/news/${encodeURI(cat.slug)}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`
        if (cat.subcategories && Array.isArray(cat.subcategories)) {
          cat.subcategories.forEach((sub) => {
            if (sub.slug) {
              xml += `  <url>\n    <loc>${baseUrl}/news/${encodeURI(cat.slug)}/${encodeURI(sub.slug)}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`
            }
          })
        }
      }
    })

    // 3. Dynamic Policy & Info Pages
    pages.forEach((page) => {
      if (page.slug) {
        const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : new Date().toISOString()
        xml += `  <url>\n    <loc>${baseUrl}/page/${encodeURI(page.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`
      }
    })

    // 4. All News Articles
    posts.forEach((post) => {
      if (post.slug) {
        const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : (post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString())
        xml += `  <url>\n    <loc>${baseUrl}/post/${encodeURI(post.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`
      }
    })

    xml += `</urlset>`

    res.header("Content-Type", "application/xml; charset=utf-8")
    res.status(200).send(xml)
  } catch (error) {
    next(error)
  }
}

// XML Escaping helper conforming to W3C XML 1.0 Spec
const escapeXml = (unsafe = "") => {
  if (!unsafe) return ""
  return String(unsafe)
    .replace(/&nbsp;/g, " ")
    .replace(/&bull;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&") // normalize first to prevent double-escaping
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
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
      if (post.slug) {
        const pubDate = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString()
        const title = escapeXml(post.title || "")
        const lang = post.language === "hindi" ? "hi" : "en"

        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/post/${encodeURI(post.slug)}</loc>\n`
        xml += `    <news:news>\n`
        xml += `      <news:publication>\n`
        xml += `        <news:name>Newpulse</news:name>\n`
        xml += `        <news:language>${lang}</news:language>\n`
        xml += `      </news:publication>\n`
        xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`
        xml += `      <news:title>${title}</news:title>\n`
        xml += `    </news:news>\n`
        xml += `  </url>\n`
      }
    })

    xml += `</urlset>`

    res.header("Content-Type", "application/xml; charset=utf-8")
    res.status(200).send(xml)
  } catch (error) {
    next(error)
  }
}

export const generateRssFeed = async (req, res, next) => {
  try {
    const baseUrl = "https://newpulse.in"
    const posts = await Post.find({ status: "approved" })
      .select("title slug content metaDescription image category createdAt updatedAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const buildDate = new Date().toUTCString()

    let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`
    rss += `<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">\n`
    rss += `  <channel>\n`
    rss += `    <title>Newpulse - Latest News, Breaking News &amp; Live Updates</title>\n`
    rss += `    <link>${baseUrl}</link>\n`
    rss += `    <description>Newpulse delivers real-time breaking news headlines, in-depth political coverage, cricket &amp; sports updates, business analysis, and world news.</description>\n`
    rss += `    <language>en-in</language>\n`
    rss += `    <lastBuildDate>${buildDate}</lastBuildDate>\n`
    rss += `    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>\n`
    rss += `    <image>\n`
    rss += `      <url>${baseUrl}/rectangular-logo.png</url>\n`
    rss += `      <title>Newpulse</title>\n`
    rss += `      <link>${baseUrl}</link>\n`
    rss += `    </image>\n`

    posts.forEach((post) => {
      if (post.slug) {
        const itemUrl = `${baseUrl}/post/${encodeURI(post.slug)}`
        const pubDate = post.createdAt ? new Date(post.createdAt).toUTCString() : buildDate
        const title = escapeXml(post.title || "")
        const rawDesc = post.metaDescription || (post.content ? post.content.replace(/<[^>]+>/g, " ").slice(0, 200) : "")
        const cleanDesc = escapeXml(rawDesc)
        const category = escapeXml(post.category || "News")

        rss += `    <item>\n`
        rss += `      <title>${title}</title>\n`
        rss += `      <link>${itemUrl}</link>\n`
        rss += `      <guid isPermaLink="true">${itemUrl}</guid>\n`
        rss += `      <pubDate>${pubDate}</pubDate>\n`
        rss += `      <description>${cleanDesc}</description>\n`
        rss += `      <category>${category}</category>\n`
        if (post.image) {
          const imageUrl = escapeXml(post.image)
          let mimeType = "image/jpeg"
          if (imageUrl.includes(".webp")) mimeType = "image/webp"
          else if (imageUrl.includes(".png")) mimeType = "image/png"
          rss += `      <enclosure url="${imageUrl}" type="${mimeType}" length="12345" />\n`
          rss += `      <media:content url="${imageUrl}" medium="image" />\n`
        }
        rss += `    </item>\n`
      }
    })

    rss += `  </channel>\n`
    rss += `</rss>`

    res.header("Content-Type", "application/xml; charset=utf-8")
    res.status(200).send(rss)
  } catch (error) {
    next(error)
  }
}



