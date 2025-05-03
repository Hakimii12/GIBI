import express from "express";
import { CreateMessage, GetConversations, GetMessage } from '../controllers/messageControllers.js';
import Authenticated from "../middlewares/Authenticated.js"
const routes = express.Router()
routes.get('/conversations', Authenticated(), GetConversations);
routes.get('/:otherId', Authenticated(), GetMessage)
routes.post('/', Authenticated(), CreateMessage);
export default routes