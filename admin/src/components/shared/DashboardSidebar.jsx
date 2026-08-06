import { signOutSuccess } from "@/redux/user/userSlice"
import React from "react"
import { FaComments, FaSignOutAlt, FaUserAlt, FaUsers, FaListUl, FaSearch } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { IoIosCreate, IoIosDocument } from "react-icons/io"
import { MdDashboardCustomize } from "react-icons/md"

import axios from "axios";
const DashboardSidebar = () => {
  const dispatch = useDispatch()

  const { currentUser } = useSelector((state) => state.user)

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      })

      const data = res.data;

      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <aside className="h-screen w-64 bg-slate-200 text-slate-800 flex flex-col">
      {/* Logo/ Header */}
      <div className="p-4 flex items-center justify-center bg-slate-200">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=dashboard"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <MdDashboardCustomize className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to={"/dashboard?tab=profile"}
              className="flex items-center p-2 hover:bg-slate-300 rounded"
            >
              <FaUserAlt className="mr-3" />
              <span>Profile</span>
            </Link>
          </li>

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/create-post"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <IoIosCreate className="mr-3" />
                <span>Create Post</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=posts"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <IoIosDocument className="mr-3" />
                <span>Your articles</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=users"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <FaUsers className="mr-3" />
                <span>All Users</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=comments"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <FaComments className="mr-3" />
                <span>All Comments</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=categories"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <FaListUl className="mr-3" />
                <span>Categories</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=tags"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <MdDashboardCustomize className="mr-3" />
                <span>Trending Tags</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=pages"}
                className="flex items-center p-2 hover:bg-slate-300 rounded"
              >
                <IoIosDocument className="mr-3" />
                <span>Pages</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=seo"}
                className="flex items-center p-2 hover:bg-blue-100 text-blue-700 font-semibold rounded"
              >
                <FaSearch className="mr-3" />
                <span>SEO Settings</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=footersettings"}
                className="flex items-center p-2 hover:bg-orange-100 text-orange-700 font-semibold rounded"
              >
                <MdDashboardCustomize className="mr-3" />
                <span>Footer Settings</span>
              </Link>
            </li>
          )}

          {currentUser && currentUser.isAdmin && (
            <li>
              <Link
                to={"/dashboard?tab=settings"}
                className="flex items-center p-2 hover:bg-purple-100 text-purple-700 font-semibold rounded"
              >
                <MdDashboardCustomize className="mr-3" />
                <span>Site Settings (Logo)</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="p-4 border-t border-gray-700">
          <button
            className="flex items-center w-full p-2 hover:bg-slate-300 rounded"
            onClick={handleSignout}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default DashboardSidebar
