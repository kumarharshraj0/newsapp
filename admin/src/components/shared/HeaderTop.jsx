import React from "react"
import { Link } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const HeaderTop = ({
  logo,
  searchTerm,
  setSearchTerm,
  handleSubmit,
  currentUser,
  handleSignout,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 shadow-sm w-full">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-4">
        {/* Newpulse Styled Logo */}
        <Link to="/" className="transition-transform duration-200 hover:scale-[1.02]">
          <div className="flex items-center select-none">
            <img src="/logo.svg" alt="New Pulse Logo" className="h-10 md:h-12 object-contain" />
          </div>
        </Link>

        {/* Search form */}
        <form
          className="w-full md:max-w-md bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex items-center transition-all focus-within:bg-white focus-within:shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search news, topics, articles..."
            className="focus:outline-none bg-transparent w-full text-sm text-gray-800 placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="p-1 hover:text-red-600 transition-colors">
            <FaSearch className="text-gray-600 text-base" />
          </button>
        </form>

        {/* User Sign In / Profile dropdown */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer border-2 border-[#0A2240] rounded-full p-0.5 hover:shadow-md transition-shadow">
                  <img
                    src={currentUser.profilePicture}
                    alt="user profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56 mt-2 border border-gray-200 shadow-xl" align="end">
                <DropdownMenuLabel className="font-bold text-gray-800">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="block py-2 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">@{currentUser.username}</span>
                    <span className="text-xs text-gray-500">{currentUser.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold">
                  <Link to="/dashboard?tab=profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold text-red-600">
                      <Link to="/dashboard?tab=categories" className="w-full">Manage Categories</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold text-red-600">
                      <Link to="/create-post" className="w-full">Create Post</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-50 text-red-600 font-semibold"
                  onClick={handleSignout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button className="bg-[#0A2240] hover:bg-[#E1261C] text-white px-5 rounded-full font-bold transition-all text-sm h-9 shadow-md">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderTop
