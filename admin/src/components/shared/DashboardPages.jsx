import React, { useEffect, useState, useRef, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"

// Safe Quill Parchment Attributor fix
if (typeof window !== "undefined") {
  window.Quill = Quill
  if (!Quill.imports) Quill.imports = {}
  try {
    const Parchment = Quill.import("parchment")
    if (Parchment && !Parchment.Attributor && Quill.import("attributors")) {
      Parchment.Attributor = Quill.import("attributors")
    }
  } catch (e) {}
}

import ImageResize from "quill-image-resize-module-react"
try {
  Quill.register("modules/imageResize", ImageResize)
} catch (e) {}

import axios from "axios"
import { FaTrash, FaFileAlt, FaPlus, FaExternalLinkAlt, FaGlobe, FaEdit, FaTimes, FaSearch, FaMagic, FaImage, FaCode } from "react-icons/fa"

const DashboardPages = () => {
  const { toast } = useToast()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const quillRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isCustomSlug: false,
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    metaRobots: "index, follow, max-image-preview:large",
    ogImage: "",
    schemaScript: "",
  })

  const fetchPages = async () => {
    try {
      const res = await axios.get("/api/page/getPages")
      if (res.status === 200) {
        setPages(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch pages", error)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          [{ align: [] }],
          ["clean"],
        ],
      },
      imageResize: {
        parallax: true,
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    []
  )

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setFormData((prev) => {
      const autoSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")

      return {
        ...prev,
        title: newTitle,
        slug: prev.isCustomSlug ? prev.slug : autoSlug,
      }
    })
  }

  const handleSlugChange = (e) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "")
    setFormData((prev) => ({
      ...prev,
      slug: val,
      isCustomSlug: true,
    }))
  }

  const handleAutoFillSEO = () => {
    if (!formData.title && !formData.content) {
      toast({
        title: "Please enter Page Title or Content first!",
        variant: "destructive",
      })
      return
    }

    const plainText = formData.content
      ? formData.content
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : ""

    const autoTitle = formData.title
      ? (formData.title.length > 48
          ? formData.title.slice(0, 57) + "..."
          : `${formData.title} | Newpulse`)
      : ""

    const autoDesc = plainText
      ? plainText.slice(0, 155) + (plainText.length > 155 ? "..." : "")
      : ""

    const autoCanonical = formData.slug
      ? `https://newpulse.in/page/${formData.slug}`
      : ""

    setFormData((prev) => ({
      ...prev,
      metaTitle: prev.metaTitle || autoTitle,
      metaDescription: prev.metaDescription || autoDesc,
      canonicalUrl: prev.canonicalUrl || autoCanonical,
      metaRobots: prev.metaRobots || "index, follow, max-image-preview:large",
    }))

    toast({
      title: "SEO fields auto-filled!",
      description: "Meta title, description, and canonical URL generated from page data.",
    })
  }

  const handleEdit = (page) => {
    setEditingId(page._id)
    setFormData({
      title: page.title || "",
      slug: page.slug || "",
      isCustomSlug: true,
      content: page.content || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      keywords: page.keywords || "",
      canonicalUrl: page.canonicalUrl || "",
      metaRobots: page.metaRobots || "index, follow, max-image-preview:large",
      ogImage: page.ogImage || "",
      schemaScript: page.schemaScript || "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData({
      title: "",
      slug: "",
      isCustomSlug: false,
      content: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      canonicalUrl: "",
      metaRobots: "index, follow, max-image-preview:large",
      ogImage: "",
      schemaScript: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast({ title: "Title and content are required!", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        const res = await axios.put(`/api/page/update/${editingId}`, formData)
        if (res.status === 200) {
          toast({ title: "Page updated successfully!" })
          handleCancelEdit()
          fetchPages()
        }
      } else {
        const res = await axios.post("/api/page/create", formData)
        if (res.status === 201) {
          toast({ title: "Page created successfully!" })
          handleCancelEdit()
          fetchPages()
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || (editingId ? "Failed to update page" : "Failed to create page")
      toast({ title: msg, variant: "destructive" })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return

    try {
      const res = await axios.delete(`/api/page/delete/${id}`)
      if (res.status === 200) {
        toast({ title: "Page deleted successfully!" })
        fetchPages()
      }
    } catch (error) {
      toast({ title: "Failed to delete page", variant: "destructive" })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-[#0A2240] mb-8 border-b-2 border-[#E1261C] pb-2 flex items-center gap-2">
        <FaFileAlt className="text-[#E1261C]" /> Pages Management
      </h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#0A2240] flex items-center gap-2">
            <span className="bg-[#E1261C] text-white p-1 rounded-full text-xs">
              {editingId ? <FaEdit /> : <FaPlus />}
            </span>{" "}
            {editingId ? "Edit Page" : "Create New Page"}
          </h2>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelEdit}
              className="text-xs flex items-center gap-1 text-gray-600 hover:text-red-600"
            >
              <FaTimes /> Cancel Edit
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Page Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. About Us, Privacy Policy"
                value={formData.title}
                onChange={handleTitleChange}
                className="border-gray-300 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Page Custom Slug (URL Path)
              </label>
              <Input
                type="text"
                placeholder="e.g. about-us, privacy-policy"
                value={formData.slug}
                onChange={handleSlugChange}
                className="border-gray-300 font-mono text-sm"
              />
            </div>
          </div>

          {/* Live URL Preview */}
          <div className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs flex items-center gap-2 text-slate-600">
            <FaGlobe className="text-[#0A2240] shrink-0" />
            <span>Page URL Preview:</span>
            <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[#E1261C] font-semibold font-mono">
              https://newpulse.in/page/{formData.slug || "page-slug"}
            </code>
          </div>

          <div className="h-64 mb-10 border border-slate-300 rounded">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              placeholder="Page Content..."
              className="h-full"
              value={formData.content}
              modules={modules}
              onChange={(val) => setFormData({ ...formData, content: val })}
            />
          </div>

          {/* Enhanced SEO Settings Card */}
          <div className="border border-slate-300 rounded-lg p-5 bg-slate-50 flex flex-col gap-4 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#0A2240] flex items-center gap-2">
                  <FaSearch className="text-[#E1261C]" /> Search Engine Optimization (SEO) Settings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure search engine visibility, Google snippets, and social sharing metadata for this page.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFillSEO}
                className="text-xs flex items-center gap-1.5 border-[#0A2240] text-[#0A2240] hover:bg-[#0A2240] hover:text-white transition-colors shrink-0"
              >
                <FaMagic className="text-amber-500" /> Auto-Fill SEO
              </Button>
            </div>

            {/* Google Search Result Preview */}
            <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 block">
                Google Search Result Preview
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#202124] mb-1">
                <span className="w-4 h-4 rounded-full bg-[#0A2240] flex items-center justify-center text-[10px] font-bold text-white">
                  N
                </span>
                <span className="text-[11px] font-medium text-slate-700">Newpulse</span>
                <span className="text-slate-400 text-[10px]">•</span>
                <span className="text-[11px] text-slate-500 font-mono truncate">
                  https://newpulse.in › page › {formData.slug || "page-slug"}
                </span>
              </div>
              <div className="text-[#1a0dab] hover:underline cursor-pointer text-base font-medium leading-snug line-clamp-1">
                {formData.metaTitle || (formData.title ? `${formData.title} | Newpulse` : "Page Meta Title | Newpulse")}
              </div>
              <p className="text-xs text-[#4d5156] line-clamp-2 mt-1 leading-relaxed">
                {formData.metaDescription ||
                  "Provide an informative meta description to help searchers and search engines understand what this page offers."}
              </p>
            </div>

            {/* Meta Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="metaTitle" className="text-xs font-semibold text-gray-700 flex justify-between items-center">
                <span>SEO Meta Title</span>
                <span
                  className={`text-[11px] ${(formData.metaTitle?.length || 0) > 60 ? "text-amber-600 font-bold" : "text-gray-500"}`}
                >
                  {formData.metaTitle?.length || 0} / 60 chars (Optimal 50-60)
                </span>
              </label>
              <Input
                type="text"
                id="metaTitle"
                placeholder="e.g. About Us - Official Mission & Editorial Team | Newpulse"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                className="bg-white border-slate-300"
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="metaDescription" className="text-xs font-semibold text-gray-700 flex justify-between items-center">
                <span>SEO Meta Description</span>
                <span
                  className={`text-[11px] ${(formData.metaDescription?.length || 0) > 160 ? "text-amber-600 font-bold" : "text-gray-500"}`}
                >
                  {formData.metaDescription?.length || 0} / 160 chars (Optimal 140-160)
                </span>
              </label>
              <textarea
                id="metaDescription"
                className="w-full p-2.5 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:border-[#0A2240]"
                placeholder="Write a clear, compelling summary of this page for Google search result snippets..."
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={3}
              />
            </div>

            {/* Keywords & Canonical */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="keywords" className="text-xs font-semibold text-gray-700 flex justify-between">
                  <span>SEO Keywords (Comma Separated)</span>
                  <span className="text-[11px] text-gray-400 font-normal">Search indexing</span>
                </label>
                <Input
                  type="text"
                  id="keywords"
                  placeholder="e.g. about us, editorial policy, journalists, newpulse"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="bg-white border-slate-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="canonicalUrl" className="text-xs font-semibold text-gray-700 flex justify-between">
                  <span>Canonical URL</span>
                  <span className="text-[11px] text-green-600 font-normal">Self-canonical default (Recommended)</span>
                </label>
                <Input
                  type="url"
                  id="canonicalUrl"
                  placeholder={`https://newpulse.in/page/${formData.slug || "page-slug"}`}
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  className="bg-white border-slate-300"
                />
              </div>
            </div>

            {/* Meta Robots */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="metaRobots" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
                <span>Robots Meta Tag</span>
                <span className="text-[11px] text-gray-500 font-normal">Directs search engine indexing & crawling</span>
              </label>
              <Input
                type="text"
                id="metaRobots"
                placeholder="index, follow, max-image-preview:large"
                value={formData.metaRobots}
                onChange={(e) => setFormData({ ...formData, metaRobots: e.target.value })}
                className="bg-white border-slate-300 text-xs"
              />
              <div className="flex flex-wrap gap-1.5 mt-0.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, metaRobots: "index, follow, max-image-preview:large" })}
                  className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  Index, Follow (Recommended)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, metaRobots: "noindex, follow" })}
                  className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  Noindex, Follow
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, metaRobots: "noindex, nofollow" })}
                  className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
                >
                  Noindex, Nofollow
                </button>
              </div>
            </div>

            {/* Social Share / OG Image */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ogImage" className="text-xs font-semibold text-gray-700 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <FaImage className="text-[#0A2240]" /> Social Share / OG Image URL (Optional)
                </span>
                <span className="text-[11px] text-gray-500 font-normal">WhatsApp, Facebook, Twitter (1200x630px)</span>
              </label>
              <Input
                type="url"
                id="ogImage"
                placeholder="https://res.cloudinary.com/... or https://newpulse.in/banner.png"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                className="bg-white border-slate-300"
              />
              {formData.ogImage && (
                <div className="mt-1 flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                  <img
                    src={formData.ogImage}
                    alt="OG Preview"
                    className="w-16 h-10 object-cover rounded border border-slate-200"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  <span className="text-[11px] text-slate-600 truncate">{formData.ogImage}</span>
                </div>
              )}
            </div>

            {/* Custom LD-JSON Schema Script */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="schemaScript" className="text-xs font-semibold text-gray-700 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <FaCode className="text-[#0A2240]" /> Custom LD-JSON Schema Script (Optional)
                </span>
                <span className="text-[11px] text-green-600 font-normal">
                  Auto-generates Google WebPage & Breadcrumb schema if empty
                </span>
              </label>
              <textarea
                id="schemaScript"
                className="w-full min-h-[90px] p-2.5 text-xs font-mono border border-slate-300 rounded-md bg-white focus:outline-none focus:border-[#0A2240]"
                placeholder='Leave blank for auto Google WebPage & Breadcrumb schema, or paste custom {"@context": "https://schema.org", ...}'
                value={formData.schemaScript}
                onChange={(e) => setFormData({ ...formData, schemaScript: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="bg-[#0A2240] hover:bg-[#0A2240]/90 text-white font-bold h-12">
            {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Page" : "Create Page")}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-bold text-[#0A2240]">Existing Pages ({pages.length})</h3>
        </div>
        <div className="p-4">
          {pages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pages.map((page) => (
                <div key={page._id} className="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-[#0A2240] flex items-center gap-2">
                      {page.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                        /page/{page.slug}
                      </span>
                      <a
                        href={`https://newpulse.in/page/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                      >
                        <FaExternalLinkAlt className="w-2.5 h-2.5" /> View Live Page
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition-colors"
                      title="Edit page"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(page._id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                      title="Delete page"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center text-sm py-4">No pages found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPages
