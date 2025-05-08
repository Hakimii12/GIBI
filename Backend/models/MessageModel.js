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