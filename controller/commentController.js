const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Commments=require('../models/comments')


module.exports.createComment=async(req,res)=>{
    try{
        var doc=await Commments.create({
            Post:req.params.id,
            User:req.user._id,
            content:req.body.content,
        })
        await user.findByIdAndUpdate(req.user.id,{
            $push:{'Comments':doc.id}
        })
        await posts.findByIdAndUpdate(req.params.id,{
            $push:{'comments':doc.id}
        })
        return res.redirect('back')
    }catch(e){
        return res.redirect('back')
    }
}

module.exports.deleteComment=async(req,res)=>{
    try{
        var doc=await Commments.findOneAndDelete({
            id:req.param.id,
            User:req.user._id,
        })
        if(doc){
            await user.findByIdAndUpdate(req.user._id,{
                $pull:{Comments:doc.id}
            })
            await posts.findByIdAndUpdate(doc.Post,{
                $pull:{comments:doc.id}
            })
        }
       // console.log('deleted Comment',doc)
        return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
}


module.exports.likeComment=async(req,res)=>{

    try{
        var like=await Commments.findOneAndUpdate({
            _id:req.params.id,
            Likes:{$ne:req.user.id}
        },{
            $push:{Likes:req.user.id}
        })
    //    console.log('Like',like)
        if(like){
            await user.findByIdAndUpdate(req.user.id,{$push:{LikedComments:like.id}});
        }
        return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
}


module.exports.unlikeComment=async(req,res)=>{

    try{
        var like=await Commments.findOneAndUpdate({
            _id:req.params.id,
            
        },{
            $pull:{Likes:req.user.id}
        })

        if(like)
        {
            await user.findByIdAndUpdate(req.user.id,{$pull:{LikedComments:like.id}})
        }
        return res.redirect('back')
    }catch(e){
        return res.redirect('back')
    }
}