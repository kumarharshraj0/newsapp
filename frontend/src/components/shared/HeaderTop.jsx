import React from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLanguage } from "@/redux/language/languageSlice"
import { Globe, LayoutDashboard, PenLine, ShieldCheck, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutSuccess } from "@/redux/user/userSlice"
import { useSettings } from "@/contexts/SettingsContext"

const HeaderTop = ({ searchTerm, setSearchTerm, handleSubmit }) => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { selectedLanguage } = useSelector((state) => state.language)

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" })
      if (res.ok) dispatch(signOutSuccess())
    } catch (error) { console.log(error) }
  }

  return (
    <div className="w-full py-3 md:py-3.5">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-4">
        <Link to="/" className="transition-transform duration-200 hover:scale-[1.02]">
          <div className="flex items-center select-none">
            <img src="/logo.svg" alt="New Pulse Logo" width="180" height="48" className="h-12 md:h-14 w-auto object-contain" fetchPriority="high" />
          </div>
        </Link>

        <form className="w-full md:max-w-md bg-gray-100 border border-gray-300 rounded-full px-4 py-2 flex items-center transition-all focus-within:bg-white focus-within:shadow-md" onSubmit={handleSubmit}>
          <input type="text" placeholder="Search news, topics, articles..." className="focus:outline-none bg-transparent w-full text-sm text-gray-800 placeholder-gray-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="submit" aria-label="Search" className="p-1 hover:text-red-600 transition-colors">
            <Search className="text-gray-600 w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0A2240]/60 rounded-full px-2 py-1 border border-white/20">
            <Globe className="w-3 h-3 text-white/70" />
            {["all", "english", "hindi"].map((lang) => (
              <button key={lang} onClick={() => dispatch(setLanguage(lang))}
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full transition-all ${selectedLanguage === lang ? (lang === "hindi" ? "bg-[#E1261C] text-white" : "bg-white text-[#0A2240]") : "text-white/70 hover:text-white"}`}>
                {lang === "all" ? "All" : lang === "english" ? "EN" : "हि"}
              </button>
            ))}
          </div>



          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer border-2 border-[#0A2240] rounded-full p-0.5 hover:shadow-md transition-shadow">
                  <img src={currentUser.profilePicture} alt="user profile" className="w-9 h-9 rounded-full object-cover" />
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
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold text-[#0A2240]">
                  <Link to="/dashboard?tab=posts" className="w-full flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-blue-600" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold text-[#E1261C]">
                  <Link to="/create-post" className="w-full flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-[#E1261C]" /> Submit Article
                  </Link>
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 font-semibold text-blue-800">
                    <a href={import.meta.env.PROD ? "https://admin.newpulse.in" : "http://localhost:5174"} target="_blank" rel="noreferrer" className="w-full flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Panel
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="cursor-pointer hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2" onClick={handleSignout}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button className="bg-[#0A2240] hover:bg-[#E1261C] text-white px-5 rounded-full font-bold transition-all text-sm h-9 shadow-md">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeaderTop
