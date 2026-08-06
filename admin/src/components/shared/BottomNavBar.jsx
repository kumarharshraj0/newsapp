import { signOutSuccess } from "@/redux/user/userSlice"
import React from "react"
import { FaHome, FaSignOutAlt, FaUserAlt, FaComments, FaUsers, FaListUl, FaSearch } from "react-icons/fa"
import { IoIosCreate, IoIosDocument } from "react-icons/io"
import { MdDashboardCustomize } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const BottomNavBar = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" })
      if (res.ok) {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-200 border-t border-gray-300 p-2 flex overflow-x-auto gap-6 whitespace-nowrap hide-scrollbar z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <Link to="/dashboard?tab=profile" className="flex flex-col items-center text-slate-800 min-w-[60px]">
        <FaUserAlt size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>

      {currentUser && currentUser.isAdmin && (
        <>
          <Link to="/dashboard?tab=dashboard" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <MdDashboardCustomize size={20} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link to="/create-post" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <IoIosCreate size={20} />
            <span className="text-xs mt-1">Create Post</span>
          </Link>
          <Link to="/dashboard?tab=posts" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <IoIosDocument size={20} />
            <span className="text-xs mt-1">Posts</span>
          </Link>
          <Link to="/dashboard?tab=users" className="flex flex-col items-center text-slate-800 min-w-[60px]">
            <FaUsers size={20} />
            <span className="text-xs mt-1">Users</span>
          </Link>
          <Link to="/dashboard?tab=comments" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <FaComments size={20} />
            <span className="text-xs mt-1">Comments</span>
          </Link>
          <Link to="/dashboard?tab=categories" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <FaListUl size={20} />
            <span className="text-xs mt-1">Categories</span>
          </Link>
          <Link to="/dashboard?tab=tags" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <MdDashboardCustomize size={20} />
            <span className="text-xs mt-1">Tags</span>
          </Link>
          <Link to="/dashboard?tab=pages" className="flex flex-col items-center text-slate-800 min-w-[60px]">
            <IoIosDocument size={20} />
            <span className="text-xs mt-1">Pages</span>
          </Link>
          <Link to="/dashboard?tab=seo" className="flex flex-col items-center text-slate-800 min-w-[60px]">
            <FaSearch size={20} />
            <span className="text-xs mt-1">SEO</span>
          </Link>
          <Link to="/dashboard?tab=footersettings" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <MdDashboardCustomize size={20} />
            <span className="text-xs mt-1">Footer</span>
          </Link>
          <Link to="/dashboard?tab=settings" className="flex flex-col items-center text-slate-800 min-w-[70px]">
            <MdDashboardCustomize size={20} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </>
      )}

      <button className="flex flex-col items-center text-slate-800 min-w-[60px]" onClick={handleSignout}>
        <FaSignOutAlt size={20} />
        <span className="text-xs mt-1">Logout</span>
      </button>
    </nav>
  )
}

export default BottomNavBar
