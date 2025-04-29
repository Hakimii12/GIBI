import express from "express";
import { FilterBasedSection, GetAllUser, ProfileUpdate } from "../controllers/usersControllers.js";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from "../middlewares/Authorization.js"
const router = express.Router()
router.get("/getAllUsers",Authenticated(),Authorization("admin"),GetAllUser)
router.put('/profileUpdate/:id', Authenticated(),ProfileUpdate )
router.post('/fetchBySection', Authenticated(), Authorization("admin","teacher"), FilterBasedSection)

export default router