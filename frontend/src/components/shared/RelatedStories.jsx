import React, { memo } from "react"
import PostCard from "@/components/shared/PostCard"

const RelatedStories = memo(({ recentArticles }) => {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-6 bg-[#E1261C] inline-block"></span>
        <h3 className="text-lg md:text-xl font-black text-[#0A2240] uppercase tracking-tight">Related Stories</h3>
      </div>
      {recentArticles && recentArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <PostCard key={article._id} post={article} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">No related stories found.</p>
      )}
    </div>
  )
})

RelatedStories.displayName = "RelatedStories"

export default RelatedStories
