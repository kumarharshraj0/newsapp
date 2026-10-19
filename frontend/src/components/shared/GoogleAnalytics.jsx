import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Google Analytics Measurement ID (GA4)
// Aap ise frontend/.env me VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX ke roop me add kar sakte hain
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ""

const GoogleAnalytics = () => {
  const location = useLocation()

  // Initialize Google Analytics gtag.js script once (if not already handled by index.html)
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") return

    // If already set up in index.html, skip creating a duplicate script
    if (window.gtag || document.getElementById("google-analytics-script") || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      return
    }

    const script = document.createElement("script")
    script.id = "google-analytics-script"
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag("js", new Date())
    gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false, // SPA route change handle karega
    })
  }, [])

  // Track page views on route / URL changes (Full SPA support)
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX" || typeof window.gtag !== "function") return

    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname + location.search,
    })
  }, [location])

  return null
}

export default GoogleAnalytics
