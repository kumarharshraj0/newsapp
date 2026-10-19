import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "@/redux/posts/postsSlice"
import { t } from "@/lib/translations"
import { useSettings } from "@/contexts/SettingsContext"
import HeaderTop from "./HeaderTop"
import NavBar from "./NavBar"

// Lazy load non-critical UI to dramatically speed up FCP on mobile
import BreakingTicker from "./BreakingTicker"
const MobileMenu = React.lazy(() => import("./MobileMenu"))

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.posts)
  const { selectedLanguage } = useSelector((state) => state.language)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { settings } = useSettings()
  const trendingTags = settings?.trendingTags || []

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const term = new URLSearchParams(location.search).get("searchTerm")
    if (term) setSearchTerm(term)
  }, [location.search])

  useEffect(() => {
    const close = () => setOpenDropdown(null)
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

  const handleCategoryClick = (e, cat) => {
    if (cat.subcategories?.length > 0) {
      e.preventDefault(); e.stopPropagation()
      setOpenDropdown(openDropdown === cat.slug ? null : cat.slug)
    } else {
      navigate(`/news/${cat.slug}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(location.search)
    params.set("searchTerm", searchTerm)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <header className="w-full flex flex-col font-sans">
      {/* 1. Breaking Top Bar - Exact height h-9 (36px) reserved */}
      <div className="h-9 w-full bg-[#E1261C] shrink-0 overflow-hidden">
        <BreakingTicker />
      </div>

      {/* 2. Main Logo & Search Bar - Reserved min-height */}
      <div className="min-h-[80px] w-full bg-white border-b border-gray-200 shrink-0">
        <HeaderTop searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSubmit={handleSubmit} />
      </div>

      {/* 3. Categories Navbar - Reserved height h-12 (48px) */}
      <div className="h-12 w-full bg-[#0A2240] shrink-0">
        <NavBar categories={categories} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
          handleCategoryClick={handleCategoryClick} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} selectedLanguage={selectedLanguage} />
      </div>

      {isMobileMenuOpen && (
        <React.Suspense fallback={null}>
          <MobileMenu categories={categories} openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown} setIsMobileMenuOpen={setIsMobileMenuOpen} selectedLanguage={selectedLanguage} />
        </React.Suspense>
      )}

      {/* 4. Trending Tags Bar - Reserved height h-10 (40px) */}
      <div className="h-10 w-full bg-white border-b border-gray-200 shadow-sm text-xs select-none shrink-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center gap-4 md:gap-3 overflow-x-auto scrollbar-hide">
          <span className="font-extrabold text-[#E1261C] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {t("Trending:", selectedLanguage)}
          </span>
          <div className="flex items-center gap-5 md:gap-4 text-gray-600 font-bold shrink-0">
            {trendingTags && trendingTags.length > 0 ? (
              trendingTags.map((tag) => (
                <Link key={tag} to={`/search?searchTerm=${tag.toLowerCase()}`} className="hover:text-[#E1261C] transition-colors">
                  #{tag}
                </Link>
              ))
            ) : (
              <div className="flex items-center gap-3 py-1">
                <span className="w-16 h-2.5 bg-gray-200 rounded animate-pulse inline-block" />
                <span className="w-20 h-2.5 bg-gray-200 rounded animate-pulse inline-block" />
                <span className="w-14 h-2.5 bg-gray-200 rounded animate-pulse inline-block" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
