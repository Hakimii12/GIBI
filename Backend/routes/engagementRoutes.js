import express from "express"
import Authenticated from "../middlewares/Authenticated.js"
import { DeleteComment, LikeDislikePost, Reply } from "../controllers/engagementControllers.js"

const router=express.Router()
router.post('/likeDislike/:id',Authenticated(),LikeDislikePost)
router.post('/reply/:id',Authenticated(),Reply)
router.delete('/deleteComment/:pId/:commentId',Authenticated(),DeleteComment)
export default router
