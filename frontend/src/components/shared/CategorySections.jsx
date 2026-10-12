import React, { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import PostCard from "@/components/shared/PostCard"
import ScrollReveal from "@/components/shared/ScrollReveal"
import { CardSkeleton } from "@/components/shared/Skeletons"
import { getCategoryUrl, getPostUrl, formatDate } from "@/lib/utils"
import OptimizedImage from "@/components/shared/OptimizedImage"
import { useSelector } from "react-redux"
import { Translate } from "@/hooks/useTranslation"
import PopularPostsSidebar from "@/components/shared/PopularPostsSidebar"

const CategorySections = memo(({ categories, posts, loading }) => {
  const { selectedLanguage } = useSelector((state) => state.language)

  // useMemo: build a category→posts lookup map once when posts change
  const postsByCategory = useMemo(() => {
    const map = {}
    for (const post of posts) {
      if (!map[post.category]) map[post.category] = []
      if (map[post.category].length < 10) map[post.category].push(post)
    }
    return map
  }, [posts])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 space-y-12">
          {Array.from({ length: 2 }).map((_, idx) => (
            <section key={idx} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="border-b border-gray-150 pb-3 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-gray-300 inline-block animate-pulse"></span>
                  <div className="bg-gray-200 h-5 w-32 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </section>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-96 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
      {/* Left / Center Main Content (matches reference: 2 large cards on top, followed by 2-column small cards) */}
      <div className="lg:col-span-8 flex flex-col gap-12">
        {categories.map((cat, catIdx) => {
          const categoryPosts = postsByCategory[cat.slug] || []
          if (!categoryPosts.length) return null

          const topTwoPosts = categoryPosts.slice(0, 2)
          const remainingPosts = categoryPosts.slice(2, 8)

          return (
            <ScrollReveal
              key={cat._id}
              animation="animate-on-scroll"
              delay={catIdx === 0 ? "" : catIdx === 1 ? "delay-100" : "delay-200"}
              as="section"
              className="bg-white border border-gray-200 rounded-lg p-5 md:p-6 shadow-sm"
            >
              {/* Category Header */}
              <div className="border-b border-gray-150 pb-3 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#E1261C] inline-block"></span>
                  <h3 className="text-lg md:text-xl font-black text-[#0A2240] capitalize tracking-tight">
                    {selectedLanguage === "hindi" && cat.nameHi ? cat.nameHi : <Translate text={cat.name} language={selectedLanguage} />}
                  </h3>
                </div>
                <Link
                  to={getCategoryUrl(cat.slug)}
                  className="text-xs font-black text-[#E1261C] hover:underline capitalize tracking-wider"
                >
                  <Translate text={"See All " + cat.name} language={selectedLanguage} /> →
                </Link>
              </div>

              {/* 1. Top Two Featured Column Cards (Exactly matching screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {topTwoPosts.map((post) => (
                  <div key={post._id} className="flex flex-col group">
                    <Link to={getPostUrl(post)} className="aspect-[16/10] overflow-hidden rounded bg-gray-100 mb-3 block">
                      <OptimizedImage
                        src={post.image}
                        alt={post.title}
                        width={420}
                        height={260}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <Link to={getPostUrl(post)}>
                      <h4 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-[#E1261C] transition-colors line-clamp-2 leading-snug mb-2">
                        {post.title}
                      </h4>
                    </Link>
                    <div className="text-xs text-gray-400 font-medium flex items-center gap-2 mt-auto">
                      <span>{formatDate(post.createdAt, "short")}</span>
                      {post.authorName && <span>• {post.authorName}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Sub-grid with 2 columns of horizontal mini-cards (Matching bottom left & bottom right in screenshot) */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-100">
                  {remainingPosts.map((post) => (
                    <div key={post._id} className="flex gap-3 items-center group">
                      <Link
                        to={getPostUrl(post)}
                        className="shrink-0 w-24 h-18 sm:w-28 sm:h-20 rounded overflow-hidden bg-gray-100 block"
                      >
                        <OptimizedImage
                          src={post.image}
                          alt={post.title}
                          width={112}
                          height={80}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={getPostUrl(post)}>
                          <h5 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E1261C] transition-colors line-clamp-2 leading-snug mb-1">
                            {post.title}
                          </h5>
                        </Link>
                        <div className="text-[11px] text-gray-400 font-medium">
                          {formatDate(post.createdAt, "short")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          )
        })}
      </div>

      {/* Right Sidebar: Banner + Popular Posts Tabs (Matching screenshot right column) */}
      <aside className="lg:col-span-4 sticky top-4">
        <PopularPostsSidebar posts={posts} />
      </aside>
    </div>
  )
})

CategorySections.displayName = "CategorySections"

export default CategorySections

