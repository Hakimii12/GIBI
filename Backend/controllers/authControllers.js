/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { GenerateToken } from '../utils/GenerateToken.js'
export async function Register(req,res){
    try {
      const {name,role,email,password}=req.body
      if(role==="admin"){
        return res.status(400).json({message:"admin cannot resgister by himself"})
      }
      if(req.body.studentID){
        const {name,role,email,password,studentID}=req.body
        if(!name || !role || !email || !password  || !studentID){
          return res.status(400).json({message:"please fill all the fields"})
         }
         const user=await User.findOne({
          $or:[
              {email:email},
              {studentID:studentID},
          ]
         });
         if(user){
          return res.status(400).json({message:"user already exists"})
       }
       const salt =await bcrypt.genSalt(10);
      const hashedPassword =await bcrypt.hash(password,salt)
      const newUser=new User({
          name:name,
          role:role,
          email:email,
          password:hashedPassword,
          studentID:studentID
      })
      GenerateToken(newUser._id,newUser.role,res)
      await newUser.save()
      return res.status(200).json({message:"successfully created new user"}) 
      }
      else{
        if(!name || !role || !email || !password){
          return res.status(400).json({message:"please fill all the fields"})
     }
     const user=await User.findOne({
      $or:[
          {email:email},
      ]
     });
     if(user){
        return res.status(400).json({message:"user already exists"})
     }
     const salt =await bcrypt.genSalt(10);
     const hashedPassword =await bcrypt.hash(password,salt)
     const newUser=new User({
         name:name,
         role:role,
         email:email,
         password:hashedPassword
     })
     GenerateToken(newUser._id,newUser.role,res)
     await newUser.save()
     return res.status(200).json({message:"successfully created new user"}) 
      }
  } catch (error) {
     res.status(500).json({message:error.message}) 
     console.log(error)
  }
  }
  export async function AdminRegister(req,res){
    try {
      const {name,role,email,password,title}=req.body
        if(role!=="admin"){
          return res.status(400).json({message:"admin can register only an admin"})
        }
        if(!name || !role || !email || !password || !title){
          return res.status(400).json({message:"please fill all the fields"})
     }
     const user=await User.findOne({
      $or:[
          {email:email}
      ]
     });
     if(user){
        return res.status(400).json({message:"user already exists"})
     }
     const salt =await bcrypt.genSalt(10);
     const hashedPassword =await bcrypt.hash(password,salt)
     const newUser=new User({
         name:name,
         role:'admin',
         email:email,
         password:hashedPassword,
         isApproved:true,
         title:title
     })
     GenerateToken(newUser._id,newUser.role,res)
     await newUser.save()
     return res.status(200).json({message:"successfully created new user"}) 
  } catch (error) {
     res.status(500).json({message:error.message}) 
     console.log(error)
  }
  }
  export async function Login(req,res){
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user){
        return(res.status(404).json({error:'user not found'}))
      }
  
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch){
        return(res.status(401).json({error:'Invalid credentials'}))
      }
      if (!user.isApproved) throw new Error('Account pending approval');
      GenerateToken(user._id, user.role, res)
      return(res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          createdAt: user.createdAt
        }
      }))
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
  export async function Logout(req,res){
    try {
 res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'strict',
    path: '/', 
});
return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
} 
export async function Approval(req,res){
    const {id}=req.params
    const user=await User.findById(id).select("-password")
    const currentUser=req.user;
    const currentUserId=currentUser._id
    if(!user){
      return res.status(404).json({error:"user not found"})
    }
    if(user.role==="admin"){
      return res.status(400).json({message:"admin cannot be approved or suspended"})
    }
    if (user.suspendedBy && user.suspendedBy.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: 'Only the admin who suspended this user can approve them' });
    }
    if(user.role === "admin"){
      return res.status(400).json({message:"admin cannot be approved or suspended"})
    }
    if(user.isApproved){
        user.isApproved= false;
        user.suspendedBy=currentUserId;
        await user.save();
        return res.status(200).json({message:"suspended !!"})
    }
    await User.findByIdAndUpdate(
      id,
      {
        $set: { isApproved: true },
        $unset: { suspendedBy: "" }
      },
      { new: true }
    );
    return res.status(200).json({message:"approved"})
}
export async function TeacherResponsibilities(req, res) {
  const { id } = req.params;
  const { assignments } = req.body;
  try {

    const teacher = await User.findById(id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    if (teacher.role !== 'teacher') return res.status(400).json({ message: 'User is not a teacher' });

    if (!Array.isArray(assignments) || assignments.some(a => !a.section || !a.subject)) {
      return res.status(400).json({ message: 'Invalid assignments format' });
    }

    teacher.secAssigned = assignments;
    await teacher.save();

    res.json({ 
      message: 'Responsibilities assigned successfully',
      assignments: teacher.secAssigned
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning responsibilities', error: error.message });
  }
}