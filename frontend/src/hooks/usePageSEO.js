import { useEffect } from "react"
import axios from "axios"

/**
 * Fetches SEO settings for a given pageIdentifier from the backend
 * and applies them to the document <head>.
 * Falls back to provided defaults if no backend data exists.
 *
 * @param {string} pageIdentifier - e.g. 'home', 'about', 'search'
 * @param {object} fallback - { title, description, keywords, canonicalUrl }
 */
export default function usePageSEO(pageIdentifier, fallback = {}) {
  useEffect(() => {
    const applyMeta = (name, content) => {
      if (!content) return
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute("name", name)
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
      // Remove any existing injected schema
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

    const fetchAndApply = async () => {
      try {
        const res = await axios.get(`/api/seo/get/${pageIdentifier}`, { validateStatus: () => true })
        const data = res.status === 200 ? res.data : {}

        document.title = data.metaTitle ? data.metaTitle.replace("News18 India", "Insight Daily") : (fallback.title || "Insight Daily: Latest News, Breaking News")
        applyMeta("description", data.metaDescription || fallback.description || "")
        applyMeta("keywords", data.keywords || fallback.keywords || "")
        applyCanonical(data.canonicalUrl || fallback.canonicalUrl || "")
        applySchema(data.schemaScript || "")
      } catch (err) {
        // Silently fall back to defaults
        document.title = fallback.title || "Insight Daily: Latest News, Breaking News"
        applyMeta("description", fallback.description || "")
        applyMeta("keywords", fallback.keywords || "")
        applyCanonical(fallback.canonicalUrl || "")
      }
    }

    fetchAndApply()
  }, [pageIdentifier])
}
