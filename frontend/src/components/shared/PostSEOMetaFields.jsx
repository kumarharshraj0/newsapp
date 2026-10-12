import React from "react"
import { Input } from "@/components/ui/input"

const PostSEOMetaFields = ({ formData, setFormData }) => {
  return (
    <div className="border border-slate-300 rounded-lg p-5 bg-slate-50 flex flex-col gap-4 mt-6">
      <h3 className="text-base font-bold text-[#0A2240] border-b border-slate-200 pb-2 flex items-center gap-2">
        🔍 Search Engine Optimization (SEO) Settings
      </h3>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
          <span>Article URL Slug</span>
          <span className="text-[11px] text-gray-500 font-normal">e.g. asia-cup-final-team-india-victory</span>
        </label>
        <Input
          type="text"
          placeholder="asia-cup-final-team-india-victory"
          id="slug"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white font-mono text-xs"
          value={formData.slug || ""}
          onChange={(e) =>
            setFormData({ ...formData, slug: e.target.value })
          }
        />
        <span className="text-[10px] text-blue-600">
          Preview: http://localhost:5173/{formData.slug || "custom-slug-here"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="metaTitle" className="text-xs font-semibold text-gray-700">
          SEO Meta Title
        </label>
        <Input
          type="text"
          placeholder="e.g. Breaking: Major News Event | News18 India"
          id="metaTitle"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.metaTitle || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaTitle: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="metaDescription" className="text-xs font-semibold text-gray-700">
          SEO Meta Description
        </label>
        <textarea
          placeholder="Provide a search-engine friendly summary of this article..."
          id="metaDescription"
          className="w-full min-h-[80px] p-3 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-slate-400 bg-white"
          value={formData.metaDescription || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="keywords" className="text-xs font-semibold text-gray-700">
          SEO Keywords
        </label>
        <Input
          type="text"
          placeholder="e.g. politics, india, breaking news"
          id="keywords"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.keywords || ""}
          onChange={(e) =>
            setFormData({ ...formData, keywords: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="canonicalUrl" className="text-xs font-semibold text-gray-700">
          Canonical URL
        </label>
        <Input
          type="url"
          placeholder="https://example.com/canonical-url"
          id="canonicalUrl"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.canonicalUrl || ""}
          onChange={(e) =>
            setFormData({ ...formData, canonicalUrl: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="schemaScript" className="text-xs font-semibold text-gray-700">
          LD-JSON Schema Script
        </label>
        <textarea
          placeholder='{"@context": "https://schema.org", ...}'
          id="schemaScript"
          className="w-full min-h-[120px] p-3 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-slate-400 bg-white font-mono"
          value={formData.schemaScript || ""}
          onChange={(e) =>
            setFormData({ ...formData, schemaScript: e.target.value })
          }
        />
      </div>
    </div>
  )
}

export default PostSEOMetaFields
