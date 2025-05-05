import cloudinary from "../database//Cloudinary.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
export async function PublicPostCreation(req, res) {
  try {
    let { type, content, files } = req.body;
    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: "Content and type are required fields.",
      });
    }

    if (req.file) {
      let resource_type = "auto";
      const mime = req.file.mimetype;
      if (
        mime === "application/pdf" ||
        mime === "application/vnd.ms-powerpoint" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        resource_type = "raw";
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: resource_type,
      });
      files = [result.secure_url];
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const newPost = Post({
      author: user._id,
      type,
      content,
      files: files || [],
    });
    await newPost.save();
    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Public post creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
export async function GetPublicPost(req, res) {
  try {
    const post = await Post.find({ type: "public" })
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });
    if (!post || post.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No public posts found.",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {}
}
export async function PublicPostDelete(req, res) {
  try {
    const postID = req.params.id;
    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }
    await Post.findByIdAndDelete(postID);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting public post:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}


export async function AnnouncementPostCreation(req, res) {
  try {
    let { type, content, files } = req.body;

    if (!content || !type) {
      return res.status(400).json({
        success: false,
        message: "Content and type are required fields.",
      });
    }

    if (req.file) {
      let resourceType = "auto";
      const mime = req.file.mimetype;

      if (
        mime === "application/pdf" ||
        mime === "application/vnd.ms-powerpoint" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        resourceType = "raw";
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: resourceType,
      });

      files = [result.secure_url];
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const newPost = new Post({
      author: user._id,
      type,
      content,
      files: files || [],
    });
    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Announcement creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}

export async function GetAnnouncementPost(req, res) {
  try {
    const posts = await Post.find({ type: "announcement" })
      .populate("author", "name email ")
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No announcement posts found.",
      });
    }

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching announcement posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
export async function AnnouncementPostDelete(req, res) {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting announcement post:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}
export async function GetMyPost(req, res) {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ author: userId })
      .populate("author", "name email batch section school department profilePic")
      .sort({ createdAt: -1 }); 

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching my posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
    
  }

}