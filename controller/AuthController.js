const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Commments=require('../models/comments')

module.exports.getLogin=function(req,res){
    return res.render('Login.ejs',{
        title:'Codeial',
        messages:{
            
        },
        
    })
}


module.exports.login=function(req,res){

}


module.exports.getRegisteration=function(req,res){
    return res.render('Register.ejs',{
        title:'Codeial',
        messages:'none'
    })
}

module.exports.Register=async function(req,res){
    try{
        var userDoc=await user.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        })
       // console.log('user',userDoc)
     return res.redirect('/login')
    }catch(err){
        return res.send('User Exists')
    }
}
