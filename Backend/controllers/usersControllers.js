import cloudinary from "../database//Cloudinary.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import APIFeatures from "../utils/APIFeatures.js";
export async function GetAllUser(req, res) {
  try {
    const users = await User.find({
      role: { $in: ["teacher", "student"] },
    })
      .sort({ role: -1 })
      .select("-password");

    const teachers = users.filter((u) => u.role === "teacher");
    const students = users.filter((u) => u.role === "student");

    const response = {
      teachers,
      students,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const features = new APIFeatures(User.find({}), req.query)
      .filter()
      .search();

    const filteredCount = await User.countDocuments(features.query.getFilter());

    features.sort().limitField().paginate();

    const users = await features.query.select(
      "name email batch section school department profilePic -password"
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Users Found.",
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: users.length,
      pagination: {
        total: filteredCount, // Count of filtered documents
        limit,
        page,
        totalPages: Math.ceil(filteredCount / limit),
      },
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
export async function FilterBasedSection(req, res) {
  try {
    const filters = {
      role: "student",
      ...(req.body.batch && { batch: req.body.batch }),
      ...(req.body.section && { section: req.body.section }),
      ...(req.body.school && { school: req.body.school }),
      ...(req.body.department && { department: req.body.department }),
    };

    const students = await User.find(filters)
      .select("name email batch section school department profilePic")
      .lean();
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }
    res.status(200).json({
      success: true,
      count: students.length,
      filters: req.body,
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
export async function StudentFiltering(req, res) {
  try {
    const totalDocs = await User.countDocuments({ role: "student" });
    const features = new APIFeatures(User.find({ role: "student" }), req.query)
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    const student = await features.query
      .select("name email batch section school department profilePic")
      .select("-password -secAssigned");
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: student.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
export async function TeacherFiltering(req, res) {
  try {
    const totalDocs = await User.countDocuments({ role: "teacher" });
    const features = new APIFeatures(User.find({ role: "teacher" }), req.query)
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    const teacher = await features.query.select(
      "name email batch section school department profilePic"
    );
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: teacher.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
      teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
export async function ProfileUpdate(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const {
    name,
    email,
    bio,
    batch,
    section,
    school,
    department,
    title,
    occupation,
    password,
  } = req.body;

  try {
    // Authorization check
    if (userId.toString() !== id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this profile",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload profile picture if file exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      user.profilePic = result.secure_url;
    }

    // Update common fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;

    // Role-specific updates
    if (user.role === "student") {
      user.batch = batch || user.batch;
      user.section = section || user.section;
      user.school = school || user.school;
      user.department = department || user.department;
    } else if (user.role === "teacher") {
      // Fixed duplicate condition
      user.occupation = occupation || user.occupation;
    } else if (user.role === "admin") {
      user.title = title || user.title;
    }

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
