const mongoose=require('mongoose')
const db=require('../config/mongoose')
const Schema=mongoose.Schema
const bcyrpt=require('bcrypt')
const userSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile_no:{
        type:Number,
        
    },
    password:{
        type:String,
        required:true,

    },
    Posts:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    }],
    Comments:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Comment'
    }],
    Friends:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }],
    Requests:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }],
    Permission:{
        type:String,
        enum:['NoBody','Public','Friends'],
        default:'Friends'
    },
    LikedPosts:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Post'
    }],
    LikedComments:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Comment'
    }],
    avatar:{
        type:String,
        default:"https://image.flaticon.com/icons/svg/848/848043.svg"
    },
    Rooms:[{
        user_id:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'User'
        },
        room_id:{
                type:mongoose.SchemaTypes.ObjectId,
                ref:'Room'
            },
        unRead:{
            type:Number,
            default:0
        } 
    }]
    
},{timestamps:true})

//hash password
userSchema.pre('save',async function(next){
    
    const salt_rounds=10//Default salt_rounds
    console.log(this)
    console.log(this.password)
    this.password=await bcyrpt.hash(this.password,salt_rounds)
    next()
})
//validate email and mobile
userSchema.path('email').validate(function(email){
    var emailRegex=/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    return emailRegex.test(email)
},'email validation failed')

userSchema.path('mobile_no').validate(function(mobile){
    if(!mobile)
        return true;
    var mobileRegex=/^[0-9]{10}$/;
    console.log(mobileRegex.test(mobile))
    return mobileRegex.test(mobile)
},'mobile Validtion failed : Mobile number shld be of 10 digits and shld not start with 0')
//Instance methods to verify hashed passwords
userSchema.methods.verifyPassword= async function(password){
        return await bcyrpt.compare(password,this.password)
}



module.exports=db.model('User',userSchema)
