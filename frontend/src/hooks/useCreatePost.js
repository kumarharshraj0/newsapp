import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage"
import axios from "axios"

export const useCreatePost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const quillRef = useRef(null)

  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [formData, setFormData] = useState({ language: "english" })
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [createPostError, setCreatePostError] = useState(null)

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
      toast({ title: "Featured Image Uploaded Successfully!" })
    } catch (error) {
      setImageUploadError("Image upload failed")
      toast({ title: "Image upload failed!" })
    } finally {
      setImageUploading(false)
    }
  }

  const handleEditorImageUpload = useCallback(() => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const selectedFile = input.files[0]
      if (selectedFile) {
        try {
          toast({ title: "Uploading inline image..." })
          const uploadedFile = await uploadFile(selectedFile)
          const url = getFilePreview(uploadedFile.$id)
          const quill = quillRef.current.getEditor()
          const range = quill.getSelection(true)
          quill.insertEmbed(range ? range.index : 0, "image", url)
          toast({ title: "Inline image inserted successfully!" })
        } catch (err) {
          toast({ title: "Failed to upload image to article body" })
        }
      }
    }
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
        handlers: { image: handleEditorImageUpload },
      },
    }),
    [handleEditorImageUpload]
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("/api/post/create", formData, { validateStatus: () => true })
      const data = res.data
      if (res.status < 200 || res.status >= 300) {
        toast({ title: data.message || "Something went wrong! Please try again." })
        setCreatePostError(data.message || "Something went wrong!")
        return
      }
      setCreatePostError(null)
      if (data.status === "pending") {
        toast({
          title: "Article Submitted Successfully! ⏳",
          description: "Your article has been sent to the admin for review and will be published once approved.",
        })
        navigate("/dashboard?tab=posts")
      } else {
        toast({ title: "Article Published Successfully!" })
        navigate(`/post/${data.slug}`)
      }
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
  }
}
