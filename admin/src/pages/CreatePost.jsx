import React from "react"
import ReactQuill, { Quill } from "react-quill"
import "react-quill/dist/quill.snow.css"

// Safe Quill 1.x / 2.x Parchment Attributor fix for quill-image-resize-module-react
if (typeof window !== "undefined") {
  window.Quill = Quill
  if (!Quill.imports) Quill.imports = {}
  try {
    const Parchment = Quill.import("parchment")
    if (Parchment && !Parchment.Attributor && Quill.import("attributors")) {
      Parchment.Attributor = Quill.import("attributors")
    }
  } catch (e) {}
}

import ImageResize from "quill-image-resize-module-react"
try {
  Quill.register("modules/imageResize", ImageResize)
} catch (e) {
  console.warn("ImageResize module registration notice:", e)
}
import { Button } from "@/components/ui/button"
import { useCreatePost } from "@/hooks/useCreatePost"
import PostFormFields from "@/components/shared/PostFormFields"
import PostImageUpload from "@/components/shared/PostImageUpload"
import PostSEOMetaFields from "@/components/shared/PostSEOMetaFields"

const CreatePost = () => {
  const {
    quillRef,
    formData,
    setFormData,
    categories,
    subcategories,
    createPostError,
    setFile,
    handleCategoryChange,
    handleUploadImage,
    imageUploading,
    imageUploadError,
    modules,
    handleSubmit,
    hasDraftRestored,
    clearDraft,
  } = useCreatePost()

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-black text-[#0A2240] border-b-2 border-[#E1261C] pb-2">
        Create a Post
      </h1>

      {hasDraftRestored && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg mb-5 flex items-center justify-between text-sm shadow-sm animate-fade">
          <div className="flex items-center gap-2">
            <span>📝</span>
            <span>
              <strong>Draft Restored:</strong> Aapka pichhla unfinished article automatically recover ho gaya hai.
            </span>
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-xs font-bold text-red-600 hover:text-red-800 underline ml-3 shrink-0"
          >
            Discard Draft
          </button>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <PostFormFields formData={formData} setFormData={setFormData} categories={categories}
          subcategories={subcategories} handleCategoryChange={handleCategoryChange} />

        <PostImageUpload setFile={setFile} handleUploadImage={handleUploadImage}
          imageUploading={imageUploading} imageUploadError={imageUploadError} imageUrl={formData.image} 
          handleRemoveImage={() => setFormData({ ...formData, image: "" })} />

        <ReactQuill ref={quillRef} theme="snow" placeholder="Write something here..."
          value={formData.content || ""}
          className="h-72 mb-12" modules={modules} required
          onChange={(value) => setFormData({ ...formData, content: value })} />

        <PostSEOMetaFields formData={formData} setFormData={setFormData} />

        <Button type="submit" className="h-12 bg-green-600 font-semibold max-sm:mt-5 text-md hover:bg-green-700 text-white">
          Publish Article
        </Button>

        {createPostError && <p className="text-red-600 mt-5">{createPostError}</p>}
      </form>
    </div>
  )
}

export default CreatePost
