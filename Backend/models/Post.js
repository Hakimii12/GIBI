/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['announcement', 'instructional', 'public'], required: true },
  content: String,
  files: [String],
  target: {
    batch: String,
    section: String,
    school: String,
    department: String
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post