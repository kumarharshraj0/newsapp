import React, { memo } from "react"
import PostCard from "@/components/shared/PostCard"

const RelatedStories = memo(({ recentArticles }) => {
  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2.5 h-6 bg-[#E1261C] inline-block"></span>
        <h3 className="text-lg md:text-xl font-black text-[#0A2240] capitalize tracking-tight">Related Stories</h3>
      </div>
      {recentArticles && recentArticles.length > 0 ? (
        <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x snap-mandatory">
          {recentArticles.map((article) => (
            <div key={article._id} className="min-w-[280px] max-w-[300px] md:min-w-0 md:max-w-none shrink-0 md:shrink snap-start flex">
              <PostCard post={article} />
            </div>
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
