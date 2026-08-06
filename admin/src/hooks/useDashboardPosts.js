import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

export const useDashboardPosts = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [postIdToDelete, setPostIdToDelete] = useState("")
  
  // Filters & Pagination
  const [category, setCategory] = useState("all")
  const [date, setDate] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 9

  const fetchPosts = useCallback(async () => {
    try {
      const statusParam = activeTab !== "all" ? `&status=${activeTab}` : ""
      const categoryParam = category !== "all" ? `&category=${category}` : ""
      const dateParam = date ? `&date=${date}` : ""
      const startIndex = (page - 1) * limit
      
      const res = await axios.get(
        `/api/post/getposts?isAdmin=true&startIndex=${startIndex}&limit=${limit}${statusParam}${categoryParam}${dateParam}`, 
        { validateStatus: () => true }
      )
      if (res.status >= 200 && res.status < 300) {
        setPosts(res.data.posts)
        setTotalPages(Math.ceil((res.data.totalFilteredPosts || res.data.totalPosts) / limit) || 1)
      }
    } catch (error) {
      console.error(error)
    }
  }, [activeTab, category, date, page])

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts()
    }
  }, [fetchPosts, currentUser?.isAdmin])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [activeTab, category, date])

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        validateStatus: () => true,
      })
      if (res.status >= 200 && res.status < 300) {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleApprove = async (postId) => {
    try {
      const res = await axios.put(`/api/post/approvepost/${postId}`, {}, {
        validateStatus: () => true,
      })
      if (res.status >= 200 && res.status < 300) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, status: "approved" } : p))
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async (postId) => {
    try {
      const res = await axios.put(`/api/post/rejectpost/${postId}`, {}, {
        validateStatus: () => true,
      })
      if (res.status >= 200 && res.status < 300) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, status: "rejected" } : p))
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    currentUser,
    posts,
    activeTab,
    setActiveTab,
    category,
    setCategory,
    date,
    setDate,
    page,
    setPage,
    totalPages,
    setPostIdToDelete,
    handleDeletePost,
    handleApprove,
    handleReject,
  }
}
export default useDashboardPosts
