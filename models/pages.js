const mongoose=require('mongoose')

const pagesSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:'/userUploads/default'
    },
    info:{
        type:String,

    },
    Posts:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post',
       
    }],
    Admins:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
       
    }],
    followers:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        
    }]

},{timestamps:true})

module.exports=mongoose.model('Pages',pagesSchema)
