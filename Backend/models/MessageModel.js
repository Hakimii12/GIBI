/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,ref:"Conversation"  
    },
    sender:{
       type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    text:String,

},{timestamps:true})
const Messages=mongoose.model("Messages",messageSchema)
export default Messages