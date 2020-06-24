const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Comments=require('../models/comments')
const room=require('../models/room')

module.exports.home=async function(req,res){
    try{
        var postList=await posts.find().populate('comments CreatedUser')
        console.log("before",postList[4].comments)
        postList=await user.populate(postList,{
             path:"comments.User",
             select:"name avatar"
         })
        console.log("postList",postList[4].comments)
        var friends=await user.findById(req.user.id).select('Friends').populate('Friends')
        var userList=await user.find({_id:{'$nin':friends.Friends}}).select('name Requests avatar')
        var Requests=await user.findById(req.user.id).select('Requests').populate('Requests')
        
        return res.render('home.ejs',{
            'posts':postList,
            user:req.user,
            Friends:friends.Friends,
            users:userList,
            Requests:Requests.Requests
        })
    }
    catch(e){
        console.log(e)
        return res.send('error')
    }
}
