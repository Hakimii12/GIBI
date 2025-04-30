/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import express from "express";
import { AdminRegister, Approval, Login, Logout, Register, TeacherResponsibilities } from "../controllers/authControllers.js";
import Authenticated from "../middlewares/Authenticated.js"
import Authorization from "../middlewares/Authorization.js"
const router = express.Router()
router.post('/login', Login);
router.post('/register', Register);
router.post('/adminRegister', Authenticated(), Authorization("admin"), AdminRegister);
router.post('/logout', Logout);
router.post('/approval/:id', Authenticated(), Authorization("admin"), Approval);
router.put('/assignTeacherResponsibilities/:id',Authenticated(),Authorization("admin"), TeacherResponsibilities);
export default router