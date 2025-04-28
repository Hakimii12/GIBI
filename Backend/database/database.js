import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
async function Database() {
   dotenv.config()
   const db_string=process.env.DB_CONNNECTION_STRING
    mongoose.connect(db_string)
    const db=mongoose.connection
    db.on('error',(error)=>{
        console.log('Error connecting to databse:'+error)
    })
    db.once('open',()=>{
        console.log("successfully connected to the database")
    })
     // super admin creation
     const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
        email: 'ictcenter@astu.com',
        password: await bcrypt.hash("123qweQWE@", 10),
        role: 'admin',
        title: 'System Administrator',
        isApproved: true
      });
      await admin.save();
      console.log('Initial admin created');
    }
}
export default Database
