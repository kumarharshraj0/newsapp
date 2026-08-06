import { useEffect } from "react"

export default function useSEO({ title, description, keywords, ogImage, ogType }) {
  useEffect(() => {
    // 1. Title Tag
    if (title) {
      document.title = `${title} | News18 India`
    } else {
      document.title = "News18 India: Latest News, Breaking News, News in India"
    }

    // Helper to set or create meta tag
    const setMetaTag = (name, property, content) => {
      if (content === undefined || content === null) return
      let el
      if (name) {
        el = document.querySelector(`meta[name="${name}"]`)
      } else if (property) {
        el = document.querySelector(`meta[property="${property}"]`)
      }

      if (!el) {
        el = document.createElement("meta")
        if (name) el.setAttribute("name", name)
        if (property) el.setAttribute("property", property)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    // 2. Meta Description
    setMetaTag("description", null, description || "News18 India Clone - Get the latest news, breaking news updates, and top stories on politics, sports, entertainment, business, and world news.")

    // 3. Keywords
    setMetaTag("keywords", null, keywords || "news, breaking news, news18 india, india news, world news, sports news, local news")

    // 4. Open Graph Tags
    setMetaTag(null, "og:title", title ? `${title} | News18 India` : "News18 India: Latest News, Breaking News, News in India")
    setMetaTag(null, "og:description", description || "News18 India Clone - Get the latest news, breaking news updates, and top stories.")
    setMetaTag(null, "og:image", ogImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80")
    setMetaTag(null, "og:type", ogType || "website")
    setMetaTag(null, "og:url", window.location.href)

    // 5. Twitter Card Tags
    setMetaTag("twitter:card", null, "summary_large_image")
    setMetaTag("twitter:title", null, title ? `${title} | News18 India` : "News18 India: Latest News, Breaking News, News in India")
    setMetaTag("twitter:description", null, description || "News18 India Clone - Get the latest news, breaking news updates, and top stories.")
    setMetaTag("twitter:image", null, ogImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80")

  }, [title, description, keywords, ogImage, ogType])
}
