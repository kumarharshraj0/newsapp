import React from "react"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { getCategoryUrl } from "@/lib/utils"
import { Translate } from "@/hooks/useTranslation"

const MobileMenu = ({ categories, openDropdown, setOpenDropdown, setIsMobileMenuOpen, selectedLanguage }) => (
  <div className="fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
    <div onClick={(e) => e.stopPropagation()} className="bg-[#0A2240] w-64 h-full shadow-2xl flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#091f3a]">
        <span className="text-white font-black text-sm tracking-widest uppercase"><Translate text="Categories Menu" language={selectedLanguage} /></span>
        <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-1 hover:bg-[#E1261C] rounded transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>
      <ul className="flex flex-col py-2">
        <li>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-white font-bold uppercase text-xs tracking-wider border-b border-white/5 hover:bg-[#E1261C]"><Translate text="Home" language={selectedLanguage} /></Link>
        </li>
        {categories.map((cat) => (
          <li key={cat._id} className="border-b border-white/5">
            <div className="flex justify-between items-center px-4 py-2">
              <Link to={getCategoryUrl(cat.slug)} onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold uppercase text-xs tracking-wider hover:text-[#E1261C]">{selectedLanguage === "hindi" && cat.nameHi ? cat.nameHi : <Translate text={cat.name} language={selectedLanguage} />}</Link>
              {cat.subcategories?.length > 0 && (
                <button onClick={() => setOpenDropdown(openDropdown === cat.slug ? null : cat.slug)} className="text-white p-2 hover:bg-white/5 rounded transition-colors">
                  <span className={`inline-block text-[10px] transition-transform duration-200 ${openDropdown === cat.slug ? "rotate-180" : ""}`}>▼</span>
                </button>
              )}
            </div>
            {cat.subcategories?.length > 0 && openDropdown === cat.slug && (
              <ul className="bg-black/20 py-2 pl-6 flex flex-col gap-2">
                <li><Link to={getCategoryUrl(cat.slug)} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 text-[10px] font-bold uppercase hover:text-white"><Translate text={"All " + cat.name} language={selectedLanguage} /></Link></li>
                {cat.subcategories.map((sub, i) => (
                  <li key={i}><Link to={getCategoryUrl(cat.slug, sub.slug)} onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-300 text-[10px] font-bold uppercase hover:text-white">{selectedLanguage === "hindi" && sub.nameHi ? sub.nameHi : <Translate text={sub.name} language={selectedLanguage} />}</Link></li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default MobileMenu
