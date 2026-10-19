import React, { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchPostBySlug, fetchRecentPosts, likePost, clearCurrentPost } from "@/redux/posts/postsSlice"
import { Helmet } from "react-helmet-async"
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

  const rawTitle = post ? (post.metaTitle || post.seoTitle || post.title || "") : ""
  const title = rawTitle.replace(/^[•\s\-\*|:]+/, "").trim()
  const description = post ? (post.metaDescription || post.seoDescription || "") : ""
  const keywords = post?.keywords || ""
  const canonicalUrl = post?.canonicalUrl || `https://newpulse.in/post/${post?.slug || postSlug}`
  const rawRobots = (post?.metaRobots || "").trim()
  const metaRobots = (!rawRobots || (!rawRobots.toLowerCase().includes("index") && !rawRobots.toLowerCase().includes("noindex")))
    ? "index, follow, max-image-preview:large"
    : rawRobots
  const imageUrl = post?.image || ""
  const imageAlt = post?.imageAlt || title
  const publishedTime = post?.createdAt ? new Date(post.createdAt).toISOString() : ""
  const modifiedTime = post ? new Date(post.updatedAt || post.createdAt).toISOString() : ""
  const schemaScript = post?.schemaScript
    ? post.schemaScript.replace(/<\/?script[^>]*>/gi, "").trim()
    : ""

  const autoNewsArticleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": title,
    "description": description,
    "image": imageUrl ? [imageUrl] : ["https://newpulse.in/rectangular-logo.png"],
    "datePublished": publishedTime || new Date().toISOString(),
    "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": author?.username || "Editorial Team",
      "url": author?._id ? `https://newpulse.in/publisher/${author._id}` : "https://newpulse.in"
    }],
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Newpulse",
      "url": "https://newpulse.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://newpulse.in/rectangular-logo.png"
      }
    },
    "articleSection": post?.category || "News",
    "keywords": keywords || (post?.tags ? post.tags.join(", ") : "")
  })

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://newpulse.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post?.category || "News",
        "item": `https://newpulse.in/news/${post?.category || "all"}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": canonicalUrl
      }
    ]
  })

  if (loading || !post) {
    return <PostDetailsSkeleton />
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <Helmet>
        {title && <title>{title} | Newpulse</title>}
        {metaRobots && <meta name="robots" content={metaRobots} />}
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph Tags for Social Crawlers */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Newpulse" />
        {title && <meta property="og:title" content={`${title} | Newpulse`} />}
        {description && <meta property="og:description" content={description} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {imageUrl && <meta property="og:image:secure_url" content={imageUrl} />}
        {imageUrl && <meta property="og:image:width" content="1200" />}
        {imageUrl && <meta property="og:image:height" content="675" />}
        {imageUrl && imageAlt && <meta property="og:image:alt" content={imageAlt} />}
        {publishedTime && <meta property="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        {post?.category && <meta property="article:section" content={post.category} />}
        {post?.tags && post.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        {imageUrl && <meta name="twitter:card" content="summary_large_image" />}
        {title && <meta name="twitter:title" content={`${title} | Newpulse`} />}
        {description && <meta name="twitter:description" content={description} />}
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        {imageUrl && imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

        {/* Dynamic & Fallback JSON-LD NewsArticle Schema */}
        <script type="application/ld+json">
          {schemaScript || autoNewsArticleSchema}
        </script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {breadcrumbSchema}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <PostHeader post={post} author={author} currentUser={currentUser} onLike={handleLike} />
        <PostContent post={post} />

        {/* Clickable Article Tags & Topics Badges */}
        {post.tags && post.tags.length > 0 && (
          <div className="my-8 pt-6 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Related Topics & Tags
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <Link
                  key={idx}
                  to={`/search?searchTerm=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 hover:bg-[#E1261C] hover:text-white transition-all shadow-sm border border-slate-200 hover:border-[#E1261C]"
                >
                  <span className="text-red-500 hover:text-white">#</span>
                  <span>{tag}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <RelatedStories recentArticles={recentPosts} />
    </main>
  )
}

export default PostDetails
