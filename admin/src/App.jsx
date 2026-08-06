import React, { Suspense, useEffect } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"
import AdminPrivateRoute from "./components/shared/AdminPrivateRoute"
import AdminLayout from "./components/shared/AdminLayout"
import axios from "axios"

const SignInForm = React.lazy(() => import("./auth/forms/SignInForm"))
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const CreatePost = React.lazy(() => import("./pages/CreatePost"))
const EditPost = React.lazy(() => import("./pages/EditPost"))

const FallbackLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
  </div>
)

const App = () => {
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const res = await axios.get("/api/settings/favicon")
        if (res.data.success && res.data.setting) {
          const faviconUrl = res.data.setting.value
          let link = document.querySelector("link[rel~='icon']")
          if (!link) {
            link = document.createElement("link")
            link.rel = "icon"
            document.head.appendChild(link)
          }
          link.href = faviconUrl
        }
      } catch (err) {
        console.log("Failed to fetch favicon: ", err)
      }
    }
    fetchFavicon()
  }, [])

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          <Route path="/sign-in" element={<SignInForm />} />

          <Route element={<AdminPrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/update-post/:postId" element={<EditPost />} />
            </Route>
          </Route>

          {/* Redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
