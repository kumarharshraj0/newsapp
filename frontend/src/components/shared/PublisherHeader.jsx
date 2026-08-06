import React, { memo } from "react"
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa"

const PublisherHeader = memo(({ publisher }) => {
  return (
    <div className="bg-white p-8 rounded shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 mb-8">
      <img
        src={publisher.profilePicture}
        alt={publisher.username}
        loading="lazy"
        decoding="async"
        className="w-32 h-32 rounded-full object-cover border-4 border-[#0A2240]"
      />
      <div className="text-center md:text-left flex-1">
        <h1 className="text-3xl font-black text-[#0A2240] capitalize">{publisher.username}</h1>
        <p className="text-sm text-gray-500 font-semibold mb-2">Member since {new Date(publisher.createdAt).getFullYear()}</p>
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold border border-green-200">
          Verified Publisher
        </span>
      </div>
      
      {publisher.socialLinks && (
        <div className="flex items-center gap-3 mt-4 md:mt-0 md:ml-auto justify-center md:justify-end">
          {publisher.socialLinks.facebook?.url && publisher.socialLinks.facebook?.visible && (
            <a href={publisher.socialLinks.facebook.url} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 p-2.5 rounded-full text-blue-600 hover:text-blue-800 transition-colors shadow-sm border border-blue-100">
              <FaFacebook size={18} />
            </a>
          )}
          {publisher.socialLinks.twitter?.url && publisher.socialLinks.twitter?.visible && (
            <a href={publisher.socialLinks.twitter.url} target="_blank" rel="noopener noreferrer" className="bg-sky-50 hover:bg-sky-100 p-2.5 rounded-full text-sky-500 hover:text-sky-700 transition-colors shadow-sm border border-sky-100">
              <FaTwitter size={18} />
            </a>
          )}
          {publisher.socialLinks.instagram?.url && publisher.socialLinks.instagram?.visible && (
            <a href={publisher.socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="bg-pink-50 hover:bg-pink-100 p-2.5 rounded-full text-pink-600 hover:text-pink-800 transition-colors shadow-sm border border-pink-100">
              <FaInstagram size={18} />
            </a>
          )}
          {publisher.socialLinks.whatsapp?.url && publisher.socialLinks.whatsapp?.visible && (
            <a href={publisher.socialLinks.whatsapp.url} target="_blank" rel="noopener noreferrer" className="bg-green-50 hover:bg-green-100 p-2.5 rounded-full text-green-600 hover:text-green-800 transition-colors shadow-sm border border-green-100">
              <FaWhatsapp size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  )
})

PublisherHeader.displayName = "PublisherHeader"

export default PublisherHeader
