import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage"
import axios from "axios"

export const useEditPost = (options = {}) => {
  const { onOpenTableModal } = options
  const { toast } = useToast()
  const navigate = useNavigate()
  const { postId } = useParams()
  const quillRef = useRef(null)

  const { currentUser } = useSelector((state) => state.user)

  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({})
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [updatePostError, setUpdatePostError] = useState(null)

  useEffect(() => {
    axios.get("/api/category/getcategories", { validateStatus: () => true })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) setCategories(res.data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/post/getposts?postId=${postId}&isAdmin=true`, { validateStatus: () => true })
        const data = res.data
        if (res.status >= 200 && res.status < 300 && data.posts?.length > 0) {
          setUpdatePostError(null)
          setFormData(data.posts[0])
        } else {
          setUpdatePostError(data.message || "Failed to fetch post")
        }
      } catch (error) {
        setUpdatePostError(error.message)
      }
    }
    fetchPost()
  }, [postId])

  useEffect(() => {
    if (formData.category && categories.length > 0) {
      const selectedCat = categories.find((c) => c.slug === formData.category)
      setSubcategories(selectedCat ? selectedCat.subcategories || [] : [])
    }
  }, [formData.category, categories])

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
      const res = await axios.put(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        formData,
        { validateStatus: () => true }
      )
      const data = res.data
      if (res.status >= 200 && res.status < 300) {
        toast({ title: "Article Updated Successfully!" })
        setUpdatePostError(null)
        navigate("/dashboard?tab=posts")
      } else {
        toast({ title: data.message || "Something went wrong!" })
        setUpdatePostError(data.message)
      }
    } catch (error) {
      toast({ title: "Something went wrong! Please try again." })
      setUpdatePostError("Something went wrong! Please try again.")
    }
  }

  return {
    quillRef,
    formData,
    setFormData,
    categories,
    subcategories,
    updatePostError,
    setFile,
    handleCategoryChange,
    handleUploadImage,
    imageUploading,
    imageUploadError,
    modules,
    handleSubmit,
  }
}
export default useEditPost
