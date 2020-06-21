const mongoose=require('mongoose')
const db=require('../config/mongoose')
const Schema=mongoose.Schema
const messageSchema=new Schema({
    content:{
        type:String,
    },
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true})
module.exports=mongoose.model('Message',messageSchema)