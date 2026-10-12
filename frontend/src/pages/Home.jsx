import React, { useEffect, useMemo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchHomePosts, fetchCategories } from "@/redux/posts/postsSlice"
import usePageSEO from "@/hooks/usePageSEO"
import HeroSection from "@/components/shared/HeroSection"

// Lazy load below-the-fold component to reduce main thread execution time during FCP/LCP
const CategorySections = React.lazy(() => import("@/components/shared/CategorySections"))

const Home = () => {
  const dispatch = useDispatch()
  const { homePosts, homeLoading, categories } = useSelector((state) => state.posts)
  const { selectedLanguage } = useSelector((state) => state.language)

  usePageSEO("home", {
    title: "News Pulse: Latest News, Breaking News, Global News",
    description: "Read the latest news headlines and live updates on News Pulse.",
    keywords: "news pulse, news, breaking news, politics news, sports news, global news",
  })

  useEffect(() => {
    dispatch(fetchHomePosts({ language: selectedLanguage }))
  }, [dispatch, selectedLanguage])

  // Dispatch once — thunk checks if categories are already in Redux before fetching
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // useCallback: stable reference — avoids HeroSection receiving new function identity on every render
  const getCategoryName = useCallback(
    (slug) => {
      const cat = categories.find(c => c.slug === slug)
      return cat ? cat.name : "News"
    },
    [categories]
  )

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {!homeLoading && homePosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="text-lg font-semibold">No news articles available. Run the seeding script to populate the database!</p>
          </div>
        ) : (
          <>
            <HeroSection posts={homePosts} loading={homeLoading} getCategoryName={getCategoryName} />
            <React.Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse my-8"></div>}>
              <CategorySections categories={categories} posts={homePosts} loading={homeLoading} />
            </React.Suspense>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
