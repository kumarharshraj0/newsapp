import React, { Suspense, useEffect } from "react"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Header from "./components/shared/Header"

// Lazy load below the fold components
const Footer = React.lazy(() => import("./components/shared/Footer"))
import { Toaster } from "./components/ui/toaster"
import PrivateRoute from "./components/shared/PrivateRoute"
import ScrollToTop from "./components/shared/ScrollToTop"
import GoogleAnalytics from "./components/shared/GoogleAnalytics"
import axios from "axios"

import Home from "./pages/Home"
const SignInForm = React.lazy(() => import("./auth/forms/SignInForm"))
const SignUpForm = React.lazy(() => import("./auth/forms/SignUpForm"))
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const PostDetails = React.lazy(() => import("./pages/PostDetails"))
const Search = React.lazy(() => import("./pages/Search"))
const About = React.lazy(() => import("./pages/About"))
const CreatePost = React.lazy(() => import("./pages/CreatePost"))
const EditPost = React.lazy(() => import("./pages/EditPost"))
const DynamicPage = React.lazy(() => import("./pages/DynamicPage"))
const PublisherProfile = React.lazy(() => import("./pages/PublisherProfile"))

const FallbackLoader = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E1261C]"></div>
  </div>
)

const App = () => {

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <GoogleAnalytics />
      <Header />
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/search" element={<Search />} />
          <Route path="/news/:category" element={<Search />} />
          <Route path="/news/:category/:subcategory" element={<Search />} />
          <Route path="/post/:postSlug" element={<PostDetails />} />
          <Route path="/news/:category/article/:postSlug" element={<PostDetails />} />
          <Route path="/news/:category/:subcategory/article/:postSlug" element={<PostDetails />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/publisher/:id" element={<PublisherProfile />} />

          {/* User private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<EditPost />} />
          </Route>

          {/* Direct clean article slug route: e.g. /:postSlug */}
          <Route path="/:postSlug" element={<PostDetails />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
