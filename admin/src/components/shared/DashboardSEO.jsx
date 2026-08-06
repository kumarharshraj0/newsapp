import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import React, { useEffect, useState } from "react"

const DashboardSEO = () => {
  const { toast } = useToast()
  const [selectedPage, setSelectedPage] = useState("home")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    pageIdentifier: "home",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalUrl: "",
    schemaScript: "",
  })

  const [basePages] = useState([
    { value: "home", label: "Home Page" },
    { value: "about", label: "About Page" },
    { value: "search", label: "Search / Default Categories Page" },
  ])
  const [availablePages, setAvailablePages] = useState(basePages)

  useEffect(() => {
    axios.get("/api/category/getcategories", { validateStatus: () => true })
      .then((res) => {
        if (res.status === 200) {
          const cats = res.data.map((c) => ({ value: `category_${c.slug}`, label: `Category: ${c.name}` }))
          setAvailablePages([...basePages, ...cats])
        }
      })
      .catch(console.error)
  }, [basePages])

  useEffect(() => {
    fetchSEOData(selectedPage)
  }, [selectedPage])

  const fetchSEOData = async (pageId) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/seo/get/${pageId}`)
      if (res.status === 200 && res.data && res.data.pageIdentifier) {
        setFormData({
          pageIdentifier: res.data.pageIdentifier,
          metaTitle: res.data.metaTitle || "",
          metaDescription: res.data.metaDescription || "",
          keywords: res.data.keywords || "",
          canonicalUrl: res.data.canonicalUrl || "",
          schemaScript: res.data.schemaScript || "",
        })
      } else {
        // Reset if no data found
        setFormData({
          pageIdentifier: pageId,
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          canonicalUrl: "",
          schemaScript: "",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to load SEO data for this page",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post("/api/seo/update", formData)
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "SEO Settings updated successfully!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update SEO",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Global SEO Settings</h1>
      </div>

      <div className="bg-white p-6 shadow rounded-md border border-gray-200">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Select Page to Configure</label>
          <Select value={selectedPage} onValueChange={(val) => {
            setSelectedPage(val)
            setFormData({ ...formData, pageIdentifier: val })
          }}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a page" />
            </SelectTrigger>
            <SelectContent>
              {availablePages.map(page => (
                <SelectItem key={page.value} value={page.value}>{page.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Meta Title</label>
              <Input
                id="metaTitle"
                placeholder="e.g. News18 India | Latest News"
                value={formData.metaTitle}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Meta Description</label>
              <Textarea
                id="metaDescription"
                placeholder="Brief description of the page for search engines"
                value={formData.metaDescription}
                onChange={handleChange}
                disabled={loading}
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Keywords</label>
              <Input
                id="keywords"
                placeholder="e.g. news, breaking, politics, india"
                value={formData.keywords}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Canonical URL</label>
              <Input
                id="canonicalUrl"
                placeholder="https://www.yourwebsite.com/"
                value={formData.canonicalUrl}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">LD-JSON Schema Script</label>
              <Textarea
                id="schemaScript"
                placeholder='{"@context": "https://schema.org", ...}'
                value={formData.schemaScript}
                onChange={handleChange}
                disabled={loading}
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
            {loading ? "Saving..." : "Save SEO Settings"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default DashboardSEO
