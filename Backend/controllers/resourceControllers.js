import cloudinary from "../database//Cloudinary.js";
import User from "../models/User.js";
import Resources from "../models/Resource.js";

export async function ResourceCreation(req, res) {

  try {
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        console.log(`Uploading file: ${file.path}`); // Debugging line
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto", // Ensure this is correct
        });
        return {
          type: file.mimetype,
          url: uploadResult.secure_url,
        };
      })
    );
    // Create a new resource post
    const resource = new Resources({
      authorId: req.user._id, // Authenticated user
      type: "resource", // auto-set type
      title: req.body.title,
      description: req.body.description,
      school: req.body.school,
      department: req.body.department,
      course: req.body.course,
      year: req.body.year,
      files: fileUrls,
    });

    await resource.save();
    return res.status(201).json({
      message: "Resource created successfully",
      resource,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ error: err.message });
  }
}

export async function ExitExamCreation(req, res) {
  try {
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        return { type: file.mimetype, url: upload.secure_url };
      })
    );

    const exitExam = new Resources({
      authorId: req.user._id,
      type: "exitExam",
      title: req.body.title,
      description: req.body.description,
      school: req.body.school,
      department: req.body.department,
      year: req.body.year,
      files: fileUrls,
    });

    await exitExam.save();
    res
      .status(201)
      .json({ message: "Exit exam created successfully", exitExam });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function GetExitExam(req, res) {
  try {
    const { school, department, year } = req.query;

    if (!school || !department) {
      return res
        .status(400)
        .json({ error: "School and department are required filters." });
    }

    const filter = { type: "exitExam", school, department };
    if (year) filter.year = year;

    const exitExams = await Resources.find(filter)
      .populate("authorId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(exitExams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function ExitExamDelete(req, res) {
  try {
    const { id } = req.params;
    const resource = await Resources.findById(id);

    if (!resource || resource.type !== "exitExam") {
      return res.status(404).json({ error: "Exit exam not found." });
    }

    await Resources.findByIdAndDelete(id);
    res.status(200).json({ message: "Exit exam deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function GetResource(req, res) {
  try {
    const { school, department, year } = req.query;

    if (!school || !department) {
      return res
        .status(400)
        .json({ error: "School and department are required filters." });
    }

    const filter = { type: "resource", school, department };
    if (year) filter.year = year;

    const resources = await Resources.find(filter)
      .populate("authorId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function ResourceDelete(req, res) {
  try {
    const { id } = req.params;
    const resource = await Resources.findById(id);

    if (!resource || resource.type !== "resource") {
      return res.status(404).json({ error: "Resource not found." });
    }

    await Resources.findByIdAndDelete(id);
    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
