/* Updating or adding code to this section is permitted only for Abdulbaset and abduselam muhammadnur
   but if other stakeholders beside the authorized, make the change to this page by any means,  please report the change to Abdulbaset or abduselam muhammadnur&
    make sure to add the comment to which part 
you have added or made a change on the top of this comment!!!!!!!!
*/
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