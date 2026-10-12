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
import { FaTrash, FaFileAlt, FaPlus, FaExternalLinkAlt, FaGlobe, FaEdit, FaTimes } from "react-icons/fa"

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
              http://localhost:5173/page/{formData.slug || "page-slug"}
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

          <div className="border border-slate-200 rounded p-4 bg-slate-50 mt-4 flex flex-col gap-3">
             <h3 className="font-bold text-sm text-[#0A2240]">SEO Settings</h3>
             <Input
                type="text"
                placeholder="Meta Title"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
              <textarea
                className="w-full p-2 border border-slate-300 rounded text-sm"
                placeholder="Meta Description"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                rows={2}
              />
               <Input
                type="text"
                placeholder="Keywords (comma separated)"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
               <Input
                type="url"
                placeholder="Canonical URL"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              />
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
                        href={`http://localhost:5173/page/${page.slug}`}
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
