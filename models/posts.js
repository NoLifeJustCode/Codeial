const mongoose=require('mongoose')
const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,

    },
    comments:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Comment'
    }],
    CreatedUser:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    },
   Likes:[{
       type:mongoose.SchemaTypes.ObjectId,
       ref:'User'
   }],
   img:{
       type:String
   }
})

module.exports=mongoose.model('Post',postSchema)