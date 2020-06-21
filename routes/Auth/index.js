const express=require('express')
const postRoute=require('./Posts/index')
const commentRoute=require('./Comments/index')
const mongoose=require('mongoose')
const user=require('../../models/User')
const posts=require('../../models/posts')
const Commments=require('../../models/comments')

const router=express.Router()


router.use('/post',postRoute)

router.use('/comment',commentRoute)

router.use('/Friends',require('./Friends/index'))
router.post('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/unAuth/login')
})
router.get('/',async (req,res)=>{
    try{
    var postList=await posts.find().populate('comments')
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
})
module.exports=router