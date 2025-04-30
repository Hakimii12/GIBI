/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have added or made a change on the top of this comment!!!!!!!!
*/
import express from "express";
import { FilterBasedSection, GetAllUser, ProfileUpdate } from "../controllers/usersControllers.js";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from "../middlewares/Authorization.js";
import Upload from "../middlewares/Multer.js"
const router = express.Router()
router.get("/getAllUsers",Authenticated(),Authorization("admin"),GetAllUser)
router.put('/profileUpdate/:id',Authenticated(),Upload.single("profilePic"),ProfileUpdate )
router.post('/fetchBySection', Authenticated(), Authorization("admin","teacher"), FilterBasedSection)

export default router