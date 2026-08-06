import React, { memo, Suspense, lazy } from "react"
import { Separator } from "@/components/ui/separator"
import OptimizedImage from "@/components/shared/OptimizedImage"

// Lazy load CommentSection — only needed when user scrolls to bottom
const CommentSection = lazy(() => import("@/components/shared/CommentSection"))

const CommentFallback = () => (
  <div className="animate-pulse space-y-4 mt-4">
    <div className="h-20 bg-gray-200 rounded"></div>
    <div className="h-12 bg-gray-200 rounded w-3/4"></div>
  </div>
)

const PostContent = memo(({ post }) => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100 max-h-[550px]">
        <OptimizedImage
          src={post && post.image}
          alt={post && post.title}
          priority={true}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          widths={[640, 800, 1200]}
          className="w-full h-full object-cover"
        />
      </div>

      <div
        className="post-content text-[17px] leading-relaxed text-gray-800"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      <Separator className="my-6 bg-gray-200" />

      {/* Lazy-loaded Comments Section */}
      <Suspense fallback={<CommentFallback />}>
        <CommentSection postId={post?._id} />
      </Suspense>
    </div>
  )
})

PostContent.displayName = "PostContent"

export default PostContent
