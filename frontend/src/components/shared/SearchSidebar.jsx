import React, { memo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Translate } from "@/hooks/useTranslation"
import { useSelector } from "react-redux"
import { Filter, X, RotateCcw } from "lucide-react"

const SearchSidebar = memo(({
  sidebarData,
  setSidebarData,
  categories,
  subcategories,
  onSubmit,
  isPending,
  isMobileOpen,
  onCloseMobile,
  onReset,
}) => {
  const { selectedLanguage } = useSelector((state) => state.language)

  // Prevent background scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  const hasActiveFilters = Boolean(
    sidebarData.searchTerm ||
    (sidebarData.category && sidebarData.category !== "all") ||
    (sidebarData.sort && sidebarData.sort !== "desc")
  )

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
        aria-hidden={!isMobileOpen}
      />

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 opacity-100 visible pointer-events-auto" : "-translate-x-full opacity-0 invisible pointer-events-none"}

          md:static md:translate-x-0 md:opacity-100 md:visible md:pointer-events-auto md:w-80 md:min-w-[280px] md:max-w-xs md:shadow-none md:border-r md:border-gray-200 md:z-0 md:min-h-screen
        `}
      >
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 border-gray-100">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-800">
                <Translate text="Filters" language={selectedLanguage} />
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {hasActiveFilters && onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span><Translate text="Reset" language={selectedLanguage} /></span>
                </button>
              )}

              {/* Close Button on Mobile */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Close Filter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Term */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              <Translate text="Search Term:" language={selectedLanguage} />
            </label>
            <Input
              placeholder="Search..."
              id="searchTerm"
              type="text"
              className="border-gray-300 rounded-md focus:border-red-600 focus:ring-red-600"
              value={sidebarData.searchTerm}
              onChange={(e) => setSidebarData({ ...sidebarData, searchTerm: e.target.value })}
            />
          </div>

          {/* Sort By */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              <Translate text="Sort By:" language={selectedLanguage} />
            </label>
            <Select onValueChange={(v) => setSidebarData({ ...sidebarData, sort: v })} value={sidebarData.sort}>
              <SelectTrigger className="w-full border border-gray-300">
                <SelectValue placeholder="Select Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel><Translate text="Order by:" language={selectedLanguage} /></SelectLabel>
                  <SelectItem value="desc"><Translate text="Latest" language={selectedLanguage} /></SelectItem>
                  <SelectItem value="asc"><Translate text="Oldest" language={selectedLanguage} /></SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-700">
              <Translate text="Category:" language={selectedLanguage} />
            </label>
            <Select
              onValueChange={(v) => setSidebarData({ ...sidebarData, category: v, subcategory: "" })}
              value={sidebarData.category}
            >
              <SelectTrigger className="w-full border border-gray-300">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel><Translate text="Category:" language={selectedLanguage} /></SelectLabel>
                  <SelectItem value="all"><Translate text="All Categories" language={selectedLanguage} /></SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {selectedLanguage === "hindi" && cat.nameHi ? cat.nameHi : <Translate text={cat.name} language={selectedLanguage} />}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          {subcategories.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm text-gray-700">
                <Translate text="Subcategory:" language={selectedLanguage} />
              </label>
              <Select onValueChange={(v) => setSidebarData({ ...sidebarData, subcategory: v })} value={sidebarData.subcategory}>
                <SelectTrigger className="w-full border border-gray-300">
                  <SelectValue placeholder="Select a Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel><Translate text="Subcategory:" language={selectedLanguage} /></SelectLabel>
                    <SelectItem value="all"><Translate text="All Subcategories" language={selectedLanguage} /></SelectItem>
                    {subcategories.map((sub, i) => (
                      <SelectItem key={i} value={sub.slug}>
                        {selectedLanguage === "hindi" && sub.nameHi ? sub.nameHi : <Translate text={sub.name} language={selectedLanguage} />}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Apply Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#E1261C] hover:bg-[#c81e15] text-white py-2.5 px-4 rounded-lg font-semibold shadow-md active:scale-[0.98] transition-all"
          >
            {isPending ? (
              <Translate text="Applying..." language={selectedLanguage} />
            ) : (
              <Translate text="Apply Filters" language={selectedLanguage} />
            )}
          </Button>
        </form>
      </aside>
    </>
  )
})

SearchSidebar.displayName = "SearchSidebar"

export default SearchSidebar
