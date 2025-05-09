import APIFeatures from '../utils/APIFeatures.js'
import cloudinary from "../database//Cloudinary.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import fs from 'fs/promises';
export async function CreateInstructionalPost(req, res) {
  const currentUser = req.user._id;
  const { batch, section, school, department, content, subject } = req.body;

  try {
    const user = await User.findById(currentUser);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!batch || !section || !school || !subject || !content) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (department) {
      const isAssigned = user.secAssigned.some(sec => 
        sec.section === section && 
        sec.school === school && 
        sec.department === department &&
        sec.subject === subject
      );
      if (!isAssigned) return res.status(403).json({ message: "Unauthorized for this section" });
    } else {
      const isAssigned = user.secAssigned.some(sec => 
        sec.section === section && 
        sec.school === school &&
        sec.subject === subject
      );
      if (!isAssigned) return res.status(403).json({ message: "Unauthorized for this section" });
    }
    const uploadPromises = req.files.map(file => 
      cloudinary.uploader.upload(file.path, { folder: "instructional-posts" }) 
    );
    const uploadedResults = await Promise.all(uploadPromises);
    const fileUrls = uploadedResults.map(result => result.secure_url);

    const post = new Post({
      author: req.user._id,
      type: 'instructional',
      content: content,
      files: fileUrls || [],
      subject: subject,
      target: { batch, section, school, department }
    });

    await post.save();

    await Promise.all(
      req.files.map(file => fs.unlink(file.path))
    );

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export async function GetInstructionalPosts(req, res) {
  const currentUser = req.user._id;
  try {
    const baseFilter = { author: currentUser };
    const totalDocs = await Post.countDocuments(baseFilter);
    const features = new APIFeatures(
      Post.find(baseFilter),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    // Execute query
    const posts = await features.query.populate('author', 'name');

    // Pagination data
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: posts.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function DeleteInstructionalPost(req,res){
    
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }
        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export async function GetStudentInstructionalPosts(req, res) {
  try {
    const studentId = req.user._id;
    
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { batch, section, school, department } = student;


    const baseFilter = {
      type: "instructional",
      "target.batch": batch,
      "target.section": section,
      "target.school": school,
      $or: [
        { "target.department": { $exists: false } },
        { "target.department": department }
      ]
    };

    const totalDocs = await Post.countDocuments(baseFilter);

    const features = new APIFeatures(
      Post.find(baseFilter), 
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    const posts = await features.query.populate("author", "name email");

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: posts.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
        posts
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching instructional posts",
      error: error.message,
    });
  }
}