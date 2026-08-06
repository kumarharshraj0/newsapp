import React from "react"
import { Link } from "react-router-dom"
import moment from "moment"
import { getPostUrl } from "@/lib/utils"

const PostCard = ({ post }) => {
  // Utility to strip HTML tags from content preview
  const plainTextContent = post.content
    ? post.content.replace(/<[^>]*>/g, "")
    : ""

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden flex flex-col w-full shadow-sm hover:shadow-md transition-all duration-300 mx-auto">
      
      {/* Cover Image with Category Badge */}
      <Link
        to={getPostUrl(post)}
        className="block relative h-48 w-full overflow-hidden bg-gray-100"
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 bg-[#E1261C] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow">
          {post.category === "worldnews" && "World"}
          {post.category === "sportsnews" && "Sports"}
          {post.category === "localnews" && "Local"}
          {!["worldnews", "sportsnews", "localnews"].includes(post.category) && post.category}
          {post.subcategory && ` / ${post.subcategory}`}
        </span>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Date and Reading Metadata */}
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {moment(post.createdAt).format("MMMM DD, YYYY")}
        </div>

        {/* Title / Headline */}
        <Link to={getPostUrl(post)}>
          <h4 className="card-headline text-base leading-snug hover:text-[#E1261C] transition-colors line-clamp-2">
            {post.title}
          </h4>
        </Link>

        {/* Text Snippet */}
        <p className="text-xs text-gray-500 line-clamp-3 mb-4">
          {plainTextContent}
        </p>

        {/* Read More button */}
        <Link
          to={getPostUrl(post)}
          className="mt-auto inline-flex items-center justify-center border border-gray-300 hover:border-[#E1261C] hover:bg-[#E1261C] text-xs font-black text-gray-700 hover:text-white text-center py-2.5 rounded-md transition-all duration-200 uppercase tracking-widest"
        >
          Read Article
        </Link>
      </div>

    </div>
  )
}

export default PostCard
