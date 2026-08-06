import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"
import ImageResize from "quill-image-resize-module-react"

window.Quill = Quill
Quill.register("modules/imageResize", ImageResize)
import axios from "axios"
import { FaTrash, FaFileAlt, FaPlus } from "react-icons/fa"

const DashboardPages = () => {
  const { toast } = useToast()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const quillRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast({ title: "Title and content are required!" })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("/api/page/create", formData)
      if (res.status === 201) {
        toast({ title: "Page created successfully!" })
        setFormData({
          title: "",
          content: "",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          canonicalUrl: "",
        })
        fetchPages()
      }
    } catch (error) {
      toast({ title: "Failed to create page" })
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
      toast({ title: "Failed to delete page" })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-[#0A2240] mb-8 border-b-2 border-[#E1261C] pb-2 flex items-center gap-2">
        <FaFileAlt className="text-[#E1261C]" /> Pages Management
      </h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-10">
        <h2 className="text-lg font-bold text-[#0A2240] mb-4 flex items-center gap-2">
          <span className="bg-[#E1261C] text-white p-1 rounded-full text-xs"><FaPlus /></span> Create New Page
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Page Title (e.g. About Us, Privacy Policy)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border-gray-300 font-bold"
          />

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
              />
               <Input
                type="text"
                placeholder="Keywords"
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
            {loading ? "Creating..." : "Create Page"}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-[#0A2240]">Existing Pages</h3>
        </div>
        <div className="p-4">
          {pages.length > 0 ? (
            <div className="flex flex-col gap-3">
              {pages.map((page) => (
                <div key={page._id} className="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-slate-50">
                  <div>
                    <h4 className="font-bold text-[#0A2240]">{page.title}</h4>
                    <p className="text-xs text-gray-500">Slug: /{page.slug}</p>
                  </div>
                  <button onClick={() => handleDelete(page._id)} className="text-red-500 hover:text-red-700 p-2">
                    <FaTrash />
                  </button>
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
