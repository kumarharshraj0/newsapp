import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const DynamicPage = () => {
  const { slug } = useParams()
  const [page, setPage] = useState(null)
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
    if (page) {
      document.title = page.metaTitle || page.title || "News18 India"
      
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E1261C]"></div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">Oops! {error || "Page not found"}</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded border border-gray-100">
        <h1 className="text-4xl font-black text-[#0A2240] mb-6 border-b-2 border-[#E1261C] inline-block pb-2">
          {page.title}
        </h1>
        
        <div
          className="prose prose-lg max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: page.content }}
        ></div>
      </div>
    </div>
  )
}

export default DynamicPage
