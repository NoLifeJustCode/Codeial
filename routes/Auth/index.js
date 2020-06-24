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
router.get('/',require('../../controller/homeController').home
 )
module.exports=router