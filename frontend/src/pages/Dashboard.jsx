import BottomNavBar from "@/components/shared/BottomNavBar"
import DashboardProfile from "@/components/shared/DashboardProfile"
import DashboardSidebar from "@/components/shared/DashboardSidebar"
import DashboardUserPosts from "@/components/shared/DashboardUserPosts"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState("posts")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl) {
      setTab(tabFromUrl)
    } else {
      setTab("posts")
    }
  }, [location.search])

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-slate-50 items-start">
      {/* Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen overflow-y-auto z-10 shrink-0">
        <DashboardSidebar />
      </div>

      <BottomNavBar />

      <div className="w-full flex-1 overflow-x-hidden">
        {/* User Articles */}
        {tab === "posts" && <DashboardUserPosts />}
        {/* User Profile */}
        {tab === "profile" && <DashboardProfile />}
      </div>
    </div>
  )
}

export default Dashboard
