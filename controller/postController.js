const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Commments=require('../models/comments')


module.exports.createPost=async (req,res)=>{
   // console.log('user',req.user)
    var reactionId=await mongoose.Types.ObjectId()
    var postData=await posts.create({
        content:req.body.content,
        CreatedUser:req.user._id,
    
    })
    
    await user.findByIdAndUpdate(req.user.id,{
        $push:{'Posts':postData._id}
    })
  //  console.log('createdPost',postData)
    return res.redirect('back')
}
module.exports.deletePost=async (req,res)=>{
    try{
        //console.log(req.params.id)
        var doc=await posts.findById(req.params.id);
        if(doc&&doc.CreatedUser.equals(req.user.id))
            {
                doc=await posts.findByIdAndDelete(req.params.id)
                 await  user.findByIdAndUpdate(req.user.id,{
                    $pull:{'Posts':doc.id}
                })
                await Commments.deleteMany({_id:{$in:doc.comments}},function(err,n){
                    //console.log(n)
                })
            }
        //console.log('Deleted',doc)
        return res.redirect('back')
    }catch(e){
        console.log('error',e)
        return res.redirect('back')
    }
}
module.exports.likePost=async(req,res)=>{

    try{
        var like=await posts.findOneAndUpdate({
            _id:req.params.id,
            Likes:{$ne:req.user.id}
        },{
            $push:{Likes:req.user.id}
        })

        if(like){
            await user.findByIdAndUpdate(req.user.id,{$push:{LikedPosts:like.id}});
        }
        return res.redirect('back')
    }catch(e){
        return res.redirect('back')
    }
}
module.exports.unlikePost=async(req,res)=>{

    try{
        var like=await posts.findOneAndUpdate({
            _id:req.params.id,
            
        },{
            $pull:{Likes:req.user.id}
        })

        if(like)
        {
            await user.findByIdAndUpdate(req.user.id,{$pull:{LikedPosts:like.id}})
        }
        return res.redirect('back')
    }catch(e){
        return res.redirect('back')
    }
}