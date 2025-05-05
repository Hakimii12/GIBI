import mongoose from "mongoose";
const ResourceSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['resource', 'exitExam'] },
    title: String,
    description: String,
    school: String,
    department: String,
    year: { type: Number, required: false },
    files: [{ type: { type: String }, url: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { timestamps: true });
const Resources = mongoose.model("Resource", ResourceSchema);
export default Resources