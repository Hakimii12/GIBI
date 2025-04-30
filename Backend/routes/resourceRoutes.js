/* Updating or adding code to this section is permitted only for Abdulbaset and abduselam muhammadnur
   but if other stakeholders beside the authorized, make the change to this page by any means,  please report the change to Abdulbaset or abduselam muhammadnur&
    make sure to add the comment to which part 
you have added or made a change on the top of this comment!!!!!!!!
*/
import express from "express";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from '../middlewares/Authorization.js'
import Upload from "../middlewares/Multer.js"
import { ExitExamDelete,GetExitExam ,ExitExamCreation,ResourceDelete,GetResource,ResourceCreation, } from "../controllers/resourceControllers.js";
/*
write your routes here with 
1. Authenticate all users(admin,teacher and student) using Authenticated middleware.
2. Authorize only teacher and admin to create and delete ExitExam and Resource using Authorization middleware.
3. use Upload middleware to upload files(like image,pdf,video,etc) and then to cloudinary and save the url in the database in the resourceControllers.js workplace.
*/
const router = express.Router()

export default router