const express=require('express')
const router=express.Router()
const AuthController=require('../../controller/AuthController')
const passport=require('passport')
const SName="userAuth"
router.get('/login',AuthController.getLogin)

router.post('/login',passport.authenticate(SName,{
    successRedirect:'/Auth/',
    successFlash:'sucess',
    failureRedirect:'/unAuth/Register',
    failureFlash:'Incorrect'
}))

router.get('/Register',AuthController.getRegisteration)

router.post('/Register',AuthController.Register)


module.exports=router