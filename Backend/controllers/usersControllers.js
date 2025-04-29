import User from "../models/User.js";
import bcrypt from "bcryptjs";
export async function FilterBasedSection(req,res){
    try {
      const filters = {
        role: 'student',
        ...(req.body.batch && { batch: req.body.batch }),
        ...(req.body.section && { section: req.body.section }),
        ...(req.body.school && { school: req.body.school }),
        ...(req.body.department && { department: req.body.department })
      };
  
      const students = await User.find(filters)
        .select('name email batch section school department profilePic')
        .lean();
  
      res.status(200).json({
        success: true,
        count: students.length,
        filters: req.body,
        data: students
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    };
}
export async function FilterById(req,res){
      try {
        const {studentId}=req.body
        const student=await User.find({studentID:studentId}).select("name email batch section school department profilePic")
        res.status(200).json({
          success: true,
          data: student
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Server error'
        });
      }
}
export async function ProfileUpdate(req,res){
    const {id}=req.params
    const userId=req.user._id
    console.log(userId)
    const {name ,email,profilePic,bio,batch,section,school,department,title,occupation,password} = req.body;
    try {
       if(userId.toString()!==id.toString()){
        return res.status(403).json({message:"you are not authorized to update this profile"})
       }
       const user =await User.findById(id)
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       } 
       if(user.role==="student"){
        if(!batch || !section || !school || !department){
            return res.status(400).json({message:"batch ,section ,school and department are required"})
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio||user.bio;
        user.batch=batch;
        user.section=section;
        user.school=school;
        user.department=department;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        await user.save();
       }
       else if(user.role==="teacher"){
        if(!occupation){
            return res.status(400).json({message:"occupation is required"})
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio||user.bio;
        user.occupation=occupation;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        await user.save();
        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: user
        });
       }
       else if(user.role==="admin"){
        if(!title){
            return res.status(400).json({message:"occupation is required"})
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio||user.bio;
        user.title=title;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }
        await user.save();
        res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          data: user
        });
       }

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
        console.error(error);
    }
}
