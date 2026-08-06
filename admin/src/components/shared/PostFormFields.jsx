import React from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PostFormFields = ({ formData, setFormData, categories, subcategories, handleCategoryChange }) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Title"
        required
        id="title"
        className="w-full h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 font-bold"
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        value={formData.title || ""}
      />

      {/* Language Selector */}
      <div className="flex gap-3 items-center">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap">🌐 Language:</span>
        <div className="flex gap-2">
          {[{ label: "English", value: "english", flag: "🇬🇧" }, { label: "हिन्दी", value: "hindi", flag: "🇮🇳" }].map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setFormData({ ...formData, language: lang.value })}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                (formData.language || "english") === lang.value
                  ? "bg-slate-700 text-white border-slate-700"
                  : "bg-white text-slate-600 border-slate-400 hover:border-slate-600"
              }`}
            >
              {lang.flag} {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select onValueChange={handleCategoryChange} value={formData.category || ""}>
          <SelectTrigger className="w-full h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          disabled={subcategories.length === 0}
          value={formData.subcategory || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, subcategory: value })
          }
        >
          <SelectTrigger className="w-full h-12 border border-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0">
            <SelectValue placeholder="Select a Subcategory" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subcategory</SelectLabel>
              {subcategories.map((sub, i) => (
                <SelectItem key={i} value={sub.slug}>
                  {sub.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PostFormFields
