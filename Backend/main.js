import express from 'express'
import dotenv from 'dotenv'
import Database from './database/database.js'
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoutes.js"
import messages from './routes/messageRoutes.js'
import postRoutes from './routes/postRoutes.js'
import resource from './routes/resourceRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
dotenv.config();
const port=process.env.PORT
//initializing database
Database()
//initializing routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/messages', messages)
app.use('/api/posts', postRoutes)
app.use('/api/resources', resource)
app.get('/', (req, res) => {
  res.send("Server is running 🚀");
});
app.listen(port,()=>{
    console.log(`server is running on port http://localhost:/${port}`)
})
