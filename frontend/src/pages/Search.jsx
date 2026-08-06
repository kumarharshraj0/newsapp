import React, { useEffect, useState, useCallback, useMemo, useTransition, useDeferredValue } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { fetchSearchPosts } from "@/redux/posts/postsSlice"
import usePageSEO from "@/hooks/usePageSEO"
import useSEO from "@/hooks/useSEO"
import SearchSidebar from "@/components/shared/SearchSidebar"
import SearchResults from "@/components/shared/SearchResults"

const Search = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { category: pathCategory, subcategory: pathSubcategory } = useParams()
  const { selectedLanguage } = useSelector((state) => state.language)
  const { searchPosts, searchTotal, searchLoading } = useSelector((state) => state.posts)

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [sidebarData, setSidebarData] = useState({ searchTerm: "", sort: "desc", category: "", subcategory: "" })

  // useTransition: mark navigation as non-urgent so current UI stays responsive
  const [isPending, startTransition] = useTransition()

  // useDeferredValue: defer expensive search filtering — UI stays snappy while typing
  const deferredSearchTerm = useDeferredValue(sidebarData.searchTerm)

  // Fetch categories once
  useEffect(() => {
    const controller = new AbortController()
    axios.get("/api/category/getcategories", {
      validateStatus: () => true,
      signal: controller.signal,
    })
      .then(res => { if (res.status < 300) setCategories(res.data) })
      .catch(err => { if (err.name !== "CanceledError") console.error(err) })
    return () => controller.abort()
  }, [])

  // Keep subcategories in sync
  useEffect(() => {
    if (sidebarData.category && categories.length > 0) {
      const cat = categories.find(c => c.slug === sidebarData.category)
      setSubcategories(cat?.subcategories || [])
    } else {
      setSubcategories([])
    }
  }, [sidebarData.category, categories])

  // Parse URL → dispatch Redux fetch
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const newData = {
      searchTerm: params.get("searchTerm") || "",
      sort: params.get("sort") || "desc",
      category: pathCategory || params.get("category") || "",
      subcategory: pathSubcategory || params.get("subcategory") || "",
    }
    setSidebarData(newData)
    const page = parseInt(params.get("page")) || 1
    dispatch(fetchSearchPosts({ ...newData, language: selectedLanguage, limit: 8, startIndex: (page - 1) * 8 }))
  }, [location.search, pathCategory, pathSubcategory, selectedLanguage, dispatch])

  // useCallback: stable reference so SearchSidebar doesn't re-render unnecessarily
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (deferredSearchTerm) params.set("searchTerm", deferredSearchTerm)
    params.set("sort", sidebarData.sort)
    params.set("page", "1")
    const base = sidebarData.category && sidebarData.category !== "all"
      ? `/news/${sidebarData.category}${sidebarData.subcategory && sidebarData.subcategory !== "all" ? `/${sidebarData.subcategory}` : ""}`
      : "/search"
    // startTransition: mark this navigation as non-urgent
    startTransition(() => {
      navigate(`${base}?${params.toString()}`)
    })
  }, [deferredSearchTerm, sidebarData, navigate, startTransition])

  // useCallback: stable page change handler
  const handlePageChange = useCallback((page) => {
    const params = new URLSearchParams(location.search)
    params.set("page", page)
    startTransition(() => {
      navigate(`${location.pathname}?${params.toString()}`)
    })
  }, [location.search, location.pathname, navigate, startTransition])

  // useMemo: parse currentPage only when URL changes
  const currentPage = useMemo(
    () => parseInt(new URLSearchParams(location.search).get("page")) || 1,
    [location.search]
  )

  const seoTitle = sidebarData.searchTerm
    ? `Search: "${sidebarData.searchTerm}"`
    : sidebarData.category ? sidebarData.category : "Explore News & Articles"

  const pageIdentifier = sidebarData.category && sidebarData.category !== "all" 
    ? `category_${sidebarData.category}` 
    : "search"

  usePageSEO(pageIdentifier, { 
    title: seoTitle + " | News18 India", 
    description: `Read latest articles on ${seoTitle.toLowerCase()} on News18 India.` 
  })

  return (
    <div className="flex flex-col md:flex-row">
      <SearchSidebar
        sidebarData={sidebarData}
        setSidebarData={setSidebarData}
        categories={categories}
        subcategories={subcategories}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
      <SearchResults
        posts={searchPosts}
        loading={searchLoading || isPending}
        totalPosts={searchTotal}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default Search
