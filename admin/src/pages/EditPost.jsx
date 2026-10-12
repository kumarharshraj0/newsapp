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
import { useEditPost } from "@/hooks/useEditPost"
import PostFormFields from "@/components/shared/PostFormFields"
import PostImageUpload from "@/components/shared/PostImageUpload"
import PostSEOMetaFields from "@/components/shared/PostSEOMetaFields"

const EditPost = () => {
  const {
    quillRef,
    formData,
    setFormData,
    categories,
    subcategories,
    updatePostError,
    setFile,
    handleCategoryChange,
    handleUploadImage,
    imageUploading,
    imageUploadError,
    modules,
    handleSubmit,
  } = useEditPost()

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-black text-[#0A2240] border-b-2 border-[#E1261C] pb-2">
        Edit Post
      </h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <PostFormFields formData={formData} setFormData={setFormData} categories={categories}
          subcategories={subcategories} handleCategoryChange={handleCategoryChange} />

        <PostImageUpload setFile={setFile} handleUploadImage={handleUploadImage}
          imageUploading={imageUploading} imageUploadError={imageUploadError} imageUrl={formData.image} 
          handleRemoveImage={() => setFormData({ ...formData, image: "" })} />

        <ReactQuill ref={quillRef} theme="snow" placeholder="Write something here..."
          className="h-72 mb-12" modules={modules} required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content || ""} />

        <PostSEOMetaFields formData={formData} setFormData={setFormData} />

        <Button type="submit" className="h-12 bg-green-600 font-semibold max-sm:mt-5 text-md hover:bg-green-700 text-white">
          Update Your Article
        </Button>

        {updatePostError && <p className="text-red-600 mt-5">{updatePostError}</p>}
      </form>
    </div>
  )
}

export default EditPost
