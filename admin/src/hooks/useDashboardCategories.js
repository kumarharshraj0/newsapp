import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

export const useDashboardCategories = () => {
  const { currentUser } = useSelector((state) => state.user)
  const { toast } = useToast()

  const [categories, setCategories] = useState([])
  const [newCatName, setNewCatName] = useState("")
  const [newCatNameHi, setNewCatNameHi] = useState("")
  const [newSubName, setNewSubName] = useState("")
  const [newSubNameHi, setNewSubNameHi] = useState("")
  const [selectedCatId, setSelectedCatId] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        setCategories(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch categories: ", error)
    }
  }

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchCategories()
    }
  }, [currentUser])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) {
      toast({ title: "Please enter a category name!" })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("/api/category/create", { name: newCatName, nameHi: newCatNameHi }, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        toast({ title: `Category "${res.data.name}" created successfully!` })
        setNewCatName("")
        setNewCatNameHi("")
        fetchCategories()
      } else {
        toast({ title: res.data.message || "Failed to create category" })
      }
    } catch (error) {
      toast({ title: "Something went wrong!" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubcategory = async (e) => {
    e.preventDefault()
    if (!selectedCatId) {
      toast({ title: "Please select a parent category!" })
      return
    }
    if (!newSubName.trim()) {
      toast({ title: "Please enter a subcategory name!" })
      return
    }

    setLoading(true)
    try {
      const res = await axios.post(`/api/category/add-subcategory/${selectedCatId}`, { name: newSubName, nameHi: newSubNameHi }, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        toast({ title: "Subcategory added successfully!" })
        setNewSubName("")
        setNewSubNameHi("")
        fetchCategories()
      } else {
        toast({ title: res.data.message || "Failed to add subcategory" })
      }
    } catch (error) {
      toast({ title: "Something went wrong!" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Are you sure you want to delete this category? All its subcategories will be removed!")) {
      return
    }

    try {
      const res = await axios.delete(`/api/category/delete/${catId}`, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        toast({ title: "Category deleted successfully!" })
        fetchCategories()
      } else {
        toast({ title: res.data.message || "Failed to delete category" })
      }
    } catch (error) {
      toast({ title: "Something went wrong!" })
    }
  }

  return {
    categories,
    newCatName,
    setNewCatName,
    newCatNameHi,
    setNewCatNameHi,
    newSubName,
    setNewSubName,
    newSubNameHi,
    setNewSubNameHi,
    selectedCatId,
    setSelectedCatId,
    loading,
    handleCreateCategory,
    handleAddSubcategory,
    handleDeleteCategory,
  }
}
export default useDashboardCategories
