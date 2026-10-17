import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { create } from "../controllers/post/create.js"
import { getPosts, getRelatedPosts } from "../controllers/post/read.js"
import { updatepost } from "../controllers/post/update.js"
import { deletepost } from "../controllers/post/delete.js"
import { likePost, approvePost, rejectPost, trackView } from "../controllers/post/actions.js"

const router = express.Router()

router.post("/create", verifyToken, create)
router.get("/getposts", getPosts)
router.get("/related", getRelatedPosts)
router.post("/track-view/:postId", trackView)
router.put("/track-view/:postId", trackView)
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost)
router.put("/updatepost/:postId/:userId", verifyToken, updatepost)
router.put("/likepost/:postId", verifyToken, likePost)
router.put("/approvepost/:postId", verifyToken, approvePost)
router.put("/rejectpost/:postId", verifyToken, rejectPost)

export default router
