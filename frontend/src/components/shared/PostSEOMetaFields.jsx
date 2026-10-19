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
        <span className="text-[10px] text-blue-600 font-mono">
          Preview: https://newpulse.in/post/{formData.slug || "article-slug"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="metaTitle" className="text-xs font-semibold text-gray-700 flex justify-between">
          <span>SEO Meta Title</span>
          <span className={`text-[11px] ${(formData.metaTitle?.length || 0) > 60 ? "text-amber-600 font-bold" : "text-gray-500"}`}>
            {formData.metaTitle?.length || 0} / 60 chars (Optimal 50-60)
          </span>
        </label>
        <Input
          type="text"
          placeholder="e.g. Breaking: Major News Event | Newpulse"
          id="metaTitle"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.metaTitle || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaTitle: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="metaDescription" className="text-xs font-semibold text-gray-700 flex justify-between">
          <span>SEO Meta Description</span>
          <span className={`text-[11px] ${(formData.metaDescription?.length || 0) > 160 ? "text-amber-600 font-bold" : "text-gray-500"}`}>
            {formData.metaDescription?.length || 0} / 160 chars (Optimal 140-160)
          </span>
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
        <label htmlFor="keywords" className="text-xs font-semibold text-gray-700 flex justify-between">
          <span>SEO Keywords (Comma Separated)</span>
          <span className="text-[11px] text-gray-400 font-normal">For Search Crawlers</span>
        </label>
        <Input
          type="text"
          placeholder="e.g. politics, india, breaking news, election 2026"
          id="keywords"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.keywords || ""}
          onChange={(e) =>
            setFormData({ ...formData, keywords: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="canonicalUrl" className="text-xs font-semibold text-gray-700 flex justify-between">
          <span>Canonical URL</span>
          <span className="text-[11px] text-green-600 font-normal">Auto-set to this post if blank (Recommended)</span>
        </label>
        <Input
          type="url"
          placeholder="Leave blank to use default self-canonical"
          id="canonicalUrl"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          value={formData.canonicalUrl || ""}
          onChange={(e) =>
            setFormData({ ...formData, canonicalUrl: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="metaRobots" className="text-xs font-semibold text-gray-700 flex items-center justify-between">
          <span>Robots Meta Tag</span>
          <span className="text-[11px] text-gray-500 font-normal">Required for Google Discover</span>
        </label>
        <Input
          type="text"
          placeholder="index, follow, max-image-preview:large"
          id="metaRobots"
          className="border border-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 bg-white text-xs"
          value={formData.metaRobots || ""}
          onChange={(e) =>
            setFormData({ ...formData, metaRobots: e.target.value })
          }
        />
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, metaRobots: "index, follow, max-image-preview:large" })}
            className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
          >
            Index, Follow (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, metaRobots: "noindex, nofollow" })}
            className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-0.5 rounded transition-colors"
          >
            Noindex, Nofollow
          </button>
        </div>
        {formData.metaRobots && !formData.metaRobots.toLowerCase().includes("index") && (
          <span className="text-[11px] text-red-500 font-medium">
            ⚠️ Warning: Robots tag must be directives like "index, follow, max-image-preview:large". Do NOT enter keywords here (use Keywords field above).
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="schemaScript" className="text-xs font-semibold text-gray-700 flex justify-between">
          <span>Custom LD-JSON Schema Script (Optional)</span>
          <span className="text-[11px] text-green-600 font-normal">Auto-generates Google NewsArticle schema if empty</span>
        </label>
        <textarea
          placeholder='Leave blank for auto Google NewsArticle & Breadcrumb schema, or paste custom {"@context": "https://schema.org", ...}'
          id="schemaScript"
          className="w-full min-h-[100px] p-3 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-slate-400 bg-white font-mono text-xs"
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
