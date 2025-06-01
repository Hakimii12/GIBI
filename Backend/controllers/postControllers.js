import cloudinary from "../database//Cloudinary.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import APIFeatures from "../utils/APIFeatures.js";
export async function PublicPostCreation(req, res) {
  try {
    let { content, files, title } = req.body;
    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: "Content and title are required fields.",
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const newPost = new Post({
      author: user._id,
      type: "public",
      content,
      title,
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
    const totalDocs = await Post.countDocuments({ type: "public" }).sort({
      createdAt: -1,
    });
    const features = new APIFeatures(Post.find({ type: "public" }), req.query)
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();
    const posts = await features.query
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No public posts found.",
      });
    }
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
    return res.status(500).json({ message: error.message });
  }
}

export async function getPosts(req, res) {
  try {
    const features = new APIFeatures(Post.find({}), req.query)
      .filter()
      .search();

    const filteredCount = await Post.countDocuments(features.query.getFilter());

    features.sort().limitField().paginate();

    const posts = await features.query
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Posts Found.",
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: posts.length,
      pagination: {
        total: filteredCount, // Count of filtered documents
        limit,
        page,
        totalPages: Math.ceil(filteredCount / limit),
      },
      posts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export async function createPost(req, res) {
  try {
    let { content, files, title, type } = req.body;
    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: "Content and title are required fields.",
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const newPost = new Post({
      author: user._id,
      type: type || "public",
      content,
      title,
      files: files || [],
    });
    await newPost.save();
    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch {
    return res.status(500).json({ message: error.message });
  }
}

export async function getPost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch {
    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
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
    await Post.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
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
    let { content, files, title } = req.body;

    if (!content || !title) {
      return res.status(400).json({
        success: false,
        message: "Content and title are required fields.",
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const newPost = new Post({
      author: user._id,
      type: "announcement",
      content,
      files: files || [],
      title,
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
    const totalDocs = await Post.countDocuments({ type: "announcement" }).sort({
      createdAt: -1,
    });
    const features = new APIFeatures(
      Post.find({ type: "announcement" }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();
    const posts = await features.query
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });
    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No public posts found.",
      });
    }
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
    return res.status(500).json({ message: error.message });
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
    const totalDocs = await Post.countDocuments({ author: userId });
    const features = new APIFeatures(Post.find({ author: userId }), req.query)
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();
    const posts = await features.query
      .populate(
        "author",
        "name email batch section school department profilePic"
      )
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No posts found for this user.",
      });
    }

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
    console.error("Error fetching my posts:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
}