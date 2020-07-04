const passport=require('passport')
const githubStratergry=require('passport-github').Strategy
const user=require('../models/User')
// for temp password on github if user doesn't exist
const generator=require('generate-password')
passport.use('Github',new githubStratergry({
    clientID:"1f24557cf8b4d8adf225",
    clientSecret:"9b13fdf69cc1419c6f30e9ab64835af32c7d9aea",
    callbackURL:"http://localhost:3000/unAuth/Github",
    scope: [ 'user:email' ],//set scope for email
},
async function(accessToken,refreshToken,profile,done){
    try{
            
            console.log("profile",profile)
            let email=profile.emails.find(email=>email["primary"])["value"]//retrieve primary email
            console.log(email)
            let data=await user.findOne({email:email});//get user document
            
            if(!data){// if user doesn't exist
                let pass=generator.generate({
                    numbers:true,
                    length:10,
                    
                })//random password
                data=await user.create({
                    name:profile.username,
                    password:pass,
                    email:email,
                    avatar:profile._json.avatar_url
                })//createing user 
            }

            done(null,data)//callback
    }catch(e){
            //console.log('passport_github',e)
            return done(e,null)
    }

}))