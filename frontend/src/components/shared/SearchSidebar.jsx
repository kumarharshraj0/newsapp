import React, { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Translate } from "@/hooks/useTranslation"
import { useSelector } from "react-redux"

const SearchSidebar = memo(({ sidebarData, setSidebarData, categories, subcategories, onSubmit, isPending }) => {
  const { selectedLanguage } = useSelector((state) => state.language)

  return (
    <aside className="p-6 md:w-1/4 bg-white shadow-md border-r border-gray-300">
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold text-gray-600"><Translate text="Filters" language={selectedLanguage} /></h2>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-600"><Translate text="Search Term:" language={selectedLanguage} /></label>
        <Input placeholder="Search..." id="searchTerm" type="text" className="border-gray-300 rounded-md"
          value={sidebarData.searchTerm}
          onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-600"><Translate text="Sort By:" language={selectedLanguage} /></label>
        <Select onValueChange={(v) => setSidebarData({ ...sidebarData, sort: v })} value={sidebarData.sort}>
          <SelectTrigger className="w-full border border-slate-400"><SelectValue placeholder="Select Order" /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel><Translate text="Order by:" language={selectedLanguage} /></SelectLabel>
              <SelectItem value="desc"><Translate text="Latest" language={selectedLanguage} /></SelectItem>
              <SelectItem value="asc"><Translate text="Oldest" language={selectedLanguage} /></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-600"><Translate text="Category:" language={selectedLanguage} /></label>
        <Select onValueChange={(v) => setSidebarData({ ...sidebarData, category: v, subcategory: "" })} value={sidebarData.category}>
          <SelectTrigger className="w-full border border-slate-400"><SelectValue placeholder="Select a Category" /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel><Translate text="Category:" language={selectedLanguage} /></SelectLabel>
              <SelectItem value="all"><Translate text="All Categories" language={selectedLanguage} /></SelectItem>
              {categories.map((cat) => <SelectItem key={cat._id} value={cat.slug}>{selectedLanguage === "hindi" && cat.nameHi ? cat.nameHi : <Translate text={cat.name} language={selectedLanguage} />}</SelectItem>)}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {subcategories.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-600"><Translate text="Subcategory:" language={selectedLanguage} /></label>
          <Select onValueChange={(v) => setSidebarData({ ...sidebarData, subcategory: v })} value={sidebarData.subcategory}>
            <SelectTrigger className="w-full border border-slate-400"><SelectValue placeholder="Select a Subcategory" /></SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel><Translate text="Subcategory:" language={selectedLanguage} /></SelectLabel>
                <SelectItem value="all"><Translate text="All Subcategories" language={selectedLanguage} /></SelectItem>
                {subcategories.map((sub, i) => <SelectItem key={i} value={sub.slug}>{selectedLanguage === "hindi" && sub.nameHi ? sub.nameHi : <Translate text={sub.name} language={selectedLanguage} />}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit" disabled={isPending} className="bg-red-600 text-white py-2 px-4 rounded-full shadow-lg">
        {isPending ? <Translate text="Applying..." language={selectedLanguage} /> : <Translate text="Apply Filters" language={selectedLanguage} />}
      </Button>
    </form>
  </aside>
)})

SearchSidebar.displayName = "SearchSidebar"

export default SearchSidebar
