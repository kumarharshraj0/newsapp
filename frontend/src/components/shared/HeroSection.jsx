import React, { memo, useMemo } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame } from "lucide-react"
import { getPostUrl, formatDate, timeAgo } from "@/lib/utils"
import ScrollReveal from "@/components/shared/ScrollReveal"
import { FeaturedSkeleton, TrendingSkeleton } from "@/components/shared/Skeletons"
import OptimizedImage from "@/components/shared/OptimizedImage"
import { Translate } from "@/hooks/useTranslation"
import { useSelector } from "react-redux"

const HeroSection = memo(({ posts, loading, getCategoryName }) => {
  const { selectedLanguage } = useSelector((state) => state.language)
  // useMemo: only slice when posts array reference changes
  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts])
  const trendingPosts = useMemo(() => posts.slice(3, 7), [posts])
  const [currentSlide, setCurrentSlide] = React.useState(0)

  React.useEffect(() => {
    if (featuredPosts.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredPosts.length])

  const featuredPost = featuredPosts[currentSlide]

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <FeaturedSkeleton />
        <TrendingSkeleton />
      </div>
    )
  }

  if (!posts.length) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {featuredPost && (
        <ScrollReveal animation="animate-slide-left" className="lg:col-span-2 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
          <Link to={getPostUrl(featuredPost)} className="block relative aspect-video overflow-hidden">
            <OptimizedImage
              key={featuredPost._id}
              src={featuredPost.image}
              alt={featuredPost.title}
              priority={true}
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, 66vw"
              widths={[320, 800, 1200]}
              quality={20}
              className="w-full h-full object-cover animate-fade is-visible transition-transform duration-500 hover:scale-105"
            />
            <span className="absolute top-4 left-4 bg-[#E1261C] text-white text-xs font-black capitalize px-3 py-1 rounded shadow-md tracking-wider"><Translate text="Featured" language={selectedLanguage} /></span>
          </Link>
          <div className="p-6 flex flex-col flex-1 pb-10">
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 font-bold">
              <span className="text-[#E1261C] capitalize tracking-wide"><Translate text={getCategoryName(featuredPost.category)} language={selectedLanguage} /></span>
              <span>•</span>
              <span>{formatDate(featuredPost.createdAt, "short")}</span>
            </div>
            <Link to={getPostUrl(featuredPost)}>
              <h2 className="crimson-headline hover:text-[#E1261C] transition-colors mb-4 line-clamp-2">{featuredPost.title}</h2>
            </Link>
            <div className="text-gray-600 text-sm md:text-base mb-6 line-clamp-3 post-content" dangerouslySetInnerHTML={{ __html: featuredPost.content }} />
            <Link to={getPostUrl(featuredPost)} className="mt-auto">
              <Button className="bg-[#0A2240] hover:bg-[#E1261C] text-white px-5 rounded-full font-semibold flex items-center gap-2 h-10 text-xs capitalize tracking-wider">
                <Translate text="Read Full Article" language={selectedLanguage} /> <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Carousel Indicators */}
          {featuredPosts.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {featuredPosts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-[#E1261C]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </ScrollReveal>
      )}

      <ScrollReveal animation="animate-slide-right" delay="delay-200" className="flex flex-col bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-200">
          <Flame className="h-5 w-5 text-[#E1261C]" />
          <h3 className="text-lg font-black text-[#0A2240] capitalize tracking-wide"><Translate text="Trending Headlines" language={selectedLanguage} /></h3>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          {trendingPosts.map((post, idx) => (
            <div key={post._id} className="flex gap-3 pb-5 border-b border-gray-200 last:border-b-0 last:pb-0 items-start">
              <span className="text-3xl font-black text-[#E1261C] w-8 shrink-0 leading-none">{`0${idx + 1}`}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] text-gray-500 font-bold capitalize tracking-wider mb-1"><Translate text={getCategoryName(post.category)} language={selectedLanguage} /></span>
                <Link to={getPostUrl(post)} className="hover:text-[#E1261C] transition-colors">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{post.title}</h4>
                </Link>
                <span className="text-[10px] text-gray-400 mt-1">{timeAgo(post.createdAt)}</span>
              </div>
              <Link to={getPostUrl(post)} className="shrink-0">
                {/* Trending thumbnails: lazy — below featured hero */}
                <OptimizedImage
                  src={post.image}
                  alt={post.title}
                  width={56}
                  height={56}
                  sizes="56px"
                  widths={[56, 112]}
                  quality={20}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 shadow-sm hover:border-[#E1261C] transition-colors duration-200"
                />
              </Link>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
})

HeroSection.displayName = "HeroSection"

export default HeroSection
