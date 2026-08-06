import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export const useCommentSection = (postId) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  const [comment, setComment] = useState("")
  const [allComments, setAllComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [visibleCount, setVisibleCount] = useState(5)
  const [showCommentBox, setShowCommentBox] = useState(false)

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getPostComments/${postId}`, { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) {
          setAllComments(res.data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    getComments()
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (comment.length > 200) {
      toast({ title: "Comment length must be lower than or equal to 200 characters" })
      return
    }
    try {
      const res = await axios.post("/api/comment/create", {
        content: comment,
        postId,
        userId: currentUser._id,
      }, { validateStatus: () => true })

      if (res.status >= 200 && res.status < 300) {
        toast({ title: "Comment successfully!" })
        setComment("")
        setAllComments((prev) => [res.data, ...prev])
        setShowComments(true)
        setShowCommentBox(false)
      }
    } catch (error) {
      toast({ title: "Something went wrong! Please try again." })
    }
  }

  const handleLike = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in")
      return
    }
    try {
      const res = await axios.put(`/api/comment/likeComment/${commentId}`, {}, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setAllComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: res.data.likes, numberOfLikes: res.data.likes.length }
              : c
          )
        )
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleEdit = async (c, editedContent) => {
    setAllComments((prev) =>
      prev.map((item) =>
        item._id === c._id ? { ...item, content: editedContent } : item
      )
    )
  }

  const handleDelete = async (commentId) => {
    if (!currentUser) {
      navigate("/sign-in")
      return
    }
    try {
      const res = await axios.delete(`/api/comment/deleteComment/${commentId}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setAllComments((prev) => prev.filter((c) => c._id !== commentId))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return {
    currentUser,
    comment,
    setComment,
    allComments,
    showComments,
    setShowComments,
    visibleCount,
    setVisibleCount,
    showCommentBox,
    setShowCommentBox,
    handleSubmit,
    handleLike,
    handleEdit,
    handleDelete,
  }
}
export default useCommentSection
