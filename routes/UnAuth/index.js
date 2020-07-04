const express=require('express')
const router=express.Router()
const AuthController=require('../../controller/AuthController')
const passport=require('passport')
const SName="userAuth"
//route handler for login
router.get('/login',AuthController.getLogin)

router.post('/login',passport.authenticate(SName,{
    successRedirect:'/Auth/',
    successFlash:'sucess',
    failureRedirect:'/unAuth/Register',
    failureFlash:'Incorrect'
}))
//route handler for github
router.get('/Github',(req,res,next)=>{
    console.log(req.url)
    next()
},passport.authenticate('Github',{
    
    failureRedirect:'/unAuth/Register',
   
}),(req,res)=>{
    console.log("Success")
    return res.redirect('/Auth/')
})

//route handler for Registering
router.get('/Register',AuthController.getRegisteration)

router.post('/Register',AuthController.Register)


module.exports=router