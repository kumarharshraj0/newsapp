import React from "react"
import { Link } from "react-router-dom"
import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "../ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../ui/alert-dialog"
import { useDashboardUserPosts } from "@/hooks/useDashboardUserPosts"

const statusBadge = (status) => {
  const styles = {
    approved: "bg-green-100 text-green-700 border-green-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    rejected: "bg-red-100 text-red-700 border-red-300",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status === "pending" ? "⏳ Pending Review" : status === "approved" ? "✅ Approved" : "❌ Rejected"}
    </span>
  )
}

const DashboardUserPosts = () => {
  const {
    userPosts,
    showMore,
    setPostIdToDelete,
    handleShowMore,
    handleDeletePost,
  } = useDashboardUserPosts()

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Submitted Articles</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your articles, check approval status, or create new posts.</p>
        </div>
        <Link to="/create-post" className="bg-[#E1261C] hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded shadow flex items-center gap-1 uppercase tracking-wider">
          ✍️ Add New Article
        </Link>
      </div>

      {userPosts.length > 0 ? (
        <>
          <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
            <Table>
              <TableCaption className="pb-4">A list of all articles submitted by you.</TableCaption>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[110px]">Date</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              {userPosts.map((post) => (
                <TableBody className="divide-y" key={post._id}>
                  <TableRow>
                    <TableCell className="text-xs text-gray-500">{new Date(post.createdAt || post.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell><img src={post.image} alt={post.title} className="w-16 h-10 object-cover bg-gray-200 rounded" /></TableCell>
                    <TableCell className="max-w-[220px]"><span className="font-medium line-clamp-2 text-slate-800">{post.title}</span></TableCell>
                    <TableCell><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{post.category || "—"}</span></TableCell>
                    <TableCell>{statusBadge(post.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {post.status === "approved" && (
                          <Link to={`/post/${post.slug}`} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold rounded">View</Link>
                        )}
                        <Link to={`/update-post/${post._id}`} className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold rounded">Edit</Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <span onClick={() => setPostIdToDelete(post._id)} className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded cursor-pointer">Delete</span>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Article?</AlertDialogTitle>
                              <AlertDialogDescription>Are you sure you want to delete this article? This action cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600" onClick={handleDeletePost}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </div>
          {showMore && <button onClick={handleShowMore} className="w-full text-blue-700 self-center text-sm py-5 font-semibold">Show more</button>}
        </>
      ) : (
        <div className="bg-white border rounded-lg p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
          <span className="text-4xl">📰</span>
          <h3 className="text-lg font-bold text-slate-700">No Articles Yet</h3>
          <p className="text-sm text-gray-500 max-w-md">You haven't submitted any articles yet. Share your news and opinions with our community!</p>
          <Link to="/create-post" className="mt-2 bg-[#E1261C] hover:bg-red-700 text-white text-xs font-bold px-5 py-3 rounded-full shadow uppercase tracking-wider">✍️ Write Your First Article</Link>
        </div>
      )}
    </div>
  )
}

export default DashboardUserPosts
