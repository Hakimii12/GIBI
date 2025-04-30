/* Updating or adding code to this section is not permitted for any stakeholders
   but if it happen or it have to happen please report the about the change to me &
    make sure to add the comment to which part 
you have add or make a change on the top of this comment!!!!!!!!
*/
import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants:[{type :mongoose.Schema.Types.ObjectId,ref:"User"}],  
    lastMessage:{
        text:String,
        sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        
    }
},
{timestamps:true}
)
const Conversation=mongoose.model("Conversation",conversationSchema)
export default Conversation;