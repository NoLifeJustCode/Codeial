const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Commments=require('../models/comments')


module.exports.createPost=async (req,res)=>{
   // console.log('user',req.user)
   var filePath=''
   if(req.file)// handle if file is not uploaded
    {
        filePath=String(req.file.path)
        filePath=filePath.substring(filePath.indexOf('\\userUploads'))
    }
    //var reactionId=await mongoose.Types.ObjectId()//create rea
    var postData=await posts.create({//create post
        content:req.body.content,
        CreatedUser:req.user._id,
        img:filePath
    })
    //push post id to user
    await user.findByIdAndUpdate(req.user.id,{
        $push:{'Posts':postData._id}
    })
  //  console.log('createdPost',postData)
    return res.redirect('back')
}
module.exports.deletePost=async (req,res)=>{
    try{
        //console.log(req.params.id)
        //find post document
        var doc=await posts.findById(req.params.id);
        if(doc&&doc.CreatedUser.equals(req.user.id))//check if user who created post is same as logged in user
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
        //push user id to likes 
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
        //pull user id from likes of a post 
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