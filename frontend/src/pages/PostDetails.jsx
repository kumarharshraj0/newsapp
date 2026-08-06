import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPostBySlug, fetchRecentPosts, likePost, clearCurrentPost } from "@/redux/posts/postsSlice"
import useSEO from "@/hooks/useSEO"
import { PostDetailsSkeleton } from "@/components/shared/Skeletons"
import PostHeader from "@/components/shared/PostHeader"
import PostContent from "@/components/shared/PostContent"
import RelatedStories from "@/components/shared/RelatedStories"
import axios from "axios"

const PostDetails = () => {
  const { postSlug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { currentUser } = useSelector((state) => state.user)
  const { currentPost: post, currentPostLoading: loading, recentPosts } = useSelector((state) => state.posts)
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    dispatch(fetchPostBySlug(postSlug))
    dispatch(fetchRecentPosts(3))
    return () => {
      dispatch(clearCurrentPost())
    }
  }, [postSlug, dispatch])

  useEffect(() => {
    if (post && post.userId) {
      axios.get(`/api/user/${post.userId}`, { validateStatus: () => true })
        .then((res) => {
          if (res.status >= 200 && res.status < 300) {
            setAuthor(res.data)
          }
        })
        .catch(console.error)
    }
  }, [post])

  const handleLike = () => {
    if (!currentUser) {
      navigate("/sign-in")
      return
    }
    dispatch(likePost(post._id))
  }

  const plainTextDescription = post && post.content
    ? post.content.replace(/<[^>]*>/g, "").slice(0, 155) + "..."
    : "Read this article on News18 India."

  useSEO({
    title: post ? (post.metaTitle || post.title) : "Loading Article...",
    description: post ? (post.metaDescription || plainTextDescription) : "",
    keywords: post ? (post.keywords || `${post.category || "news"}, ${post.subcategory || ""}, ${post.title}, news18 india`) : "news18 india",
    ogImage: post?.image,
    ogType: "article",
    schemaScript: post?.schemaScript,
  })

  if (loading || !post) {
    return <PostDetailsSkeleton />
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="max-w-5xl mx-auto">
        <PostHeader post={post} author={author} currentUser={currentUser} onLike={handleLike} />
        <PostContent post={post} />
      </div>
      <RelatedStories recentArticles={recentPosts} />
    </main>
  )
}

export default PostDetails
