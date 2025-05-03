import Post from "../models/Post.js"
import User from "../models/User.js"
export async function LikeDislikePost(req,res){
    try {
        const {id}=req.params
        if(!id){
            return res.status(404).json({message:"no post"})
        }
        const post=await Post.findById(id)
        if(!post){
            return res.status(404).json({message:"post no found"})
        }
        const userToLike=await User.findById(req.user._id).select("-password")
        if(!userToLike){
            return res.status(404).json({message:"user not found"})
        }
        const isLiked=post.like.includes(userToLike._id)
        if(isLiked){
            await Post.findByIdAndUpdate(id,{$pull:{like:userToLike._id}})
            return res.status(200).json({message:"like removed"})
        }else{
            await Post.findByIdAndUpdate(id,{$push:{like:userToLike._id}})
            return res.status(200).json({message:"liked"})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
export async function Reply(req,res){
    try {
        const {id}=req.params
        const {text}=req.body
        const email=req.user.email
        const profilepic=req.user.profilePic
        const userId=req.user._id
        const userToReply=await User.findById(userId).select("-password")
        const post =await Post.findById(id)
        if(!post){
            return res.status(404).json({message:"post not found"})
        }
        if(!userToReply){
            return res.status(404).json({message:"not found"})
        }
        const reply={email,profilepic,text,author:userId}
        await post.comments.push(reply)
        await post.save()
        return res.status(200).json({message:`${email} replied to the post`})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    

}
export async function DeleteComment(req,res){
    try {
        const {pId,commentId}=req.params
        const userId=req.user._id
        const userToDelete=await User.findById(userId).select("-password")
        const post =await Post.findById(pId)
        if(!post){
            return res.status(404).json({message:"post not found"})
        }
        if(!commentId){
            return res.status(404).json({message:"invalid comment id"})
        }
        const commentToDelete=post.comments.findIndex((c)=>(c._id.equals(commentId)&&c.author.equals(userId)))
        if(!userToDelete){
            return res.status(404).json({message:"not found"})
        }
        if(commentToDelete===-1){
            return res.status(404).json({message:"no comment found"})
        }
        await post.comments.splice(commentToDelete,1)
        await post.save()
        return res.status(200).json({message:`Comment deleted successfully`})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}