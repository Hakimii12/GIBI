import express from "express";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from '../middlewares/Authorization.js'
import Upload from "../middlewares/Multer.js"
import { ExitExamDelete,GetExitExam ,ExitExamCreation,ResourceDelete,GetResource,ResourceCreation, } from "../controllers/resourceControllers.js";

const router = express.Router()

export default router