import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const PostImageUpload = ({ setFile, handleUploadImage, imageUploading, imageUploadError, imageUrl, handleRemoveImage }) => {
  return (
    <>
      <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Button
          type="button"
          className="bg-slate-700 hover:bg-slate-800 text-white font-bold"
          onClick={handleUploadImage}
        >
          {imageUploading ? "Uploading..." : "Upload Cover Image"}
        </Button>
      </div>

      {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

      {imageUrl && (
        <div className="relative group">
          <img
            src={imageUrl}
            alt="upload"
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
