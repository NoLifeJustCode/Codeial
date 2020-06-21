const mongoose=require('mongoose')
const url="mongodb://localhost:27017/Codeial"
mongoose.connect(url,{
    useNewUrlParser:true,
})
const db=mongoose.connection
db.on('error',()=>{
    console.error.bind(console,'Error connecting to db')
})

db.once('connect',function(){
    console.log('Connection Successful')
})
module.exports =db
