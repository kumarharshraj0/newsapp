import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage"
import axios from "axios"

export const useCreatePost = (options = {}) => {
  const { onOpenTableModal } = options
  const { toast } = useToast()
  const navigate = useNavigate()
  const quillRef = useRef(null)

  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  // Load draft from localStorage on initial render
  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = localStorage.getItem("news_article_draft")
      if (savedDraft) {
        return JSON.parse(savedDraft)
      }
    } catch (e) {
      console.error("Error reading draft from localStorage:", e)
    }
    return { language: "english" }
  })
  const [hasDraftRestored, setHasDraftRestored] = useState(false)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [createPostError, setCreatePostError] = useState(null)

  // Check if draft was restored on mount to notify user
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("news_article_draft")
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        if (parsed.title || parsed.content) {
          setHasDraftRestored(true)
        }
      }
    } catch (e) {}
  }, [])

  // Auto-save draft whenever formData changes (with debounce)
  useEffect(() => {
    if (!formData.title && !formData.content && !formData.image) return
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("news_article_draft", JSON.stringify(formData))
      } catch (e) {
        console.error("Failed to auto-save draft:", e)
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [formData])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem("news_article_draft")
      setFormData({
        language: "english",
        title: "",
        content: "",
        image: "",
        imageAlt: "",
        imageCaption: "",
        slug: "",
        category: "",
        subcategory: "",
      })
      setHasDraftRestored(false)
      toast({ title: "Draft discarded." })
    } catch (e) {}
  }, [toast])

  useEffect(() => {
    axios.get("/api/category/getcategories", { validateStatus: () => true })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) setCategories(res.data)
      })
      .catch(console.error)
  }, [])

  const handleCategoryChange = (val) => {
    setFormData((prev) => ({ ...prev, category: val, subcategory: "" }))
    const selectedCat = categories.find((c) => c.slug === val)
    setSubcategories(selectedCat ? selectedCat.subcategories || [] : [])
  }

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image!")
      toast({ title: "Please select an image!" })
      return
    }
    try {
      setImageUploading(true)
      setImageUploadError(null)
      const uploadedFile = await uploadFile(file)
      const postImageUrl = getFilePreview(uploadedFile.$id)
      setFormData((prev) => ({ ...prev, image: postImageUrl }))
      toast({ title: "Cover Image Uploaded Successfully!" })
    } catch (error) {
      setImageUploadError("Image upload failed")
      toast({ title: "Image upload failed!" })
    } finally {
      setImageUploading(false)
    }
  }

  const onOpenTableModalRef = useRef(onOpenTableModal)
  useEffect(() => {
    onOpenTableModalRef.current = onOpenTableModal
  }, [onOpenTableModal])

  const onOpenImageModalRef = useRef(options.onOpenImageModal)
  useEffect(() => {
    onOpenImageModalRef.current = options.onOpenImageModal
  }, [options.onOpenImageModal])

  const toastRef = useRef(toast)
  useEffect(() => {
    toastRef.current = toast
  }, [toast])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: () => {
            if (onOpenImageModalRef.current) {
              onOpenImageModalRef.current()
            }
          },
        },
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
    try {
      const res = await axios.post("/api/post/create", formData, { validateStatus: () => true })
      const data = res.data
      if (res.status < 200 || res.status >= 300) {
        toast({ title: "Something went wrong! Please try again." })
        setCreatePostError(data.message || "Something went wrong!")
        return
      }
      // Clear draft upon successful publish
      localStorage.removeItem("news_article_draft")
      toast({ title: "Article Published Successfully!" })
      setCreatePostError(null)
      navigate("/dashboard?tab=posts")
    } catch (error) {
      toast({ title: "Something went wrong! Please try again." })
      setCreatePostError("Something went wrong! Please try again.")
    }
  }

  return {
    quillRef,
    formData,
    setFormData,
    categories,
    subcategories,
    createPostError,
    setFile,
    handleCategoryChange,
    handleUploadImage,
    imageUploading,
    imageUploadError,
    modules,
    handleSubmit,
    hasDraftRestored,
    clearDraft,
  }
}
export default useCreatePost
