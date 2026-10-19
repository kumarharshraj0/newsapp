import React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
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
    <div className="p-4 max-w-3xl mx-auto min-h-screen my-6">
      <h1 className="text-center text-3xl my-5 font-black text-[#0A2240] border-b-2 border-[#E1261C] pb-2">
        Edit Article
      </h1>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <PostFormFields formData={formData} setFormData={setFormData} categories={categories}
          subcategories={subcategories} handleCategoryChange={handleCategoryChange} />

        <PostImageUpload setFile={setFile} handleUploadImage={handleUploadImage}
          imageUploading={imageUploading} imageUploadError={imageUploadError} imageUrl={formData.image} 
          handleRemoveImage={() => setFormData({ ...formData, image: "" })}
          formData={formData} setFormData={setFormData} />

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            ✍️ Article Content (Use 🖼️ icon in toolbar to add photos inside content)
          </span>
          <ReactQuill ref={quillRef} theme="snow" placeholder="Write article content here..."
            className="h-72 mb-12" modules={modules} required
            onChange={(value) => setFormData({ ...formData, content: value })}
            value={formData.content || ""} />
        </div>

        <PostSEOMetaFields formData={formData} setFormData={setFormData} />

        <Button type="submit" className="h-12 bg-green-600 hover:bg-green-700 text-white font-black text-base uppercase tracking-wider shadow-md mt-4">
          Update Article
        </Button>

        {updatePostError && <p className="text-red-600 font-semibold text-center mt-3">{updatePostError}</p>}
      </form>
    </div>
  )
}

export default EditPost
