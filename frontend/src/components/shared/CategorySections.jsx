import React, { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import PostCard from "@/components/shared/PostCard"
import ScrollReveal from "@/components/shared/ScrollReveal"
import { CardSkeleton } from "@/components/shared/Skeletons"
import { getCategoryUrl, getPostUrl, formatDate } from "@/lib/utils"
import OptimizedImage from "@/components/shared/OptimizedImage"
import { useSelector } from "react-redux"
import { Translate } from "@/hooks/useTranslation"

const CategorySections = memo(({ categories, posts, loading }) => {
  const { selectedLanguage } = useSelector((state) => state.language)

  // useMemo: build a category→posts lookup map once when posts change
  // avoids re-running .filter() for every category on every render
  const postsByCategory = useMemo(() => {
    const map = {}
    for (const post of posts) {
      if (!map[post.category]) map[post.category] = []
      if (map[post.category].length < 6) map[post.category].push(post)
    }
    return map
  }, [posts])

  if (loading) {
    return Array.from({ length: 2 }).map((_, idx) => (
      <section key={idx} className="mb-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="border-b border-gray-150 pb-3 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-gray-300 inline-block animate-pulse"></span>
            <div className="bg-gray-200 h-5 w-32 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </section>
    ))
  }

  return categories.map((cat, catIdx) => {
    const categoryPosts = postsByCategory[cat.slug] || []
    return (
      <ScrollReveal key={cat._id} animation="animate-on-scroll"
        delay={catIdx === 0 ? "" : catIdx === 1 ? "delay-100" : "delay-200"}
        as="section" className="mb-12 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="border-b border-gray-150 pb-3 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#E1261C] inline-block"></span>
            <h3 className="text-lg md:text-xl font-black text-[#0A2240] uppercase tracking-tight">
              {selectedLanguage === "hindi" && cat.nameHi ? cat.nameHi : <Translate text={cat.name} language={selectedLanguage} />}
            </h3>
          </div>
          <Link to={getCategoryUrl(cat.slug)} className="text-xs font-black text-[#E1261C] hover:underline uppercase tracking-wider">
            <Translate text={"See All " + cat.name} language={selectedLanguage} /> →
          </Link>
        </div>
        {categoryPosts.length > 0 ? (
          catIdx % 2 !== 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryPosts.slice(0, 3).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main Large Post */}
              <div className="flex-1 lg:w-3/5">
                <div className="relative group overflow-hidden rounded-lg h-full min-h-[350px]">
                  <Link to={getPostUrl(categoryPosts[0])} className="block h-full">
                    <OptimizedImage
                      src={categoryPosts[0].image}
                      alt={categoryPosts[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="text-white text-xs font-black uppercase tracking-widest mb-2 bg-[#E1261C] inline-block px-2 py-1 rounded">
                        {cat.name}
                      </div>
                      <h4 className="text-white text-2xl md:text-3xl font-bold leading-snug hover:text-gray-200 transition-colors line-clamp-3">
                        {categoryPosts[0].title}
                      </h4>
                      <div className="text-gray-300 text-sm mt-3 flex items-center gap-2 font-medium">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.8l28.6-39c2.6-3.7 1.8-8.7-1.8-11.1z"></path></svg>
                        {formatDate(categoryPosts[0].createdAt)}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Sidebar Small Posts */}
              {categoryPosts.length > 1 && (
                <div className="w-full lg:w-2/5 flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <h4 className="text-lg font-bold text-[#0A2240] relative after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-200 flex items-center w-full gap-4 whitespace-nowrap">
                      Recent Posts
                    </h4>
                  </div>
                  <div className="flex flex-col gap-5 justify-between h-full">
                    {categoryPosts.slice(1, 6).map((post) => (
                      <div key={post._id} className="flex gap-4 items-center group">
                        {post.image ? (
                          <Link to={getPostUrl(post)} className="shrink-0 relative overflow-hidden rounded">
                            <OptimizedImage
                              src={post.image}
                              alt={post.title}
                              className="w-24 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </Link>
                        ) : (
                          <div className="shrink-0 w-24 h-20 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-gray-400 text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path><path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"></path></svg>
                          </div>
                        )}
                        <div className="flex flex-col justify-center">
                          <Link to={getPostUrl(post)}>
                            <h5 className="text-sm md:text-base font-bold leading-tight text-gray-800 group-hover:text-[#E1261C] transition-colors line-clamp-2 mb-1">
                              {post.title}
                            </h5>
                          </Link>
                          <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.8l28.6-39c2.6-3.7 1.8-8.7-1.8-11.1z"></path></svg>
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <p className="text-sm text-gray-400 italic"><Translate text="No news articles found in this category." language={selectedLanguage} /></p>
        )}
      </ScrollReveal>
    )
  })
})

CategorySections.displayName = "CategorySections"

export default CategorySections
