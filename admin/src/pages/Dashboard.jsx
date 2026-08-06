import DashboardComments from "@/components/shared/DashboardComments"
import DashboardPosts from "@/components/shared/DashboardPosts"
import DashboardProfile from "@/components/shared/DashboardProfile"
import DashboardUsers from "@/components/shared/DashboardUsers"
import MainDashboard from "@/components/shared/MainDashboard"
import DashboardCategories from "@/components/shared/DashboardCategories"
import DashboardPages from "@/components/shared/DashboardPages"
import DashboardSEO from "@/components/shared/DashboardSEO"
import DashboardSettings from "@/components/shared/DashboardSettings"
import DashboardFooterSettings from "@/components/shared/DashboardFooterSettings"
import DashboardTags from "@/components/shared/DashboardTags"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")

    if (tabFromUrl) {
      setTab(tabFromUrl)
    } else {
      setTab("dashboard")
    }
  }, [location.search])

  return (
    <div className="w-full">
      {tab === "profile" && <DashboardProfile />}
      {tab === "posts" && <DashboardPosts />}
      {tab === "users" && <DashboardUsers />}
      {tab === "comments" && <DashboardComments />}
      {tab === "categories" && <DashboardCategories />}
      {tab === "pages" && <DashboardPages />}
      {tab === "seo" && <DashboardSEO />}
      {tab === "settings" && <DashboardSettings />}
      {tab === "footersettings" && <DashboardFooterSettings />}
      {tab === "tags" && <DashboardTags />}
      {tab === "dashboard" && <MainDashboard />}
    </div>
  )
}

export default Dashboard
