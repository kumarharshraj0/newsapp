import { signOutSuccess } from "@/redux/user/userSlice"
import React from "react"
import { FaSignOutAlt, FaUserAlt, FaNewspaper, FaPenSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"

const BottomNavBar = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout", {}, { validateStatus: () => true })
      if (res.status >= 200 && res.status < 300) {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-200 border-t border-slate-800 p-2.5 flex justify-around z-50 shadow-2xl">
      <Link
        to="/dashboard?tab=posts"
        className="flex flex-col items-center text-slate-300 hover:text-white"
      >
        <FaNewspaper size={20} />
        <span className="text-[10px] mt-1 font-semibold">Articles</span>
      </Link>

      <Link
        to="/create-post"
        className="flex flex-col items-center text-green-400 hover:text-green-300"
      >
        <FaPenSquare size={20} />
        <span className="text-[10px] mt-1 font-semibold">Add Post</span>
      </Link>

      <Link
        to="/dashboard?tab=profile"
        className="flex flex-col items-center text-slate-300 hover:text-white"
      >
        <FaUserAlt size={20} />
        <span className="text-[10px] mt-1 font-semibold">Profile</span>
      </Link>

      <button
        className="flex flex-col items-center text-red-400 hover:text-red-300"
        onClick={handleSignout}
      >
        <FaSignOutAlt size={20} />
        <span className="text-[10px] mt-1 font-semibold">Logout</span>
      </button>
    </nav>
  )
}

export default BottomNavBar
