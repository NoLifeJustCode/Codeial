/**
 * Import express,passport,bodyParser,Session,chatEngine
 */
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
//custom Authentication class 
const p=require('./config/Authentication')
//create a instance of Authentication class 
const temp=new p(passport,getUser,checkUser)//creates a class for Authentication using getUser,checkUser
const SName="userAuth"//Stratergy Name
const path=require('path')
const github=require('./config/passport_github')//Github oauth stratergy
temp.LocalStratergy(SName,getUser,checkUser,'email')//get LocalStratergy from Authentication class
// call back to retrieve user 
async function getUser(email,password){
    var userDoc=await user.findOne({
        email:email,
    })
 
    if(userDoc&& await userDoc.verifyPassword(password))
        return userDoc
    return null;

}
//call back to check user existence
async function checkUser(id){
    var userDoc=await user.findById(id)

    return userDoc
}
//Setup app for template engine,static files,session and passport
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
   // console.log(req.body)
    next()
})


//setup http server for websockets 

const http=require('http').createServer(app)
const socketIo=require('socket.io')(http)
socketIo.use(function(socket,next){
    sessionMiddleware(socket.request,{},next)
})
chatEngine.checkSocket(socketIo)
//attach server to port 300 and listen for connection
http.listen(3000,()=>{
    console.log('listening on port 3000')
})


//Routes are divided into Authenticated or UnAuth(Reqister or login)
app.use('/unAuth',checkAuthorize,unAuth)
app.use('/Auth',checkAuthenticated,require('./routes/Auth/index'))

//redirect to unAuth 
app.get('/',function(req,res){
    return res.redirect('/unAuth/login')
})
//Accessorty function for conditional routing
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