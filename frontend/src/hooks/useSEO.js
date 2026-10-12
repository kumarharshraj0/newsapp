import { useEffect } from "react"

export default function useSEO({ title, description, keywords, ogImage, ogType, schemaScript }) {
  useEffect(() => {
    // 1. Title Tag
    if (title) {
      document.title = `${title.replace(/News18 India|Insight Daily/g, "News Pulse")} | News Pulse`
    } else {
      document.title = "News Pulse: Latest News, Breaking News, Global News"
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
    setMetaTag("description", null, description || "News Pulse - Get the latest news, breaking news updates, and top stories on politics, sports, entertainment, business, and world news.")

    // 3. Keywords
    setMetaTag("keywords", null, keywords || "news, breaking news, news pulse, world news, sports news, business news, tech news")

    // 4. Open Graph Tags
    const finalImage = ogImage || "https://newpulse.in/logo.png"
    setMetaTag(null, "og:title", title ? `${title} | News Pulse` : "News Pulse: Latest News, Breaking News, Live Updates")
    setMetaTag(null, "og:description", description || "News Pulse - Get the latest news, breaking news updates, and top stories.")
    setMetaTag(null, "og:image", finalImage)
    setMetaTag(null, "og:image:secure_url", finalImage)
    setMetaTag(null, "og:type", ogType || "website")
    setMetaTag(null, "og:url", window.location.href)

    // 5. Twitter Card Tags
    setMetaTag("twitter:card", null, "summary_large_image")
    setMetaTag("twitter:title", null, title ? `${title} | News Pulse` : "News Pulse: Latest News, Breaking News, Live Updates")
    setMetaTag("twitter:description", null, description || "News Pulse - Get the latest news, breaking news updates, and top stories.")
    setMetaTag("twitter:image", null, finalImage)

    // 6. LD-JSON Schema
    const existingSchema = document.querySelector('script[data-post-schema]')
    if (existingSchema) existingSchema.remove()

    if (schemaScript) {
      try {
        JSON.parse(schemaScript) // Validate JSON
        const script = document.createElement("script")
        script.type = "application/ld+json"
        script.setAttribute("data-post-schema", "true")
        script.textContent = schemaScript
        document.head.appendChild(script)
      } catch (e) {
        console.warn("Invalid schema JSON, skipping injection.")
      }
    }

  }, [title, description, keywords, ogImage, ogType, schemaScript])
}
