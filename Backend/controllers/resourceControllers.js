import cloudinary from "../database/Cloudinary.js";
import Resources from "../models/Resource.js";
import APIFeatures from "../utils/APIFeatures.js";
export async function ResourceCreation(req, res) {
  try {
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        return {
          type: file.mimetype.split("/")[0],
          url: uploadResult.secure_url,
        };
      })
    );
    const resource = new Resources({
      authorId: req.user._id,
      type: req.body.type,
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
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
export async function deleteResource(req, res) {
  const { id } = req.params;
  try {
    const resource = await Resources.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await Resources.findByIdAndDelete(id);

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getResource(req, res) {
  const { id } = req.params;
  try {
    const resource = await Resources.findById(id).populate(
      "authorId",
      "name email role"
    );
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getResources(req, res) {
  try {
    const features = new APIFeatures(Resources.find({}), req.query)
      .filter()
      .search();

    const filteredCount = await Resources.countDocuments(
      features.query.getFilter()
    );

    features.sort().limitField().paginate();

    const resources = await features.query.populate(
      "authorId",
      "name email role"
    );

    if (!resources || resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Resources Found.",
      });
    }

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    res.status(200).json({
      status: "success",
      results: resources.length,
      pagination: {
        total: filteredCount, // Count of filtered documents
        limit,
        page,
        totalPages: Math.ceil(filteredCount / limit),
      },
      resources,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
export async function ExitExamCreation(req, res) {
  try {
    const fileUrls = await Promise.all(
      req.files.map(async (file) => {
        const upload = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });
        return { type: file.mimetype.split("/")[0], url: upload.secure_url };
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
    const totalDocs = await Resources.countDocuments({ type: "exitExam" });
    const features = new APIFeatures(
      Resources.find({ type: "exitExam" }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    const resources = await features.query.populate(
      "authorId",
      "name email role"
    );
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    res.status(200).json({
      status: "success",
      results: resources.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
      resources,
    });
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
    const totalDocs = await Resources.countDocuments({ type: "resource" });
    const features = new APIFeatures(
      Resources.find({ type: "resource" }),
      req.query
    )
      .filter()
      .search()
      .sort()
      .limitField()
      .paginate();

    const resources = await features.query.populate(
      "authorId",
      "name email role"
    );
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    res.status(200).json({
      status: "success",
      results: resources.length,
      pagination: {
        total: totalDocs,
        limit,
        page,
        totalPages: Math.ceil(totalDocs / limit),
      },
      resources,
    });
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
