/**
 * Import express and routes handlers
 */
const express=require('express')
const postRoute=require('./Posts/index')
const commentRoute=require('./Comments/index')


const router=express.Router()

//handler for post routes
router.use('/post',postRoute)
//comments route handler
router.use('/comment',commentRoute)
//pages route handler
router.use('/pages',require('./Pages/index'))
//Friends router handler
router.use('/Friends',require('./Friends/index'))
//logout and clear session
router.post('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/unAuth/login')
})
//home page
router.get('/',require('../../controller/homeController').home
 )
module.exports=router