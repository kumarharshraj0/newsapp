import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchTickerPosts } from "@/redux/posts/postsSlice"

const BreakingTicker = () => {
  const dispatch = useDispatch()
  const { tickerPosts, homePosts } = useSelector((state) => state.posts)

  // Use homePosts if available to save a network request, otherwise use tickerPosts
  const displayPosts = homePosts?.length >= 5 ? homePosts.slice(0, 5) : tickerPosts

  useEffect(() => {
    // Only fetch if we don't have enough posts in homePosts
    if (!homePosts || homePosts.length < 5) {
      dispatch(fetchTickerPosts())
    }
  }, [dispatch, homePosts])

  return (
    <div className="flex w-full bg-[#E1261C] items-center h-9 overflow-hidden shadow-sm">
      <div className="bg-black text-white text-xs font-black uppercase px-4 h-full flex items-center select-none tracking-widest border-r border-[#E1261C] z-10 shrink-0">
        Breaking
      </div>
      <div className="w-full overflow-hidden bg-[#E1261C] text-white text-xs font-bold py-1 select-none flex items-center h-full">
        <div className="animate-marquee cursor-pointer h-full flex items-center">
          {displayPosts.length > 0 ? (
            <>
              {/* Double the content for smooth infinite scrolling */}
              <div className="flex shrink-0">
                {displayPosts.map((news) => (
                  <span key={news._id} className="pr-8 shrink-0 flex items-center">
                    <Link to={`/post/${news.slug}`} className="hover:underline flex items-center">
                      <span className="mr-2">🔴</span> {news.title}
                    </Link>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0" aria-hidden="true">
                {displayPosts.map((news) => (
                  <span key={`${news._id}-dup`} className="pr-8 shrink-0 flex items-center">
                    <Link to={`/post/${news.slug}`} className="hover:underline flex items-center" tabIndex={-1}>
                      <span className="mr-2">🔴</span> {news.title}
                    </Link>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <span className="flex items-center"><span className="mr-2">🔴</span> Loading latest news...</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreakingTicker
