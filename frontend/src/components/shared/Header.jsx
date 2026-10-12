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
const BreakingTicker = React.lazy(() => import("./BreakingTicker"))
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
    <div className="w-full flex flex-col font-sans">
      <React.Suspense fallback={<div className="h-8 bg-gray-100" />}>
        <BreakingTicker />
      </React.Suspense>
      <HeaderTop searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSubmit={handleSubmit} />
      <NavBar categories={categories} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}
        handleCategoryClick={handleCategoryClick} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} selectedLanguage={selectedLanguage} />
      {isMobileMenuOpen && (
        <React.Suspense fallback={null}>
          <MobileMenu categories={categories} openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown} setIsMobileMenuOpen={setIsMobileMenuOpen} selectedLanguage={selectedLanguage} />
        </React.Suspense>
      )}
      <div className="bg-white border-b border-gray-200 py-3 md:py-1.5 shadow-sm text-xs select-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 md:gap-3 overflow-x-auto scrollbar-hide">
          <span className="font-extrabold text-[#E1261C] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {t("Trending:", selectedLanguage)}
          </span>
          <div className="flex items-center gap-5 md:gap-4 text-gray-600 font-bold shrink-0">
            {trendingTags.map((tag) => (
              <Link key={tag} to={`/search?searchTerm=${tag.toLowerCase()}`} className="hover:text-[#E1261C] transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
