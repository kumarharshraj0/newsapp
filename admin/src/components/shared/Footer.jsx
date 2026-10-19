import React from "react"
import { Link } from "react-router-dom"
import { getCategoryUrl } from "@/lib/utils"

import axios from "axios";
const Footer = () => {
  const [categories, setCategories] = React.useState([])
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
    fetchCategories()
  }, [])

  return (
    <footer className="bg-[#0A2240] text-white border-t-4 border-[#E1261C] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Information */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center select-none mb-2">
            <img src="/logo-light.svg" alt="New Pulse Logo" className="h-10 md:h-12 object-contain" />
          </div>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
            New Pulse Editorial & Admin Dashboard. Manage breaking news, live coverage, categories, and editorial staff.
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
            Email: contact@newpulse.in
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
          &copy; {new Date().getFullYear()} Newpulse. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
