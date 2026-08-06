import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

export const useDashboardUsers = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [userIdToDelete, setUserIdToDelete] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/user/getusers`, { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) {
          setUsers(res.data.users)
          if (res.data.users.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    if (currentUser?.isAdmin) {
      fetchUsers()
    }
  }, [currentUser?._id])

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await axios.get(`/api/user/getusers?startIndex=${startIndex}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setUsers((prev) => [...prev, ...res.data.users])
        if (res.data.users.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(`/api/user/delete/${userIdToDelete}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return {
    currentUser,
    users,
    showMore,
    setUserIdToDelete,
    handleShowMore,
    handleDeleteUser,
  }
}
export default useDashboardUsers
