const mongoose=require('mongoose')
const db=require('../config/mongoose')
const Schema=mongoose.Schema
const roomSchema=new Schema({
    users:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }],
    chats:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Message'
    }],
    inviteLink:{
        type:String,
        
    }

},{timestamps:true})

module.exports=mongoose.model('Room',roomSchema)