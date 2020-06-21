const mongoose=require('mongoose')
const commentSchema=new mongoose.Schema({
        content:{
            type:String,
            required:true,
        },
        Post:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'Post'
        },
        User:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'User'
        },
        Likes:[{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'User'
        }],
        img:{
            type:String
        }
})
module.exports=mongoose.model('Comment',commentSchema)