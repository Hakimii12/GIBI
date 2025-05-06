import express from "express";
import { GetStudentInstructionalPosts, CreateInstructionalPost, DeleteInstructionalPost, GetInstructionalPosts } from "../controllers/instructionalControllers.js"
import Authenticated from "../middlewares/Authenticated.js";
import Upload from "../middlewares/Multer.js";
import Authorization from "../middlewares/Authorization.js"
const router = express.Router()
router.get('/getInstructional', Authenticated(), GetInstructionalPosts);
router.get('/getBySection', Authenticated(), Authorization("student","teacher") , GetStudentInstructionalPosts);
router.post('/createInstructional', Authenticated(), Upload.array('files'), Authorization("teacher"), CreateInstructionalPost);
router.delete('/deleteInstructional/:postId', Authenticated(),Authorization("teacher"), DeleteInstructionalPost);
export default router