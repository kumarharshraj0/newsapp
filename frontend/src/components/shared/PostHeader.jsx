import React, { memo } from "react"
import { Link } from "react-router-dom"
import { ThumbsUp, Share2 } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaTelegram } from "react-icons/fa"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { getCategoryUrl } from "@/lib/utils"

const PostHeader = memo(({ post, author, currentUser, onLike }) => {
  return (
    <>
      {/* 1. BREADCRUMBS */}
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-4">
        <Link to="/" className="hover:text-[#E1261C] transition-colors">Home</Link>
        <span>/</span>
        <Link to={getCategoryUrl(post?.category)} className="hover:text-[#E1261C] transition-colors capitalize">
          {post?.category?.replace("news", " News")}
        </Link>
        {post?.subcategory && (
          <>
            <span>/</span>
            <Link to={getCategoryUrl(post?.category, post?.subcategory)} className="hover:text-[#E1261C] transition-colors capitalize">
              {post?.subcategory}
            </Link>
          </>
        )}
      </div>

      {/* 2. CATEGORY BADGE */}
      <Link
        to={getCategoryUrl(post?.category)}
        className="inline-block bg-[#E1261C] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-sm hover:bg-[#0A2240] transition-colors mb-3"
      >
        {post && post.category?.replace("news", " News")}
      </Link>

      {/* 3. HEADLINE */}
      <h1 className="crimson-headline text-left text-3xl md:text-5xl font-extrabold text-[#0A2240] leading-tight mb-4">
        {post && post.title}
      </h1>

      {/* 4. METADATA BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 w-full text-xs text-gray-500 border-y border-gray-200 py-3.5 my-4 bg-gray-50 rounded gap-4">
        {author && (
          <div className="flex items-center gap-3">
            <Link to={`/publisher/${author._id}`} className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded transition-colors">
              <img
                src={author.profilePicture}
                alt={author.username}
                loading="lazy"
                decoding="async"
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[#0A2240] text-sm hover:text-[#E1261C] transition-colors">By {author.username}</span>
                <span className="text-[10px] text-gray-400">
                  Published on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </Link>
            
            {/* Social Links */}
            {author.socialLinks && (
              <div className="flex gap-2 ml-4">
                {author.socialLinks.facebook?.url && author.socialLinks.facebook?.visible && (
                  <a href={author.socialLinks.facebook.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    <FaFacebook size={18} />
                  </a>
                )}
                {author.socialLinks.twitter?.url && author.socialLinks.twitter?.visible && (
                  <a href={author.socialLinks.twitter.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                    <FaTwitter size={18} />
                  </a>
                )}
                {author.socialLinks.instagram?.url && author.socialLinks.instagram?.visible && (
                  <a href={author.socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                    <FaInstagram size={18} />
                  </a>
                )}
                {author.socialLinks.whatsapp?.url && author.socialLinks.whatsapp?.visible && (
                  <a href={author.socialLinks.whatsapp.url} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                    <FaWhatsapp size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        {!author && post && (
          <span className="text-[10px] text-gray-400">
            Published on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={onLike}
            className={`flex items-center gap-1.5 transition-colors font-extrabold px-3 py-1.5 rounded-full border text-xs ${
              currentUser && post?.likes?.includes(currentUser._id) 
                ? "bg-[#E1261C]/5 border-[#E1261C] text-[#E1261C]" 
                : "bg-white border-gray-300 text-gray-600 hover:text-[#E1261C] hover:border-[#E1261C]"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{post?.numberOfLikes || 0} {post?.numberOfLikes === 1 ? "Like" : "Likes"}</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 transition-colors font-extrabold px-3 py-1.5 rounded-full border text-xs bg-white border-gray-300 text-gray-600 hover:text-[#E1261C] hover:border-[#E1261C]">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-md border p-1">
              <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 outline-none">
                <FaFacebook className="text-blue-600" /> Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title)}`, '_blank')} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 outline-none">
                <FaTwitter className="text-blue-400" /> Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(post?.title + " " + window.location.href)}`, '_blank')} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 outline-none">
                <FaWhatsapp className="text-green-500" /> WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title)}`, '_blank')} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-gray-100 outline-none">
                <FaTelegram className="text-blue-500" /> Telegram
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-gray-300">|</span>
          <span className="italic font-bold text-gray-500">
            {post && (post.content.length / 100).toFixed(0)} mins read
          </span>
        </div>
      </div>
    </>
  )
})

PostHeader.displayName = "PostHeader"

export default PostHeader
