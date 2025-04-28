import express from 'express'
import dotenv from 'dotenv'
import Database from './database/database.js'
import cookieParser from 'cookie-parser'
// import userRouter from './routes/userRoutes.js'
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
dotenv.config();
const port=process.env.PORT
//initializing database
Database()
// app.use('/api',userRouter)
app.get('/', (req, res) => {
  res.send("Server is running 🚀");
});
app.listen(port,()=>{
    console.log(`server is running on port http://localhost:/${port}`)
})
