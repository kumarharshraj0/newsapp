import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

export const useDashboardUserPosts = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [postIdToDelete, setPostIdToDelete] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/post/getposts?userId=${currentUser._id}&isAdmin=true`, {
          validateStatus: () => true,
        })
        if (res.status >= 200 && res.status < 300) {
          setUserPosts(res.data.posts)
          setShowMore(res.data.posts.length >= 9)
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (currentUser) {
      fetchPosts()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await axios.get(
        `/api/post/getposts?userId=${currentUser._id}&isAdmin=true&startIndex=${startIndex}`,
        { validateStatus: () => true }
      )
      if (res.status >= 200 && res.status < 300) {
        setUserPosts((prev) => [...prev, ...res.data.posts])
        setShowMore(res.data.posts.length >= 9)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        validateStatus: () => true,
      })
      if (res.status >= 200 && res.status < 300) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return {
    userPosts,
    showMore,
    setPostIdToDelete,
    handleShowMore,
    handleDeletePost,
  }
}
export default useDashboardUserPosts
