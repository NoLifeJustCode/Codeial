const mongoose=require('mongoose')
const user=require('../models/User')
const posts=require('../models/posts')
const Commments=require('../models/comments')
const room=require('../models/room')


module.exports.reject=async(req,res)=>{

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
}


module.exports.profile=async(req,res)=>{
try{
    
    console.log('params',req.params.id)
    var doc=await user.findById(req.params.id).populate('Friends')
    doc=await posts.populate(doc,{
        path:'Posts',
        
    })
    console.log('Profile ',doc)
    doc =await Commments.populate(doc,{
        path:"Posts.comments"
    })
    doc=await user.populate(doc,{
        path:"Posts.comments.User",
        select:'name avatar'
    })
     console.log("comments",doc)
    var profile={
        name:doc.name,
        avatar:doc.avatar,
        email:doc.email
    }

    if(!doc.Permission||doc.Permission=='public'||doc.Permission=='Friends')
        {   profile.Permission=true
            profile['friends']=doc.Friends,
            profile['posts']=doc.Posts
        }
        //console.log('profile',profile)
        return res.render('profile.ejs',{
            friends:profile.friends,
            posts:profile.posts,
            name:profile.name,
            avatar:profile.avatar,
            id:doc.id,
            Permission:profile.Permission,
            user:req.user,
            email:profile.email
        })
}catch(err){
    console.log(err)
    return res.redirect('back')
}
}



module.exports.addFriend=async (req,res)=>{
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
}
module.exports.accept=async(req,res)=>{

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
                    //console.log('Accept',doc)
                    return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.redirect('back')
    }
    }

module.exports.removeFriend=async (req,res)=>{

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
    }



    module.exports.upload=async(req,res)=>{
        try{
            
            var filePath=String(req.file.path)
            filePath=filePath.substring(filePath.indexOf('\\userUploads'))
            console.log('filePath',filePath)
            await user.findByIdAndUpdate(req.user.id,{avatar:filePath})
            return res.redirect('back')
        }catch(e){
            console.log(e)
            return res.send('error uploading file')
        }
    }

    module.exports.roomId=async function(req,res){
        try{
            console.log("params",req.params.id)
            let room_id=await user.findById(req.user.id).select({"Rooms":{$elemMatch:{user_id:req.params.id}}});
            
            
            if(room_id.Rooms.length==0)
                {   console.log("inside")
                    var doc=await room.create({
                        users:req.user.id,
                        
                    })
                    await room.findByIdAndUpdate(doc.id,{
                        $push:{users:req.params.id}
                    })
                    await user.findByIdAndUpdate(req.user.id,
                        {
                            $push:{"Rooms":{
                                
                                user_id:req.params.id,
                                room_id:doc.id
                        }
                    }})
                    await user.findByIdAndUpdate(req.params.id,
                        {
                            $push:{"Rooms":{
                                
                                user_id:req.user.id,
                                room_id:doc.id
                        }
                    }})
                    room_id=doc.id
                }
                else{
                   // console.log(room_id)
                    room_id=room_id.Rooms[0].room_id
                    
                }
                console.log("Room_id",room_id)
            return res.status(200).json(room_id)
            
        }catch(e){
            console.log(e)
           return  res.status(401).json("error")
        }
    }

    module.exports.messenger=async function(req,res){
        try{
            var rooms=await user.findById(req.user.id).select('name Rooms.user_id Rooms.unRead')
            // roooms=await room.populate(rooms,{
            //     path:"Rooms.room_id",
            //     select:''
            // })
            rooms=await user.populate(rooms,{
                    path:"Rooms.user_id",
                    select:'name avatar'
            })
            console.log("Rooms",rooms)
            //return res.json(200,rooms)
            return res.render('messages.ejs',{user:rooms}   )
           // return res.redirect('back')

        }catch(e){
            return res.redirect('back')
        }
    }
    module.exports.Read= async function(req,res){
        try{    
            console.log("setting Read")
            var doc=await user.findOneAndUpdate({
                _id:req.user.id,
                "Rooms.room_id":req.params.id
            },{
                $set:{"Rooms.$.unRead":0}
            },{upsert:true})
            //console.log(doc)
            return res.json(200,doc) 
        }catch(e){
            console.log(e)
            return res.status(322).json("Error")
        }
    }