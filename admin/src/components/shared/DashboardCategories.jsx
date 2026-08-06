import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaTrash, FaPlus, FaFolderOpen } from "react-icons/fa"
import { useDashboardCategories } from "@/hooks/useDashboardCategories"

const DashboardCategories = () => {
  const {
    categories,
    newCatName,
    setNewCatName,
    newCatNameHi,
    setNewCatNameHi,
    newSubName,
    setNewSubName,
    newSubNameHi,
    setNewSubNameHi,
    setSelectedCatId,
    loading,
    handleCreateCategory,
    handleAddSubcategory,
    handleDeleteCategory,
  } = useDashboardCategories()

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen">
      <h1 className="text-3xl font-black text-[#0A2240] mb-8 border-b-2 border-[#E1261C] pb-2 flex items-center gap-2">
        <FaFolderOpen className="text-[#E1261C]" /> Category Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Create Category Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A2240] mb-4 flex items-center gap-2">
            <span className="bg-[#E1261C] text-white p-1 rounded-full text-xs"><FaPlus /></span> Create Primary Category
          </h2>
          <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Category Name (English)</label>
              <Input type="text" placeholder="e.g. Technology, Business, Lifestyle" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="border-gray-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Category Name (Hindi)</label>
              <Input type="text" placeholder="e.g. तकनीक, व्यापार" value={newCatNameHi} onChange={(e) => setNewCatNameHi(e.target.value)} className="border-gray-300" />
            </div>
            <Button type="submit" disabled={loading} className="bg-[#0A2240] hover:bg-[#0A2240]/90 text-white font-bold">
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </div>

        {/* Add Subcategory Form */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#0A2240] mb-4 flex items-center gap-2">
            <span className="bg-[#E1261C] text-white p-1 rounded-full text-xs"><FaPlus /></span> Add Subcategory
          </h2>
          <form onSubmit={handleAddSubcategory} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Parent Category</label>
              <Select onValueChange={(val) => setSelectedCatId(val)}>
                <SelectTrigger className="w-full border-gray-300"><SelectValue placeholder="Select Parent Category" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subcategory Name (English)</label>
              <Input type="text" placeholder="e.g. AI, Startups, Cricket" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="border-gray-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subcategory Name (Hindi)</label>
              <Input type="text" placeholder="e.g. एआई, क्रिकेट" value={newSubNameHi} onChange={(e) => setNewSubNameHi(e.target.value)} className="border-gray-300" />
            </div>
            <Button type="submit" disabled={loading} className="bg-[#E1261C] hover:bg-[#E1261C]/90 text-white font-bold">
              {loading ? "Adding..." : "Add Subcategory"}
            </Button>
          </form>
        </div>
      </div>

      {/* Categories table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200"><h3 className="font-bold text-[#0A2240]">Existing Categories Tree</h3></div>
        {categories.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-bold text-[#0A2240]">Category Name</TableHead>
                <TableHead className="font-bold text-[#0A2240]">Slug (Route Key)</TableHead>
                <TableHead className="font-bold text-[#0A2240]">Subcategories</TableHead>
                <TableHead className="font-bold text-[#0A2240] text-center w-[100px]">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-bold text-[#0A2240]">{cat.name} <span className="text-gray-500 font-normal text-xs ml-1">({cat.nameHi})</span></TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{cat.slug}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        cat.subcategories.map((sub, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded border border-gray-200 font-semibold">
                            {sub.name} <span className="text-gray-500 font-normal text-[10px]">({sub.nameHi})</span> <span className="text-[10px] text-gray-400 font-normal">({sub.slug})</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">No subcategories</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors inline-block" title="Delete Category">
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-400">No categories set up yet.</div>
        )}
      </div>
    </div>
  )
}

export default DashboardCategories
