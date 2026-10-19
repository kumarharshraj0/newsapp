import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PostImageUpload = ({
  setFile,
  handleUploadImage,
  imageUploading,
  imageUploadError,
  imageUrl,
  handleRemoveImage,
  formData = {},
  setFormData = () => {},
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        📷 Main Cover Image & Image SEO
      </span>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-2 border-dashed border-slate-300 rounded-lg p-3 bg-white">
        <Input
          type="file"
          accept="image/*"
          className="cursor-pointer file:cursor-pointer file:text-sm file:font-semibold"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Button
          type="button"
          className="bg-[#0A2240] hover:bg-slate-800 text-white font-bold whitespace-nowrap w-full sm:w-auto"
          onClick={handleUploadImage}
          disabled={imageUploading}
        >
          {imageUploading ? "Uploading..." : "Upload Cover Image"}
        </Button>
      </div>

      {imageUploadError && <p className="text-red-600 text-sm font-medium">{imageUploadError}</p>}

      {imageUrl && (
        <div className="relative group rounded-lg overflow-hidden border border-slate-300 shadow">
          <img
            src={imageUrl}
            alt={formData.imageAlt || "upload preview"}
            className="w-full h-72 object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1.5 text-xs font-bold rounded shadow hover:bg-red-700 transition"
          >
            Remove Image
          </button>
        </div>
      )}

      {/* Cover Image SEO Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Image Alt Text <span className="text-red-500 font-bold">*</span></span>
            <span className="text-[10px] text-blue-600 font-medium">Google Discover</span>
          </label>
          <Input
            type="text"
            placeholder="e.g. Descriptive keywords for Google Images"
            value={formData.imageAlt || ""}
            onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
            className="bg-white text-sm"
          />
          <span className="text-[11px] text-slate-500">
            Crucial keyword for Google Discover large card rendering.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Image Caption / Photo Credit</span>
            <span className="text-[10px] text-emerald-600 font-medium">Credit Source</span>
          </label>
          <Input
            type="text"
            placeholder="e.g. Photo: Reuters / PTI / John Doe"
            value={formData.imageCaption || ""}
            onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
            className="bg-white text-sm"
          />
          <span className="text-[11px] text-slate-500">
            Appears below the main photo on the single article page.
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostImageUpload
