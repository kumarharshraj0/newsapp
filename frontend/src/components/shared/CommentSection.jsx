import React from "react"
import { Link } from "react-router-dom"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import Comment from "./Comment"
import { useCommentSection } from "@/hooks/useCommentSection"

const CommentSection = ({ postId }) => {
  const {
    currentUser,
    comment,
    setComment,
    allComments,
    showComments,
    setShowComments,
    visibleCount,
    setVisibleCount,
    showCommentBox,
    setShowCommentBox,
    handleSubmit,
    handleLike,
    handleEdit,
    handleDelete,
  } = useCommentSection(postId)

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img src={currentUser.profilePicture} alt="Profile Pic" className="h-5 w-5 object-cover rounded-full" />
          <Link to="/dashboard?tab=profile" className="text-sm text-blue-800 hover:underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-gray-700 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to="/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
        </div>
      )}

      {currentUser && (
        !showCommentBox ? (
          <div className="my-4">
            <Button onClick={() => setShowCommentBox(true)} className="bg-[#0A2240] hover:bg-[#E1261C] text-white font-bold">
              Add Comment
            </Button>
          </div>
        ) : (
          <form className="border border-gray-300 rounded-md p-4 transition-all duration-300" onSubmit={handleSubmit}>
            <Textarea placeholder="Add a comment..." rows="3" maxLength="200"
              className="border border-slate-355 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => setComment(e.target.value)} value={comment} />

            <div className="flex justify-between items-center mt-5">
              <p className="text-gray-500 text-sm">{200 - comment.length} characters remaining</p>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCommentBox(false)}
                  className="font-bold border border-gray-300">Cancel</Button>
                <Button type="submit" className="font-bold">Submit</Button>
              </div>
            </div>
          </form>
        )
      )}

      {allComments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1 font-semibold">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm"><p>{allComments.length}</p></div>
          </div>

          {!showComments ? (
            <div className="my-5 flex justify-center">
              <Button onClick={() => setShowComments(true)} className="bg-[#0A2240] hover:bg-[#E1261C] text-white font-bold">
                View Comments ({allComments.length})
              </Button>
            </div>
          ) : (
            <>
              {allComments.slice(0, visibleCount).map((c) => (
                <Comment key={c._id} comment={c} onLike={handleLike} onEdit={handleEdit} onDelete={handleDelete} />
              ))}

              <div className="my-5 flex justify-center gap-3">
                {allComments.length > visibleCount && (
                  <Button onClick={() => setVisibleCount((prev) => prev + 5)} className="bg-[#0A2240] hover:bg-[#E1261C] text-white font-bold">
                    View More Comments
                  </Button>
                )}
                <Button onClick={() => { setShowComments(false); setVisibleCount(5) }} variant="outline" className="border border-gray-300 font-bold">
                  Hide Comments
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default CommentSection
