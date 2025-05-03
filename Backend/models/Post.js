import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["announcement", "instructional", "public"],
    required: true,
  },
  content: String,
  files: [String],
  target: {
    batch: String,
    section: String,
    school: String,
    department: String,
  },
  like: { type: [mongoose.Schema.Types.ObjectId], ref: "User" ,default:[]},
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      email:{
        type:String,
        required:true
       },
       profilepic:{
        type:String
    },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
