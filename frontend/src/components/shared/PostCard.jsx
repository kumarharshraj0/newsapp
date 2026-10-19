import React, { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import { getPostUrl, formatDate } from "@/lib/utils"
import OptimizedImage from "@/components/shared/OptimizedImage"

const PostCard = memo(({ post }) => {
  // useMemo: regex replace runs only when post.content changes, not on every parent re-render
  const plainTextContent = useMemo(
    () => (post.content ? post.content.replace(/<[^>]*>/g, "") : ""),
    [post.content]
  )

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden flex flex-col w-full shadow-sm hover:shadow-md transition-all duration-300 mx-auto post-card-contain">
      
      {/* Cover Image with Category Badge */}
      <Link
        to={getPostUrl(post)}
        className="block relative w-full aspect-video overflow-hidden bg-gray-100"
      >
        <OptimizedImage
          src={post.image}
          alt={post.title}
          width={420}
          height={248}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          widths={[320, 420, 520]}
          quality={25}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 bg-[#E1261C] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
          {post.category === "worldnews" && "World"}
          {post.category === "sportsnews" && "Sports"}
          {post.category === "localnews" && "Local"}
          {!["worldnews", "sportsnews", "localnews"].includes(post.category) && post.category}
          {post.subcategory && ` / ${post.subcategory}`}
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Date */}
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          {formatDate(post.createdAt)}
        </div>

        {/* Title */}
        <Link to={getPostUrl(post)}>
          <h4 className="card-headline text-lg font-bold leading-snug hover:text-[#E1261C] transition-colors line-clamp-2">
            {post.title}
          </h4>
        </Link>

        {/* Text Snippet */}
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {plainTextContent}
        </p>

        {/* Read More */}
        <Link
          to={getPostUrl(post)}
          className="mt-auto inline-flex items-center justify-center border border-gray-300 hover:border-[#E1261C] hover:bg-[#E1261C] text-sm font-semibold text-gray-700 hover:text-white text-center py-2.5 rounded-full transition-all duration-200 capitalize tracking-wide"
        >
          Read Article
        </Link>
      </div>
    </div>
  )
})

PostCard.displayName = "PostCard"

export default PostCard
