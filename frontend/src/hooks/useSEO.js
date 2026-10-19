import { useEffect } from "react"

export default function useSEO({ title, description, keywords, ogImage, ogType, schemaScript }) {
  useEffect(() => {
    // 1. Title Tag
    if (title) {
      document.title = `${title.replace(/News18 India|Insight Daily/g, "Newpulse")} | Newpulse`
    } else {
      document.title = "Newpulse: Latest News, Breaking News, Live Updates"
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
    setMetaTag("description", null, description || "Newpulse - Get the latest news, breaking news updates, and top stories on politics, sports, entertainment, business, and world news.")

    // 3. Keywords
    setMetaTag("keywords", null, keywords || "newpulse, news, breaking news, world news, sports news, business news, tech news")

    // 4. Open Graph Tags
    const finalImage = ogImage || "https://newpulse.in/logo.svg"
    setMetaTag(null, "og:title", title ? `${title} | Newpulse` : "Newpulse: Latest News, Breaking News, Live Updates")
    setMetaTag(null, "og:description", description || "Newpulse - Get the latest news, breaking news updates, and top stories.")
    setMetaTag(null, "og:image", finalImage)
    setMetaTag(null, "og:image:secure_url", finalImage)
    setMetaTag(null, "og:type", ogType || "website")
    setMetaTag(null, "og:url", window.location.href)

    // 5. Twitter Card Tags
    setMetaTag("twitter:card", null, "summary_large_image")
    setMetaTag("twitter:title", null, title ? `${title} | Newpulse` : "Newpulse: Latest News, Breaking News, Live Updates")
    setMetaTag("twitter:description", null, description || "Newpulse - Get the latest news, breaking news updates, and top stories.")
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
