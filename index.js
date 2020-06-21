const express=require('express')
const app=express()
const port=3000
const mongoose=require('mongoose')
const unAuth=require('./routes/UnAuth/index')
const passport=require('passport')
const room=require('./models/room')
const session=require('express-session')
const user=require('./models/User')
const flash=require('express-flash')
const bodyParser=require('body-parser')
const chatEngine=require('./config/chat_Observer')
// temp(passport,getUser,checkUser)
const p=require('./config/Authentication')
const temp=new p(passport,getUser,checkUser)
const SName="userAuth"
const path=require('path')
temp.LocalStratergy(SName,getUser,checkUser,'email')
async function getUser(email,password){
    var userDoc=await user.findOne({
        email:email,
    })
   // console.log( userDoc.verifyPassword(password))
    if(userDoc&& await userDoc.verifyPassword(password))
        return userDoc
    return null;

}
async function checkUser(id){
    var userDoc=await user.findById(id)
    //console.log(userDoc)
    return userDoc
}

app.set('view-engine' ,'ejs')
app.set('views','./views')
app.use('/assets',express.static(path.join(__dirname,'./assets')))
app.use('/userUploads',express.static(path.join(__dirname,'./userUploads')))
app.use(bodyParser.urlencoded({extended:true}))
const sessionMiddleware=session({
    secret:'Secret',
    resave:false,
    saveUninitialized:false,
})
app.use(sessionMiddleware)

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use((req,res,next)=>{
    console.log(req.body)
    next()
})




const http=require('http').createServer(app)
const socketIo=require('socket.io')(http)
socketIo.use(function(socket,next){
    sessionMiddleware(socket.request,{},next)
})
chatEngine.checkSocket(socketIo)
http.listen(3000,()=>{
    console.log('listening on port 3000')
})



app.use('/unAuth',checkAuthorize,unAuth)
app.use('/Auth',checkAuthenticated,require('./routes/Auth/index'))










//Posts and Comments




//Friends 


app.get('/add-friend/:id',checkAuthenticated,async (req,res)=>{
        try{    
            var doc=await user.findOneAndUpdate({
                _id:req.params.id,
               'Requests':{'$ne':req.user.id}
            },{
                $push:{'Requests':req.user.id}
            },{
                upsert:true,
                
            })
           // console.log('add Friend',doc)
            return res.redirect('back')

        }catch(e)
        {
            console.log(e)
            return res.redirect('back')
        }
})

app.get('/accept/:id',checkAuthenticated,async(req,res)=>{

    try{
                var doc=await user.findByIdAndUpdate(
                    req.user.id,{
                        $push:{Friends:req.params.id},
                        $pull:{Requests:req.params.id}
                    }
                    ,{
                        upsert:true,
                        runValidators:true,
                    }
                    )
                await user.findByIdAndUpdate(req.params.id,{
                    $push:{'Friends':doc.id}
                },{
                    upsert:true
                })
                    console.log('Accept',doc)
                    return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
})


app.get('/remove/:id',checkAuthenticated,async (req,res)=>{

    try{
        var doc=await user.findByIdAndUpdate(
            req.user.id,{
                $pull:{Friends:req.params.id}
            }
            ,{
                upsert:true,
                
            }
            )
         await user.findByIdAndUpdate(req.params.id,{$pull:{'Friends':doc.id}})
            return res.redirect('back')
        
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
})


app.get('/reject/:id',checkAuthenticated,async(req,res)=>{

    try{
                var doc=await user.findByIdAndUpdate(
                    req.user.id,{
                        $pull:{Requests:req.params.id}
                    }
                    ,{
                        upsert:true,
                        runValidators:true,
                    }
                    )
                    return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
})

app.get('/profile/:id',checkAuthenticated,async(req,res)=>{
    try{
        var doc=await user.findById(req.params.id).populate('Friends').populate('Posts')
       // console.log(doc)
        var profile={
            name:doc.name,
        }
        if(!doc.Permission||doc.Permission=='public'||doc.Permission=='Friends')
            {   profile.Permission=true
                profile['friends']=doc.Friends,
                profile['posts']=doc.Posts
            }
            console.log('profile',profile)
            return res.render('profile.ejs',{profile:profile,id:req.user.id})
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
})

function checkAuthenticated(req,res,next){
        if(req.isAuthenticated())
            next()
        else
            res.redirect('/unAuth/login')
}

function checkAuthorize(req,res,next){
    if(req.isAuthenticated())
        return res.redirect('/')
    next()
}