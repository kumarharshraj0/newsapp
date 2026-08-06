import React from "react"
import DashboardSidebar from "./DashboardSidebar"
import BottomNavBar from "./BottomNavBar"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full items-start">
      {/* Sidebar - desktop */}
      <div className="hidden md:block sticky top-0 h-screen overflow-y-auto z-10 shrink-0">
        <DashboardSidebar />
      </div>

      {/* Bottom nav - mobile */}
      <BottomNavBar />

      {/* Main content */}
      <div className="w-full flex-1 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
