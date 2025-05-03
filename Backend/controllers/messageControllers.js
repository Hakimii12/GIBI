import Conversation from "../models/Conversation.js";
import Messages from "../models/MessageModel.js";

export async function CreateMessage(req,res){
    const {recipientId,message}=req.body;
    const sendId=req.user._id;
    try {
        let conversation= await Conversation.findOne({ participants: { $all: [sendId, recipientId] } });
        if(!conversation){
               conversation=new Conversation({
                participants:[sendId,recipientId],
                lastMessage:{
                    text:message,
                    sender:sendId 
                }
            });
            await conversation.save();
        }
        const newMessage=new Messages({
            conversationId:conversation._id,
            sender:sendId,
            text:message
        })
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage:{
                    text:message,
                    sender:sendId
                }
            })
        ])
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log(error.message)
    }
}
export async function GetMessage(req,res){
    const {otherId}=req.params
    const sendId=req.user._id
    try {   
        const conversation = await Conversation.findOne({participants:{$all:[sendId,otherId]}});
        console.log(conversation._id)
        if (!conversation) {
            return res.status(404).json({message: "Conversation not found"});
        }
        const messages = await Messages.find({conversationId: conversation._id}).sort({createdAt:1});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log(error.message) 
    }
}
export async function GetConversations(req,res){
    const userId=req.user._id
    console.log(userId)
    try {
        const conversations = await Conversation.find({ participants: userId }).populate(
            { path: "participants", select: "username profilepic" });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log(error.message)
    }
}

