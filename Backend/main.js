import express from "express";
import dotenv from "dotenv";
import Database from "./database/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import resource from "./routes/resourceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import instructionalRoutes from "./routes/instructional.js";
import engagementRoutes from "./routes/engagementRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { app ,server} from "./Socket/socket.js";
import cors from "cors";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//initializing cors
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080','https://preview--role-based-education-sphere.lovable.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
dotenv.config();
const port = process.env.PORT;
//initializing database
Database();
//initializing routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/resources", resource);
app.use("/api/instructional", instructionalRoutes);
app.use("/api/engagement", engagementRoutes);
app.use("/api/post", postRoutes);
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
server.listen(port, () => {
  console.log(`server is running 🚀 on port http://localhost:/${port}`);
});
