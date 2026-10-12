import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { FaShieldAlt, FaClock, FaCalendarAlt, FaChevronRight, FaFileAlt } from "react-icons/fa"

const DynamicPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
  const [allPages, setAllPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`/api/page/getPage/${slug}`)
        if (res.status === 200) {
          setPage(res.data)
        } else {
          setError("Page not found")
        }
      } catch (err) {
        setError("Page not found")
      } finally {
        setLoading(false)
      }
    }
    fetchPage()
  }, [slug])

  useEffect(() => {
    const fetchAllPages = async () => {
      try {
        const res = await axios.get("/api/page/getPages")
        if (res.status === 200) {
          setAllPages(res.data)
        }
      } catch (e) {}
    }
    fetchAllPages()
  }, [])

  useEffect(() => {
    if (page) {
      document.title = page.metaTitle || `${page.title} | New Pulse`
      
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement("meta")
        metaDesc.name = "description"
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = page.metaDescription || ""

      let metaKeywords = document.querySelector('meta[name="keywords"]')
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta")
        metaKeywords.name = "keywords"
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = page.keywords || ""

      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement("link")
        linkCanonical.rel = "canonical"
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.href = page.canonicalUrl || window.location.href
    }
  }, [page])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E1261C]"></div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <FaFileAlt className="text-gray-300 text-6xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist or may have been relocated.</p>
        <Link to="/" className="px-6 py-2.5 bg-[#0A2240] text-white rounded font-semibold hover:bg-[#0A2240]/90 transition">
          Return to Homepage
        </Link>
      </div>
    )
  }

  // Calculate estimated reading time
  const wordCount = (page.content || "").replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 180))

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-[#E1261C] transition-colors">Home</Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="text-slate-400">Pages</span>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{page.title}</span>
        </nav>

        {/* Main Article Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header Banner */}
          <div className="p-6 md:p-10 border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100/50">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#E1261C] border border-red-100 mb-4">
              <FaShieldAlt className="text-xs" /> Official Policy & Document
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-[#0A2240] tracking-tight leading-tight">
              {page.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 text-xs md:text-sm text-slate-500 pt-2 border-t border-slate-200/60">
              <span className="flex items-center gap-1.5 font-medium">
                <FaCalendarAlt className="text-[#E1261C]" />
                Updated: {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "October 2026"}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <FaClock className="text-slate-400" />
                {readingTime} min read
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-xs font-semibold border border-emerald-100">
                Verified Guidelines
              </span>
            </div>
          </div>

          {/* Styled Content Area */}
          <div className="p-6 md:p-10">
            <div
              className="dynamic-page-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Quick links to other official pages */}
          {allPages.length > 1 && (
            <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
                Other Official Pages & Policies
              </h4>
              <div className="flex flex-wrap gap-2">
                {allPages.filter((p) => p.slug !== slug).map((other) => (
                  <Link
                    key={other._id}
                    to={`/page/${other.slug}`}
                    className="text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 hover:border-[#E1261C] hover:text-[#E1261C] transition-colors shadow-2xs"
                  >
                    {other.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default DynamicPage
