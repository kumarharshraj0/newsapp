import React, { useState, useEffect, useCallback } from "react"
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

import { registerFigureBlot } from "@/lib/figureBlot"
registerFigureBlot()

import {
  insertTableIntoQuill,
  addRowToTable,
  addColToTable,
  removeRowFromTable,
  removeColFromTable,
  removeEntireTable,
} from "@/lib/quillTable"

import { Button } from "@/components/ui/button"
import { useCreatePost } from "@/hooks/useCreatePost"
import PostFormFields from "@/components/shared/PostFormFields"
import PostImageUpload from "@/components/shared/PostImageUpload"
import PostSEOMetaFields from "@/components/shared/PostSEOMetaFields"
import ArticleLivePreview from "@/components/shared/ArticleLivePreview"
import InsertTableModal from "@/components/shared/InsertTableModal"
import InsertImageModal from "@/components/shared/InsertImageModal"
import { Eye, EyeOff, Table as TableIcon, Plus, Minus, Trash2 } from "lucide-react"

const CreatePost = () => {
  const [showPreview, setShowPreview] = useState(true)
  const [showTableModal, setShowTableModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

  const handleOpenTableModal = useCallback(() => {
    setShowTableModal(true)
  }, [])

  const handleOpenImageModal = useCallback(() => {
    setShowImageModal(true)
  }, [])

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
  } = useCreatePost({
    onOpenTableModal: handleOpenTableModal,
    onOpenImageModal: handleOpenImageModal,
  })

  const handleInsertFigure = ({ src, alt, caption, width, height }) => {
    try {
      const quill = quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current
      if (quill) {
        const range = quill.getSelection(true) || { index: quill.getLength() }
        quill.insertEmbed(range.index, "figure", { src, alt, caption, width, height }, "user")
        quill.insertText(range.index + 1, "\n", "user")
        quill.setSelection(range.index + 2, "silent")
      }
    } catch (e) {
      console.error("Figure insertion error:", e)
    }
  }

  const handleInsertTable = (rows, cols) => {
    try {
      const quill = quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current
      if (quill) {
        insertTableIntoQuill(quill, rows, cols)
      }
    } catch (e) {
      console.error("Table insertion error:", e)
    }
  }

  return (
    <div className="p-4 max-w-[1600px] mx-auto min-h-screen">
      {/* Header with Title and Live Preview Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-6 border-b-2 border-[#E1261C] pb-4">
        <div>
          <h1 className="text-3xl font-black text-[#0A2240]">Create a News Article</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish verified breaking stories with full SEO & Google Discover compliance
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border ${
            showPreview
              ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          {showPreview ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-green-500" />}
          <span>{showPreview ? "Hide Live Preview" : "Show Side-by-Side Preview"}</span>
        </button>
      </div>

      {hasDraftRestored && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between text-sm shadow-sm animate-fade">
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

      {/* Main Grid: Left Editor + Right Sticky Live Preview */}
      <div className={`grid grid-cols-1 ${showPreview ? "xl:grid-cols-12 gap-8" : "max-w-4xl mx-auto"} items-start`}>
        {/* Left Column: Form Editor */}
        <div className={showPreview ? "xl:col-span-7" : "w-full"}>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <PostFormFields
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              subcategories={subcategories}
              handleCategoryChange={handleCategoryChange}
            />

            <PostImageUpload
              setFile={setFile}
              handleUploadImage={handleUploadImage}
              imageUploading={imageUploading}
              imageUploadError={imageUploadError}
              imageUrl={formData.image}
              handleRemoveImage={() => setFormData({ ...formData, image: "" })}
              formData={formData}
              setFormData={setFormData}
            />

            {/* Rich Text Editor with Table Support */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-3 py-2 rounded-t-lg border border-slate-300 border-b-0 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  ✍️ Article Rich Text Editor
                </span>

                {/* Table Quick Controls Bar */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowTableModal(true)}
                    className="bg-white hover:bg-slate-50 text-blue-700 border border-slate-300 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm transition"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Insert Table</span>
                  </button>
                  <button
                    type="button"
                    title="Add Row Below cursor"
                    onClick={() => addRowToTable(quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current)}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 shadow-sm transition"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>Row</span>
                  </button>
                  <button
                    type="button"
                    title="Add Column Right of cursor"
                    onClick={() => addColToTable(quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current)}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 shadow-sm transition"
                  >
                    <Plus className="w-3 h-3 text-emerald-600" />
                    <span>Col</span>
                  </button>
                  <button
                    type="button"
                    title="Delete Current Row"
                    onClick={() => removeRowFromTable(quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current)}
                    className="bg-white hover:bg-red-50 text-red-600 border border-slate-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 shadow-sm transition"
                  >
                    <Minus className="w-3 h-3 text-red-500" />
                    <span>Row</span>
                  </button>
                  <button
                    type="button"
                    title="Delete Current Column"
                    onClick={() => removeColFromTable(quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current)}
                    className="bg-white hover:bg-red-50 text-red-600 border border-slate-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 shadow-sm transition"
                  >
                    <Minus className="w-3 h-3 text-red-500" />
                    <span>Col</span>
                  </button>
                  <button
                    type="button"
                    title="Delete Entire Table"
                    onClick={() => removeEntireTable(quillRef.current?.getEditor ? quillRef.current.getEditor() : quillRef.current)}
                    className="bg-white hover:bg-red-50 text-red-600 border border-slate-300 px-2 py-1 rounded text-xs font-semibold flex items-center gap-0.5 shadow-sm transition"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  placeholder="Draft your story here... Insert photos, format headings, and add data tables..."
                  value={formData.content || ""}
                  className="h-80 mb-14"
                  modules={modules}
                  required
                  onChange={(value) => setFormData({ ...formData, content: value })}
                />
              </div>
            </div>

            <PostSEOMetaFields formData={formData} setFormData={setFormData} />

            <Button
              type="submit"
              className="h-12 bg-green-600 font-bold max-sm:mt-5 text-base hover:bg-green-700 text-white shadow-md transition"
            >
              Publish Article Now
            </Button>

            {createPostError && (
              <p className="text-red-600 font-semibold text-center mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                {createPostError}
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Sticky Side-by-Side Live Preview */}
        {showPreview && (
          <div className="xl:col-span-5 hidden xl:block">
            <ArticleLivePreview formData={formData} />
          </div>
        )}
      </div>

      <InsertTableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onInsert={handleInsertTable}
      />

      <InsertImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={handleInsertFigure}
      />
    </div>
  )
}

export default CreatePost
