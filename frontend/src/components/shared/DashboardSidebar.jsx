import { signOutSuccess } from "@/redux/user/userSlice"
import React from "react"
import { FaSignOutAlt, FaUserAlt, FaNewspaper, FaPenSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { MdDashboardCustomize } from "react-icons/md"
import axios from "axios"

const DashboardSidebar = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { currentUser } = useSelector((state) => state.user)

  const urlParams = new URLSearchParams(location.search)
  const currentTab = urlParams.get("tab") || "posts"

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout", {}, { validateStatus: () => true })
      const data = res.data

      if (res.status >= 200 && res.status < 300) {
        dispatch(signOutSuccess())
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-200 flex flex-col shadow-xl">
      {/* Logo/ Header */}
      <div className="p-5 flex items-center justify-center border-b border-slate-800 bg-slate-950">
        <h1 className="text-xl font-black text-white tracking-wider uppercase flex items-center gap-2">
          📊 Dashboard
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 flex flex-col justify-between">
        <ul className="space-y-1.5 font-medium text-sm">
          {currentUser && currentUser.isAdmin && (
            <li>
              <a
                href="http://localhost:5174/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center p-3 hover:bg-red-900/40 rounded-lg text-red-400 font-bold transition-colors"
              >
                <MdDashboardCustomize className="mr-3 text-lg" />
                <span>👑 Admin Panel</span>
              </a>
            </li>
          )}

          <li>
            <Link
              to={"/dashboard?tab=posts"}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                currentTab === "posts"
                  ? "bg-[#E1261C] text-white font-bold"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <FaNewspaper className="mr-3 text-lg" />
              <span>Your Articles</span>
            </Link>
          </li>

          <li>
            <Link
              to={"/create-post"}
              className="flex items-center p-3 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
            >
              <FaPenSquare className="mr-3 text-lg text-green-400" />
              <span>Add Article</span>
            </Link>
          </li>

          <li>
            <Link
              to={"/dashboard?tab=profile"}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                currentTab === "profile"
                  ? "bg-[#E1261C] text-white font-bold"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <FaUserAlt className="mr-3 text-lg" />
              <span>Profile</span>
            </Link>
          </li>
        </ul>

        <div className="pt-4 border-t border-slate-800">
          <button
            className="flex items-center w-full p-3 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors font-bold text-sm"
            onClick={handleSignout}
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default DashboardSidebar
