import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "@/redux/user/userSlice"
import axios from "axios"
import BreakingTicker from "./BreakingTicker"
import HeaderTop from "./HeaderTop"
import NavBar from "./NavBar"
import MobileMenu from "./MobileMenu"
import TrendingTags from "./TrendingTags"

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) setCategories(res.data)
      } catch (error) {
        console.error("Failed to fetch navbar categories: ", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const term = urlParams.get("searchTerm")
    if (term) setSearchTerm(term)
  }, [location.search])

  const handleCategoryClick = (e, cat) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      e.preventDefault()
      e.stopPropagation()
      setOpenDropdown(openDropdown === cat.slug ? null : cat.slug)
    }
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" })
      if (!res.ok) console.log("Signout failed")
      else dispatch(signOutSuccess())
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("searchTerm", searchTerm)
    navigate(`/search?${urlParams.toString()}`)
  }

  return (
    <div className="w-full flex flex-col font-sans">
      <BreakingTicker />
      <HeaderTop 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSubmit={handleSubmit} 
        currentUser={currentUser} 
        handleSignout={handleSignout} 
      />
      <NavBar 
        categories={categories} 
        openDropdown={openDropdown} 
        setOpenDropdown={setOpenDropdown} 
        handleCategoryClick={handleCategoryClick} 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      {isMobileMenuOpen && (
        <MobileMenu 
          categories={categories} 
          openDropdown={openDropdown} 
          setOpenDropdown={setOpenDropdown} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />
      )}
      <TrendingTags />
    </div>
  )
}

export default Header
