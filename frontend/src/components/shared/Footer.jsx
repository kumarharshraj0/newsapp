import React from "react"
import { Link } from "react-router-dom"
import { getCategoryUrl } from "@/lib/utils"

import axios from "axios";
const Footer = () => {
  const [categories, setCategories] = React.useState([])
  const [pages, setPages] = React.useState([])
  const [settings, setSettings] = React.useState({})

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) {
          setCategories(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch footer categories: ", error)
      }
    }
    const fetchPages = async () => {
      try {
        const res = await axios.get("/api/page/getPages")
        if (res.status === 200) {
          setPages(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch pages", error)
      }
    }
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/settings/all")
        if (res.data.success && res.data.settings) {
          const settingsMap = {};
          res.data.settings.forEach(s => {
            settingsMap[s.key] = s.value;
          });
          setSettings(settingsMap);
        }
      } catch (err) {
        console.log("Failed to fetch settings: ", err)
      }
    }
    fetchCategories()
    fetchPages()
    fetchSettings()
  }, [])

  return (
    <footer className="bg-[#0A2240] text-white border-t-4 border-[#E1261C] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-3 md:col-span-2">
          <div className="flex items-center font-extrabold tracking-tighter text-2xl select-none mb-2">
              <div className="flex items-center">
                <img src="/logo-light.svg" alt="Insight Daily Logo" className="h-12 md:h-14 object-contain" />
              </div>
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
            {settings.about_text || "Insight Daily is committed to delivering the most reliable, accurate, and prompt news reporting from across the country and the globe. Stay informed, stay ahead."}
          </p>
        </div>

        {/* Quick links to categories */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat._id}>
                <Link to={getCategoryUrl(cat.slug)} className="hover:text-[#E1261C] transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links to pages */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300">
            {pages.map((page) => (
              <li key={page._id}>
                <Link to={`/page/${page.slug}`} className="hover:text-[#E1261C] transition-colors">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Contact Us
          </h4>
          <p className="text-gray-300 text-xs md:text-sm mb-1">
            {settings.contact_address || "Express Towers, Nariman Point, Mumbai, India"}
          </p>
          <p className="text-gray-300 text-xs md:text-sm mb-1">
            Email: {settings.contact_email || "contact@insightdaily.com"}
          </p>
          <p className="text-gray-300 text-xs md:text-sm">
            Phone: {settings.contact_phone || "+91 22 4001 9000"}
          </p>
        </div>

      </div>

      {/* Social Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          <a href={settings.social_facebook || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Facebook
          </a>
          <a href={settings.social_twitter || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Twitter
          </a>
          <a href={settings.social_linkedin || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            LinkedIn
          </a>
          <a href={settings.social_instagram || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Instagram
          </a>
        </div>

        <p className="mt-2">
          &copy; {new Date().getFullYear()} Insight Daily. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
