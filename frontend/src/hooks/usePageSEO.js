import { useEffect } from "react"
import axios from "axios"

/**
 * Fetches SEO settings for a given pageIdentifier from the backend
 * and applies full document title, meta tags, Open Graph, Twitter Cards,
 * canonical links, and Schema.org JSON-LD to the document <head>.
 *
 * @param {string} pageIdentifier - e.g. 'home', 'about', 'search', 'category_sports'
 * @param {object} fallback - { title, description, keywords, canonicalUrl, ogImage, metaRobots, schemaScript }
 */
export default function usePageSEO(pageIdentifier, fallback = {}) {
  useEffect(() => {
    const applyMeta = (attr, key, content) => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    const applyCanonical = (url) => {
      if (!url) return
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) {
        el = document.createElement("link")
        el.setAttribute("rel", "canonical")
        document.head.appendChild(el)
      }
      el.setAttribute("href", url)
    }

    const applySchema = (schemaText) => {
      if (!schemaText) return
      const existing = document.querySelector('script[data-page-schema]')
      if (existing) existing.remove()
      try {
        JSON.parse(schemaText) // validate JSON
        const script = document.createElement("script")
        script.type = "application/ld+json"
        script.setAttribute("data-page-schema", "true")
        script.textContent = schemaText
        document.head.appendChild(script)
      } catch (e) {
        console.warn("Invalid schema JSON, skipping injection.")
      }
    }

    const syncMetadata = (data) => {
      const title = data.metaTitle || fallback.title || "Newpulse"
      const description = data.metaDescription || fallback.description || ""
      const keywords = data.keywords || fallback.keywords || ""
      const robots = data.metaRobots || fallback.metaRobots || "index, follow, max-image-preview:large"
      const canonical = data.canonicalUrl || fallback.canonicalUrl || (typeof window !== "undefined" ? window.location.href.split("?")[0] : "")
      const image = data.ogImage || fallback.ogImage || "https://newpulse.in/rectangular-logo.png"

      // 1. Standard HTML Meta
      document.title = title
      applyMeta("name", "robots", robots)
      applyMeta("name", "description", description)
      applyMeta("name", "keywords", keywords)
      applyCanonical(canonical)

      // 2. Open Graph Social Meta Tags
      applyMeta("property", "og:type", "website")
      applyMeta("property", "og:site_name", "Newpulse")
      applyMeta("property", "og:title", title)
      applyMeta("property", "og:description", description)
      applyMeta("property", "og:url", canonical)
      applyMeta("property", "og:image", image)
      applyMeta("property", "og:image:width", "1200")
      applyMeta("property", "og:image:height", "630")

      // 3. Twitter Card Tags
      applyMeta("name", "twitter:card", "summary_large_image")
      applyMeta("name", "twitter:title", title)
      applyMeta("name", "twitter:description", description)
      applyMeta("name", "twitter:url", canonical)
      applyMeta("name", "twitter:image", image)

      // 4. Schema Script
      applySchema(data.schemaScript || fallback.schemaScript || "")
    }

    const fetchAndApply = async () => {
      try {
        const res = await axios.get(`/api/seo/get/${pageIdentifier}`, { validateStatus: () => true })
        const data = res.status === 200 ? res.data : {}
        syncMetadata(data)
      } catch (err) {
        syncMetadata({})
      }
    }

    fetchAndApply()
  }, [pageIdentifier])
}
