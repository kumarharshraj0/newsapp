import React from "react"

export const CardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col w-full shadow-sm animate-pulse mx-auto">
      {/* Cover Image Placeholder */}
      <div className="h-48 w-full bg-gray-200 relative">
        <div className="absolute bottom-3 left-3 bg-gray-300 h-4 w-20 rounded-md"></div>
      </div>

      {/* Card Body Placeholder */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Date Placeholder */}
        <div className="bg-gray-200 h-3 w-24 rounded-md"></div>

        {/* Title Placeholder */}
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 w-full rounded-md"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded-md"></div>
        </div>

        {/* Content Placeholder */}
        <div className="space-y-2 mb-4">
          <div className="bg-gray-200 h-3 w-full rounded-md"></div>
          <div className="bg-gray-200 h-3 w-full rounded-md"></div>
          <div className="bg-gray-200 h-3 w-2/3 rounded-md"></div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-auto bg-gray-200 h-9 w-full rounded-md"></div>
      </div>
    </div>
  )
}

export const FeaturedSkeleton = () => {
  return (
    <div className="lg:col-span-2 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
      {/* Image Placeholder */}
      <div className="aspect-video bg-gray-200 relative">
        <div className="absolute top-4 left-4 bg-gray-300 h-5 w-24 rounded"></div>
      </div>
      
      {/* Body Placeholder */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Meta Placeholder */}
        <div className="flex gap-2">
          <div className="bg-gray-300 h-3 w-16 rounded"></div>
          <div className="bg-gray-300 h-3 w-24 rounded"></div>
        </div>

        {/* Headline Placeholder */}
        <div className="space-y-2">
          <div className="bg-gray-200 h-7 w-full rounded"></div>
          <div className="bg-gray-200 h-7 w-3/4 rounded"></div>
        </div>

        {/* Content Placeholder */}
        <div className="space-y-2 mb-6">
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
        </div>

        {/* Button Placeholder */}
        <div className="mt-auto bg-gray-300 h-10 w-40 rounded-full"></div>
      </div>
    </div>
  )
}

export const TrendingSkeleton = () => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-pulse h-full">
      {/* Title Placeholder */}
      <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-200">
        <div className="bg-gray-350 h-5 w-5 rounded-full"></div>
        <div className="bg-gray-300 h-5 w-40 rounded"></div>
      </div>
      
      {/* Feed Placeholder */}
      <div className="flex flex-col gap-6 flex-1 justify-between">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex gap-4 pb-5 border-b border-gray-200 last:border-b-0 last:pb-0 items-start">
            <div className="bg-gray-300 h-7 w-7 rounded shrink-0"></div>
            <div className="flex flex-col flex-1 gap-2">
              <div className="bg-gray-300 h-3 w-16 rounded"></div>
              <div className="bg-gray-200 h-4 w-full rounded"></div>
              <div className="bg-gray-250 h-3 w-24 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const PostDetailsSkeleton = () => {
  return (
    <main className="p-4 md:p-6 max-w-5xl mx-auto min-h-screen animate-pulse gap-6 flex flex-col">
      {/* Breadcrumb Placeholder */}
      <div className="bg-gray-200 h-4 w-48 rounded"></div>

      {/* Category Badge Placeholder */}
      <div className="bg-gray-300 h-6 w-24 rounded-md"></div>

      {/* Title Placeholder */}
      <div className="space-y-3">
        <div className="bg-gray-200 h-9 md:h-12 w-full rounded"></div>
        <div className="bg-gray-200 h-9 md:h-12 w-5/6 rounded"></div>
      </div>

      {/* Author and Date Placeholder */}
      <div className="flex gap-4 py-4 border-y border-gray-200">
        <div className="bg-gray-250 h-10 w-10 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="bg-gray-200 h-4 w-28 rounded"></div>
          <div className="bg-gray-200 h-3 w-20 rounded"></div>
        </div>
      </div>

      {/* Cover Image Placeholder */}
      <div className="bg-gray-200 w-full aspect-video rounded-lg"></div>

      {/* Content Paragraphs Placeholder */}
      <div className="space-y-4 py-4">
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-11/12 rounded"></div>
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
      </div>
    </main>
  )
}
