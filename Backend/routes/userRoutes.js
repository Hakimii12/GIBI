import express from "express";
import { FilterBasedSection, GetAllUser, ProfileUpdate, StudentFiltering, TeacherFiltering } from "../controllers/usersControllers.js";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from "../middlewares/Authorization.js";
import Upload from "../middlewares/Multer.js"
const router = express.Router()
router.get("/getAllUsers",Authenticated(),Authorization("admin"),GetAllUser)
router.put('/profileUpdate/:id',Authenticated(),Upload.single("profilePic"),ProfileUpdate )
router.post('/fetchBySection', Authenticated(), Authorization("admin","teacher"), FilterBasedSection)
router.get('/teacherFiltering',Authenticated(),Authorization("admin","teacher"),TeacherFiltering)
router.get('/studentFiltering',Authenticated(),StudentFiltering)

export default router