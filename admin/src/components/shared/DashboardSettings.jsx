import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useSelector } from "react-redux"

const DashboardSettings = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [file, setFile] = useState(null)
  const [faviconFile, setFaviconFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const logoRes = await axios.get("/api/settings/logo")
        if (logoRes.data.success && logoRes.data.setting) {
          setLogoUrl(logoRes.data.setting.value)
        }
        const faviconRes = await axios.get("/api/settings/favicon")
        if (faviconRes.data.success && faviconRes.data.setting) {
          setFaviconUrl(faviconRes.data.setting.value)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSettings()
  }, [])

  const handleUpload = async (type) => {
    const isFavicon = type === 'favicon'
    const targetFile = isFavicon ? faviconFile : file
    if (!targetFile) return
    
    if (isFavicon) setUploadingFavicon(true)
    else setUploading(true)
    
    setMessage("Uploading...")
    
    // Read file as base64
    const reader = new FileReader()
    reader.readAsDataURL(targetFile)
    reader.onload = async () => {
      const base64Image = reader.result
      try {
        const res = await axios.post("/api/upload/image", { image: base64Image }, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        if (res.data.success) {
          if (isFavicon) setFaviconUrl(res.data.secure_url)
          else setLogoUrl(res.data.secure_url)
          setMessage(`${isFavicon ? 'Favicon' : 'Logo'} uploaded successfully!`)
        } else {
          setMessage(res.data.message || `Failed to upload ${isFavicon ? 'favicon' : 'logo'}`)
        }
      } catch (error) {
        console.log(error)
        setMessage("An error occurred while uploading")
      } finally {
        if (isFavicon) setUploadingFavicon(false)
        else setUploading(false)
      }
    }
  }

  const handleSave = async (type) => {
    try {
      const url = type === 'favicon' ? faviconUrl : logoUrl
      const settingKey = type === 'favicon' ? 'favicon' : 'logo'
      const res = await axios.post(
        `/api/settings/${settingKey}`,
        { value: url },
        { headers: { Authorization: `Bearer ${currentUser?.token}` } }
      )
      if (res.data.success) {
        setMessage(`${type === 'favicon' ? 'Favicon' : 'Logo'} saved successfully!`)
      }
    } catch (error) {
      setMessage(`Failed to save ${type}`)
    }
  }

  const handleDelete = async (type) => {
    try {
      const settingKey = type === 'favicon' ? 'favicon' : 'logo'
      const res = await axios.delete(`/api/settings/${settingKey}`)
      if (res.data.success) {
        if (type === 'favicon') setFaviconUrl("")
        else setLogoUrl("")
        setMessage(`${type === 'favicon' ? 'Favicon' : 'Logo'} deleted successfully!`)
      }
    } catch (error) {
      setMessage(`Failed to delete ${type}`)
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
      
      {message && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Logo</h3>
        
        {logoUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Current Logo:</p>
            <img src={logoUrl} alt="Site Logo" className="h-16 object-contain border p-2 bg-gray-50" />
            <Button onClick={() => handleDelete('logo')} variant="destructive" className="mt-2 text-sm">Delete Logo</Button>
          </div>
        )}

        <div className="flex gap-4 items-center mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <Button onClick={() => handleUpload('logo')} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload Logo"}
          </Button>
        </div>

        <div className="mt-6 border-t pt-4">
          <Button onClick={() => handleSave('logo')} className="w-full">
            Save Logo
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow mt-6">
        <h3 className="text-xl font-semibold mb-4">Favicon</h3>
        
        {faviconUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Current Favicon:</p>
            <img src={faviconUrl} alt="Site Favicon" className="h-12 w-12 object-contain border p-2 bg-gray-50" />
            <Button onClick={() => handleDelete('favicon')} variant="destructive" className="mt-2 text-sm">Delete Favicon</Button>
          </div>
        )}

        <div className="flex gap-4 items-center mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFaviconFile(e.target.files[0])}
            className="border p-2 rounded"
          />
          <Button onClick={() => handleUpload('favicon')} disabled={!faviconFile || uploadingFavicon}>
            {uploadingFavicon ? "Uploading..." : "Upload Favicon"}
          </Button>
        </div>

        <div className="mt-6 border-t pt-4">
          <Button onClick={() => handleSave('favicon')} className="w-full">
            Save Favicon
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardSettings
