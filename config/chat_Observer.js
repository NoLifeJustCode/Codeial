const user=require('../models/User')
const room=require('../models/room')
const mongoose=require('mongoose')
const chats=require('../models/Message')
//create a socket and manage all socket conenction ,creating rooms ,messages etc 
module.exports.checkSocket=(io)=>{
   socketMap=new Map()
   io.on('connection',function(socket){

        //console.log('connection success',socket.id)
        socket.emit('message',"hi")
        var rooms=null
        socket.on('init_room',async function(data){
            var roomId=data.roomId,userId=data.userId
          //  console.log('initializing')
            var username=await user.findById(userId).select('name')//retrieve room
            var roomData=await room.findById(roomId).select("chats").populate("chats")// populate all the chats
            roomData=await user.populate(roomData,{
                path:"chats.user",
                select:"name "
            })
            //console.log("roomData",roomData)
            var message={
                roomId:roomId,
                data:roomData,
                username:username,
            }
            //console.log(message)
            socket.join(roomId)
            socket.emit('init_'+roomId,message)//init rooms
        })

        socket.on('message',async function(message){//pipeline chats betwen user
            console.log('message recieved')
            var doc=await chats.create({
                content:message.content,
                user:message.user._id
            })
            console.log('message data',doc)
            await room.findByIdAndUpdate(message.roomId,{
                $push:{chats:doc.id}
            })
            io.to(message.roomId).emit('message',message)
        })

   })
}