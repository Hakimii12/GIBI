import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { GenerateToken } from "../utils/GenerateToken.js";
export async function Register(req, res) {
  const {
    name,
    email,
    studentID,
    batch,
    section,
    school,
    department,
    occupation,
    password,
    role
  } = req.body;

  try {
    const existingUser = await User.findOne({   $or: [
      { email:email },
      { studentID:studentID }
    ] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: "Name, email, password, and role are required" 
      });
    }

    if (role === "admin") {
      return res.status(403).json({ 
        message: "Admin registration is not allowed here"
      });
    }

    if (role === "student") {
      if (!batch || !section || !school ||  ! studentID ) {
        return res.status(400).json({
          message: "Batch, section, school,department and studentID are required for students"
        });
      }
    } else if (role === "teacher") {
      if (!occupation) {
        return res.status(400).json({ 
          message: "Occupation is required for teachers" 
        });
      }
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "student" && { batch, section, school, department ,studentID }),
      ...(role === "teacher" && { occupation })
    });
    await newUser.save();
    console.log(newUser)
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Waiting for admin approval.",
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
export async function AdminRegister(req, res) {
  try {
    const { name, role, email, password, title } = req.body;
    if (role !== "admin") {
      return res
        .status(400)
        .json({ message: `${role} cannot be registered by admin` });
    }
    if (!name || !role || !email || !password || !title) {
      return res.status(400).json({ message: "please fill all the fields" });
    }
    const user = await User.findOne({
      $or: [{ email: email }],
    });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name: name,
      role: "admin",
      email: email,
      password: hashedPassword,
      status : "approved",
      title: title,
    });
    GenerateToken(newUser._id, newUser.role, res);
    await newUser.save();
    return res.status(200).json({ message: "successfully created new user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
}
export async function Login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (user.status!=='approved') throw new Error("Account pending approval");
    GenerateToken(user._id, user.role, res);
    return res.status(200).json({
  
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        createdAt: user.createdAt,
      
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}
export async function Logout(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function Approval(req, res) {
  const {userStatus ,id  } = req.params;
  const user = await User.findById(id).select("-password");
  const currentUser = req.user;
  const currentUserId = currentUser._id;

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "admin") {
    return res.status(400).json({ message: "Admins cannot be moderated" });
  }
  if (user.status === "suspended" && user.suspendedBy.toString() !== currentUserId.toString()) {
    return res.status(403).json({
      message: "Only the admin who suspended this user can approve/unsuspend them",
    });
  }
  if (userStatus === "approve") {
    user.status = "approved";
    user.suspendedBy = undefined;
  } else if (userStatus === "suspend") {
    user.status = "suspended";
    user.suspendedBy = currentUserId;
  } else if(userStatus === "reject"){
    user.status = "rejected";
    user.suspendedBy = undefined;
  }
  else {
    return res.status(400).json({ message: "Invalid action. Use 'approve' or 'suspend'." });
  }

  await user.save();

  if (userStatus === "approve") {
    return res.status(200).json({
      message: "User approved successfully!",
      user,
    });
  } else if (userStatus === "reject") {
    return res.status(200).json({
      message: "User rejected successfully!",
      user,
    });
  } else {
    return res.status(200).json({
      message: "User suspended successfully!",
      user,
    });
  }
}
export async function TeacherResponsibilities(req, res) {
  const { id } = req.params;
  const { assignments } = req.body;
  try {
    const teacher = await User.findById(id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (teacher.role !== "teacher")
      return res.status(400).json({ message: "User is not a teacher" });

    if (!Array.isArray(assignments) || assignments.some(a => !a.section || !a.subject || !a.school)) {
      return res.status(400).json({ message: 'Invalid assignments format' });
    }
    teacher.secAssigned = assignments;
    await teacher.save();

    res.json({
      message: "Responsibilities assigned successfully",
      assignments: teacher.secAssigned,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error assigning responsibilities",
        error: error.message,
      });
  }
}
export async function GetProfile(req,res){
  const currentUserId = req.user._id
  try {
     const user=await User.findById(currentUserId).select("-password")
     if(!user){
      return res.status(404).json({message:"user not found"})
     }
     return res.status(200).json(user)
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:error.message
    })
  }
}