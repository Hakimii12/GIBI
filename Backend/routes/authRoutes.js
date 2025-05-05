import express from "express";
import { AdminRegister, Approval, GetProfile, Login, Logout, Register, TeacherResponsibilities } from "../controllers/authControllers.js";
import Authenticated from "../middlewares/Authenticated.js"
import Authorization from "../middlewares/Authorization.js"
const router = express.Router()
router.get('/getProfileUser', Authenticated(), GetProfile);
router.post('/login', Login);
router.post('/register', Register);
router.post('/adminRegister', Authenticated(), Authorization("admin"), AdminRegister);
router.post('/logout',Authenticated(), Logout);
router.post('/approval/:userStatus/:id', Authenticated(), Authorization("admin"), Approval);
router.put('/assignTeacherResponsibilities/:id',Authenticated(),Authorization("admin"), TeacherResponsibilities);
export default router