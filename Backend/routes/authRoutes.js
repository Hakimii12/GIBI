import express from "express";
import { Approval, Login, Logout, Register } from "../controllers/authControllers.js";

const router = express.Router()
router.post('/register', Register)
router.post('/login', Login)
router.post('/logout', Logout)
router.post('/approval/:id', Approval)
export default router