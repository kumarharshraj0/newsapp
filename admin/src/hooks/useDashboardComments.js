import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

export const useDashboardComments = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [commentIdToDelete, setCommentIdToDelete] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getcomments`, { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) {
          setComments(res.data.comments)
          if (res.data.comments.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (currentUser?.isAdmin) {
      fetchComments()
    }
  }, [currentUser?._id])

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await axios.get(`/api/comment/getcomments?startIndex=${startIndex}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setComments((prev) => [...prev, ...res.data.comments])
        if (res.data.comments.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteComment = async () => {
    try {
      const res = await axios.delete(`/api/comment/deleteComment/${commentIdToDelete}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return {
    currentUser,
    comments,
    showMore,
    setCommentIdToDelete,
    handleShowMore,
    handleDeleteComment,
  }
}
export default useDashboardComments
