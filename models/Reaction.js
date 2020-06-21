const mongoose =require('mongoose')
const ReactionSchema=new mongoose.Schema({
    Post:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    },
    Comment:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Comment'
    },
    Like:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }]
})
module.exports=mongoose.model('Reaction',ReactionSchema)