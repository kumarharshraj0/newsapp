import React, { memo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getPostUrl, formatDate } from "@/lib/utils"
import OptimizedImage from "@/components/shared/OptimizedImage"
import { Translate } from "@/hooks/useTranslation"
import { useSelector } from "react-redux"
import { useSettings } from "@/contexts/SettingsContext"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa"
import axios from "axios"

const PopularPostsSidebar = memo(({ posts }) => {
  const { selectedLanguage } = useSelector((state) => state.language)
  const { settings } = useSettings()
  const [activeTab, setActiveTab] = useState("week") // 'week' | 'month' | 'all'
  const [popularPosts, setPopularPosts] = useState([])
  const [loadingPopular, setLoadingPopular] = useState(false)

  // Fetch popular posts from backend based on activeTab and language
  useEffect(() => {
    let isMounted = true
    const fetchPopular = async () => {
      setLoadingPopular(true)
      try {
        const langParam = selectedLanguage && selectedLanguage !== "all" ? `&language=${selectedLanguage}` : ""
        const res = await axios.get(
          `/api/post/getposts?timeframe=${activeTab}&sort=popular&limit=5${langParam}`
        )
        if (isMounted && res.data && res.data.posts) {
          setPopularPosts(res.data.posts)
        }
      } catch (err) {
        console.error("Failed to fetch popular posts:", err)
      } finally {
        if (isMounted) setLoadingPopular(false)
      }
    }
    fetchPopular()
    return () => {
      isMounted = false
    }
  }, [activeTab, selectedLanguage])

  // Fallback to prop posts if backend returns empty list (e.g. if newly created or no posts in this week)
  const displayPopularList = popularPosts.length > 0 ? popularPosts : (posts || []).slice(0, 5)
  const recommendedList = (posts || []).slice(5, 9)

  // Social Links configured from Admin Panel
  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: settings?.social_facebook || "https://facebook.com",
      bgClass: "bg-[#3b5998] hover:bg-[#2d4373]",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      url: settings?.social_twitter || "https://twitter.com",
      bgClass: "bg-[#1da1f2] hover:bg-[#0c85d0]",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: settings?.social_instagram || "https://instagram.com",
      bgClass: "bg-[#125688] hover:bg-[#0c3d61]",
    },
    {
      name: "Linkedin",
      icon: FaLinkedinIn,
      url: settings?.social_linkedin || "https://linkedin.com",
      bgClass: "bg-[#0077b5] hover:bg-[#005582]",
    },
    {
      name: "Youtube",
      icon: FaYoutube,
      url: settings?.social_youtube || "https://youtube.com",
      bgClass: "bg-[#cd201f] hover:bg-[#a81413]",
      fullWidth: true,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Join Us / Channel Banner (Top sidebar) */}
      <div className="bg-gradient-to-b from-[#0e274a] to-[#061426] rounded-lg p-5 text-center text-white relative overflow-hidden shadow-sm border border-slate-200">
        <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
          <img
            src="/logo-circle.svg"
            alt="New Pulse Logo"
            className="w-full h-full object-contain drop-shadow-md transition-transform hover:scale-105 duration-300"
          />
        </div>
        <p className="text-xs font-medium text-blue-100 mb-3">स्वतंत्र पत्रकार साथियों की जरूरत है</p>
        <Link
          to="/page/about-us"
          className="inline-block bg-white hover:bg-gray-100 text-[#0A2240] text-xs font-bold px-4 py-1.5 rounded shadow-sm transition-all active:scale-95"
        >
          आज ही जुड़ें
        </Link>
      </div>

      {/* 2. POPULAR POSTS Widget */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Header */}
        <div className="bg-[#111827] text-white px-4 py-2.5 -mx-4 -mt-4 rounded-t-lg mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-wider capitalize">
            <Translate text="Popular Posts" language={selectedLanguage} />
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4 text-xs font-bold text-gray-500">
          <button
            type="button"
            onClick={() => setActiveTab("week")}
            className={`transition-colors pb-1 border-b-2 -mb-3 ${
              activeTab === "week"
                ? "text-[#E1261C] border-[#E1261C]"
                : "border-transparent hover:text-gray-900"
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("month")}
            className={`transition-colors pb-1 border-b-2 -mb-3 ${
              activeTab === "month"
                ? "text-[#E1261C] border-[#E1261C]"
                : "border-transparent hover:text-gray-900"
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`transition-colors pb-1 border-b-2 -mb-3 ${
              activeTab === "all"
                ? "text-[#E1261C] border-[#E1261C]"
                : "border-transparent hover:text-gray-900"
            }`}
          >
            All Time
          </button>
        </div>

        {/* Post Items */}
        <div className="flex flex-col divide-y divide-gray-100 min-h-[160px]">
          {loadingPopular ? (
            <div className="py-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#E1261C]"></div>
            </div>
          ) : (
            displayPopularList.map((post) => (
              <div key={post._id} className="py-3 first:pt-0 last:pb-0 flex gap-3 items-center group">
                <Link to={getPostUrl(post)} className="shrink-0 w-20 h-16 rounded overflow-hidden bg-gray-100 block">
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={getPostUrl(post)}>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-[#E1261C] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </Link>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                    <span>{formatDate(post.createdAt, "short")}</span>
                    {post.numberOfLikes > 0 && (
                      <span>• {post.numberOfLikes} likes</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. FOLLOW US Widget */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="bg-[#111827] text-white px-4 py-2.5 -mx-4 -mt-4 rounded-t-lg mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black tracking-wider capitalize">
            Follow Us
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-white font-bold text-sm shadow-sm transition-all duration-200 ${item.bgClass} ${
                  item.fullWidth ? "col-span-1" : ""
                }`}
              >
                <Icon className="text-base shrink-0" />
                <span className="truncate">{item.name}</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* 4. RECOMMENDED POSTS Widget */}
      {recommendedList.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="bg-[#111827] text-white px-4 py-2.5 -mx-4 -mt-4 rounded-t-lg mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black tracking-wider capitalize">
              <Translate text="Recommended Posts" language={selectedLanguage} />
            </h3>
          </div>

          <div className="flex flex-col divide-y divide-gray-100">
            {recommendedList.map((post) => (
              <div key={post._id} className="py-3 first:pt-0 last:pb-0 flex gap-3 items-center group">
                <Link to={getPostUrl(post)} className="shrink-0 w-20 h-16 rounded overflow-hidden bg-gray-100 block">
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    width={80}
                    height={64}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={getPostUrl(post)}>
                    <h4 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-[#E1261C] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </Link>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                    <span>{formatDate(post.createdAt, "short")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

PopularPostsSidebar.displayName = "PopularPostsSidebar"

export default PopularPostsSidebar

