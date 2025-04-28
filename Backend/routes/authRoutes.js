import express from "express";
import { AdminRegister, Approval, Login, Logout, Register } from "../controllers/authControllers.js";
import Authenticated from "../middlewares/Authenticated.js"
import Authorization from "../middlewares/Authorization.js"
const router = express.Router()
router.post('/login', Login);
router.post('/register', Register);
router.post('/adminRegister', Authenticated(), Authorization("admin"), AdminRegister);
router.post('/logout', Logout);
router.post('/approval/:id', Authenticated(), Authorization("admin"), Approval);
export default router