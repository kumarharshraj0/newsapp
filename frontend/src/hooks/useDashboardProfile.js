import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import { getFilePreview, uploadFile } from "@/lib/appwrite/uploadImage"
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "@/redux/user/userSlice"
import axios from "axios"

export const useDashboardProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user)
  const profilePicRef = useRef()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [formData, setFormData] = useState({
    socialLinks: currentUser?.socialLinks || {}
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file))
    }
  }

  const handleChange = (e) => {
    if (e.target.id.startsWith("social_")) {
      const platform = e.target.id.split("_")[1]
      const field = e.target.id.split("_")[2]
      const val = e.target.type === "checkbox" ? e.target.checked : e.target.value
      
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: {
            ...(prev.socialLinks?.[platform] || {}),
            [field]: val
          }
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return currentUser.profilePicture
    try {
      const uploadedFile = await uploadFile(imageFile)
      return getFilePreview(uploadedFile.$id)
    } catch (error) {
      toast({ title: "Update user failed. Please try again!" })
      console.error("Image upload failed: ", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateStart())
      const profilePicture = await uploadImage()
      const updateProfile = { ...formData, profilePicture }

      const res = await axios.put(`/api/user/update/${currentUser._id}`, updateProfile, {
        validateStatus: () => true
      })
      if (res.status >= 200 && res.status < 300) {
        dispatch(updateSuccess(res.data))
        toast({ title: "User updated successfully." })
      } else {
        toast({ title: "Update user failed. Please try again!" })
        dispatch(updateFailure(res.data.message || "Failed to update profile"))
      }
    } catch (error) {
      toast({ title: "Update user failed. Please try again!" })
      dispatch(updateFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        dispatch(deleteUserSuccess())
      } else {
        dispatch(deleteUserFailure(res.data.message || "Failed to delete user"))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout", {}, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    currentUser,
    error,
    loading,
    profilePicRef,
    imageFileUrl,
    handleImageChange,
    handleChange,
    handleSubmit,
    handleDeleteUser,
    handleSignout,
  }
}
export default useDashboardProfile
