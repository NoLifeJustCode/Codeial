const stratergy=require('passport-local').Strategy
class PassportAuth{
    constructor(passport,getUser,check){
        this.passport=passport
        // this.init(this.passport,getUser,check)
    }
     LocalStratergy(StratergyName,getUser,check,usernameField="username",passwordField="password"){
         
        this.passport.use(StratergyName,new stratergy({
            usernameField:usernameField,
            passwordField:passwordField
        },async (username,password,done)=>{
            console.log('Authenticating')
            try{
            var user=await getUser(username,password)
           // console.log(user)
            if(user)
            return done(null,user)
            return done(null,false)
            }catch(e){
                done(e,null)
            }
        })
        )
    
        this.passport.serializeUser((user,done)=>{
            console.log('serializing')
            done(null,user.id)
        })
    
        this.passport.deserializeUser(async(user,done)=>{
            console.log('des')
            done(null,await check(user))
        })
    }
}

module.exports=PassportAuth