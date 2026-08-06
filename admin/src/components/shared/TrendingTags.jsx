import React from "react"
import { Link } from "react-router-dom"
import { TrendingUp } from "lucide-react"

const TrendingTags = () => {
  return (
    <div className="bg-white border-b border-gray-200 py-1.5 shadow-sm text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="font-extrabold text-[#E1261C] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Trending:
        </span>
        <div className="flex items-center gap-3 text-gray-600 font-bold shrink-0">
          <Link to="/search?searchTerm=cricket" className="hover:text-[#E1261C] transition-colors">#Cricket</Link>
          <Link to="/search?searchTerm=election" className="hover:text-[#E1261C] transition-colors">#Election2026</Link>
          <Link to="/search?searchTerm=tech" className="hover:text-[#E1261C] transition-colors">#TechSummit</Link>
          <Link to="/search?searchTerm=metro" className="hover:text-[#E1261C] transition-colors">#MetroUpdate</Link>
          <Link to="/search?searchTerm=climate" className="hover:text-[#E1261C] transition-colors">#ClimateChange</Link>
        </div>
      </div>
    </div>
  )
}

export default TrendingTags
