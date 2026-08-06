import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "../ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useDashboardPosts } from "@/hooks/useDashboardPosts"

const getFrontendPostUrl = (post) => {
  if (!post) return "#"
  const cat = post.category || "general"
  const base = "http://localhost:5173"
  if (post.subcategory && post.subcategory !== "all") {
    return `${base}/news/${cat}/${post.subcategory}/article/${post.slug}`
  }
  return `${base}/news/${cat}/article/${post.slug}`
}

const statusBadge = (status) => {
  const styles = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status || "pending"}
    </span>
  )
}

const DashboardPosts = () => {
  const {
    currentUser,
    posts,
    activeTab,
    setActiveTab,
    category,
    setCategory,
    date,
    setDate,
    page,
    setPage,
    totalPages,
    setPostIdToDelete,
    handleDeletePost,
    handleApprove,
    handleReject,
  } = useDashboardPosts()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("/api/category/getcategories", { validateStatus: () => true })
        if (res.status >= 200 && res.status < 300) {
          setCategories(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCats()
  }, [])

  const tabs = [
    { label: "All", value: "all" },
    { label: "⏳ Pending", value: "pending" },
    { label: "✅ Approved", value: "approved" },
    { label: "❌ Rejected", value: "rejected" },
  ]

  return (
    <div className="flex flex-col w-full p-4">
      <h1 className="text-2xl font-bold text-slate-700 mb-4">All Articles</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab.value ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>{tab.label}</button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 text-sm rounded-md px-3 py-2 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 text-sm rounded-md px-3 py-2 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      {currentUser?.isAdmin && posts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                {activeTab === "pending" ? "Articles waiting for your approval." : "All articles in the system."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              {posts.map((post) => (
                <TableBody className="divide-y" key={post._id}>
                  <TableRow>
                    <TableCell className="text-xs text-gray-500">{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link to={`/update-post/${post._id}`}>
                        <img src={post.image} alt={post.title} className="w-20 h-12 object-cover bg-gray-500 rounded hover:opacity-80 transition" />
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-[180px]">
                      <Link to={`/update-post/${post._id}`} className="font-medium hover:underline line-clamp-2 text-blue-700">{post.title}</Link>
                    </TableCell>
                    <TableCell><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{post.category || "—"}</span></TableCell>
                    <TableCell><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">{post.subcategory || "—"}</span></TableCell>
                    <TableCell>{statusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 min-w-[120px]">
                        {post.status === "pending" && (
                          <div className="flex gap-1">
                            <button onClick={() => handleApprove(post._id)} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Approve</button>
                            <button onClick={() => handleReject(post._id)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Reject</button>
                          </div>
                        )}
                        {post.status === "rejected" && (
                          <button onClick={() => handleApprove(post._id)} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 w-fit">Approve</button>
                        )}
                        <div className="flex gap-1">
                          <a href={getFrontendPostUrl(post)} target="_blank" rel="noreferrer" className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded hover:bg-indigo-200">View</a>
                          <Link to={`/update-post/${post._id}`} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded hover:bg-slate-200">Edit</Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <span onClick={() => setPostIdToDelete(post._id)} className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200 cursor-pointer">Delete</span>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently delete this article from the system.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600" onClick={handleDeletePost}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 py-6">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 mt-4">{activeTab === "pending" ? "No pending articles to review." : "No articles found."}</p>
      )}
    </div>
  )
}

export default DashboardPosts
