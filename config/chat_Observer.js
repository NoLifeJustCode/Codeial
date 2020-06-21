const user=require('../models/User')
const room=require('../models/room')
const mongoose=require('mongoose')
const chats=require('../models/Message')
module.exports.checkSocket=(io)=>{
   socketMap=new Map()
   io.on('connection',function(socket){

        console.log('connection success',socket.id)
        socket.emit('message',"hi")
        var rooms=null
        socket.on('init_room',async function(data){
            var roomId=data.roomId,userId=data.userId
            console.log('initializing')
            var username=await user.findById(userId).select('name')
            var roomData=await room.findById(roomId).select('chats').populate('chats')
            var message={
                roomId:roomId,
                data:roomData,
                username:username,
            }
            console.log(message)
            socket.join(roomId)
            socket.emit('init',message)
        })

        socket.on('message',async function(message){
            console.log('message recieved')
            var doc=await chats.create({
                content:message.content,
                user:message.userId
            })
            console.log('message data',doc)
            await room.findByIdAndUpdate(message.roomId,{
                $push:{chats:doc.id}
            })
            io.to(message.roomId).emit('message',message)
        })

   })
}