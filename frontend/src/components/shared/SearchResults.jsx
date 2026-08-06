import React, { memo, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import PostCard from "@/components/shared/PostCard"
import { CardSkeleton } from "@/components/shared/Skeletons"

const SearchResults = memo(({ posts, loading, totalPosts, currentPage, onPageChange }) => {
  const limit = 8
  // useMemo: totalPages only recalculates when totalPosts changes
  const totalPages = useMemo(() => Math.ceil(totalPosts / limit), [totalPosts])
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages])

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-slate-700 p-3 mt-5">News Articles:</h1>
      <Separator className="bg-slate-300" />

      <div className="p-7">
        {!loading && posts.length === 0 && (
          <p className="text-xl text-gray-500">No posts found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : posts.map((post) => <PostCard key={post._id} post={post} />)
          }
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center flex-wrap gap-2 mt-8 py-4">
            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1} className="font-bold border border-gray-300">Previous</Button>

            {pageNumbers.map((pageNum) => (
              <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`font-bold ${currentPage === pageNum ? "bg-[#0A2240] hover:bg-[#0A2240] text-white" : "border border-gray-300 text-gray-700 hover:bg-[#E1261C] hover:text-white"}`}>
                {pageNum}
              </Button>
            ))}

            <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages} className="font-bold border border-gray-300">Next</Button>
          </div>
        )}
      </div>
    </div>
  )
})

SearchResults.displayName = "SearchResults"

export default SearchResults
