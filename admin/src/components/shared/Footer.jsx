import React from "react"
import { Link } from "react-router-dom"
import { getCategoryUrl } from "@/lib/utils"

import axios from "axios";
const Footer = () => {
  const [categories, setCategories] = React.useState([])
  const [logo, setLogo] = React.useState(null)

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch footer categories: ", error)
      }
    }
    const fetchLogo = async () => {
      try {
        const res = await axios.get("/api/settings/logo")
        if (res.data.success && res.data.setting) {
          setLogo(res.data.setting.value)
        }
      } catch (err) {
        console.log("Failed to fetch logo: ", err)
      }
    }
    fetchCategories()
    fetchLogo()
  }, [])

  return (
    <footer className="bg-[#0A2240] text-white border-t-4 border-[#E1261C] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center font-extrabold tracking-tighter text-2xl select-none mb-2">
            {logo ? (
              <img src={logo} alt="Site Logo" className="h-10 object-contain" />
            ) : (
              <>
                <span className="bg-[#E1261C] text-white px-2.5 py-0.5 rounded-l text-xl font-black">NEWS</span>
                <span className="bg-white text-[#0A2240] px-2.5 py-0.5 rounded-r border-l border-gray-200 text-xl font-black">18</span>
                <span className="text-white ml-2 font-black italic text-xl tracking-tight">INDIA</span>
              </>
            )}
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            News18 India is committed to delivering the most reliable, accurate, and prompt news reporting from across the country and the globe. Stay informed, stay ahead.
          </p>
        </div>

        {/* Quick links to categories */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            News Categories
          </h4>
          <ul className="space-y-2 text-xs md:text-sm text-gray-300">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link to={getCategoryUrl(cat.slug)} className="hover:text-[#E1261C] transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/about" className="hover:text-[#E1261C] transition-colors">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-black uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Contact Us
          </h4>
          <p className="text-gray-300 text-xs md:text-sm mb-1">
            Express Towers, Nariman Point, Mumbai, India
          </p>
          <p className="text-gray-300 text-xs md:text-sm mb-1">
            Email: contact@news18india.com
          </p>
          <p className="text-gray-300 text-xs md:text-sm">
            Phone: +91 22 4001 9000
          </p>
        </div>

      </div>

      {/* Social Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Facebook
          </a>
          <a href="#" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Twitter
          </a>
          <a href="#" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            LinkedIn
          </a>
          <a href="#" className="hover:text-[#E1261C] transition-colors font-bold uppercase tracking-wider">
            Instagram
          </a>
        </div>

        <p className="mt-2">
          &copy; {new Date().getFullYear()} News18 India. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
