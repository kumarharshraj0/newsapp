import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PostImageUpload = ({ setFile, handleUploadImage, imageUploading, imageUploadError, imageUrl, handleRemoveImage }) => {
  return (
    <>
      <div className="flex flex-col gap-2 border-2 border-slate-300 border-dashed p-4 rounded bg-slate-50">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">📷 Main Cover Image</span>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Button
            type="button"
            className="bg-[#0A2240] hover:bg-slate-800 text-white font-bold whitespace-nowrap w-full sm:w-auto"
            onClick={handleUploadImage}
          >
            {imageUploading ? "Uploading..." : "Upload Cover Image"}
          </Button>
        </div>
      </div>

      {imageUploadError && <p className="text-red-600 text-sm">{imageUploadError}</p>}

      {imageUrl && (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="upload preview"
            className="w-full h-72 object-cover rounded shadow"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-sm font-bold rounded shadow hover:bg-red-700 opacity-90 transition-opacity"
          >
            Remove Image
          </button>
        </div>
      )}
    </>
  )
}

export default PostImageUpload
