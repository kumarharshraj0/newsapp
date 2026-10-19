import React from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { getCategoryUrl } from "@/lib/utils"

const NavBar = ({
  categories,
  openDropdown,
  setOpenDropdown,
  handleCategoryClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  return (
    <nav className="bg-[#0A2240] border-b-4 border-[#E1261C] shadow-md w-full sticky top-0 z-40 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 flex justify-between lg:justify-start items-center py-1">
        {/* Hamburger button for mobile/tablet */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:bg-[#E1261C] transition-colors rounded flex items-center gap-1 font-black text-xs uppercase tracking-wider"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>Menu</span>
        </button>

        {/* Desktop Categories List */}
        <ul className="hidden lg:flex items-center gap-1 font-bold text-white text-xs uppercase tracking-wider whitespace-nowrap">
          <li>
            <Link to="/" className="inline-block px-4 py-3 hover:bg-[#E1261C] transition-colors rounded">
              Home
            </Link>
          </li>

          {/* Dynamic Categories Dropdown Menu items */}
          {categories.map((cat) => (
            <li key={cat._id} className="relative select-none">
              <button
                onClick={(e) => handleCategoryClick(e, cat)}
                className="inline-block px-4 py-3 hover:bg-[#E1261C] transition-colors rounded flex items-center gap-1 text-white font-bold text-xs uppercase tracking-wider"
              >
                {cat.name}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <span className={`text-[8px] transition-transform duration-200 ${openDropdown === cat.slug ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                )}
              </button>

              {/* Subcategory dropdown menu on click */}
              {cat.subcategories && cat.subcategories.length > 0 && openDropdown === cat.slug && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 min-w-[220px] p-2 overflow-hidden animate-in fade-in slide-in-from-top-2"
                >
                  <ul className="flex flex-col text-left font-sans space-y-1">
                    <li>
                      <Link
                        to={getCategoryUrl(cat.slug)}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 hover:bg-red-50 text-[#0A2240] hover:text-[#E1261C] text-[11px] font-black uppercase rounded-lg transition-all duration-200"
                      >
                        All {cat.name}
                      </Link>
                    </li>
                    {cat.subcategories.map((sub, i) => (
                      <li key={i}>
                        <Link
                          to={getCategoryUrl(cat.slug, sub.slug)}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2 hover:bg-slate-50 text-slate-600 hover:text-[#E1261C] text-[11px] font-bold uppercase rounded-lg transition-all duration-200"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
