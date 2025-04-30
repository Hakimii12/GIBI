/* Updating or adding code to this section is permitted for Abdulhakim and abduselam tesfaye
   but if other stakeholders beside the authorized stakeholders, make the change to this page by any means,  please report the change to Abdulhakim or abduselam tesfaye&
    make sure to add the comment to which part 
you have added or made a change on the top of this comment!!!!!!!!
*/
import express from "express";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from '../middlewares/Authorization.js'
import Upload from "../middlewares/Multer.js"
const router = express.Router()
/*
write your routes here with 
1. Authenticate all users(admin,teacher and student) using Authenticated middleware.
2. Authorize only teacher to create and delete instructional post using Authorization middleware.
3. Authorize only admin to create and delete Announcement post using Authorization middleware.
4. Don't use Authorization middleware for public post cuz every user is Authorized to create,view and delete the public post.
5. use Upload middleware to upload files(like image,pdf,video,etc) and then to cloudinary and save the url in the database in the resourceControllers.js workplace.
*/
export default router