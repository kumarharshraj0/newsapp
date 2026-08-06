import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchPublisherPosts, fetchMorePublisherPosts, clearPublisherPosts } from "@/redux/posts/postsSlice"
import PublisherHeader from "@/components/shared/PublisherHeader"

const PublisherProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  const { publisherPosts: posts, publisherPostsLoading: postsLoading, publisherShowMore: showMore } = useSelector((state) => state.posts)
  const [publisher, setPublisher] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sort, setSort] = useState("desc")

  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        setLoading(true)
        const userRes = await axios.get(`/api/user/${id}`, { validateStatus: () => true })
        if (userRes.status === 200) {
          setPublisher(userRes.data)
        } else {
          setError("Publisher not found")
        }
      } catch (err) {
        setError("Publisher not found")
      } finally {
        setLoading(false)
      }
    }
    fetchPublisher()
    return () => {
      dispatch(clearPublisherPosts())
    }
  }, [id, dispatch])

  useEffect(() => {
    if (publisher) {
      dispatch(fetchPublisherPosts({ userId: id, sort, limit: 6 }))
    }
  }, [publisher, sort, id, dispatch])

  const handleShowMore = () => {
    dispatch(fetchMorePublisherPosts({ userId: id, sort, startIndex: posts.length, limit: 6 }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E1261C]"></div>
      </div>
    )
  }

  if (error || !publisher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">{error || "Publisher not found"}</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <PublisherHeader publisher={publisher} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#0A2240] border-b-2 border-[#E1261C] inline-block pb-1">
            Articles by {publisher.username}
          </h2>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
             <span className="text-sm font-bold text-gray-600">Sort By:</span>
             <Select value={sort} onValueChange={(val) => setSort(val)}>
               <SelectTrigger className="w-[180px] bg-white border-gray-300 font-semibold">
                 <SelectValue placeholder="Latest" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="desc">Latest First</SelectItem>
                 <SelectItem value="asc">Oldest First</SelectItem>
               </SelectContent>
             </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {posts.length === 0 && !postsLoading && (
           <p className="text-center text-gray-500 py-10 font-bold">This publisher hasn't published any articles yet.</p>
        )}

        {showMore && posts.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={handleShowMore}
              className="bg-[#0A2240] hover:bg-[#E1261C] text-white font-black px-8 py-2 rounded uppercase tracking-wider"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublisherProfile
