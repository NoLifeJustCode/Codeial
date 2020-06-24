class chatBox{
    constructor(roomId,userId,socket,itemId,username,avatar){
        this.roomId=roomId
        this.userId=userId
        this.socket=socket
        this.data=[]
        this.itemId=itemId
        this.unRead=0
        this.friendName=username
        this.avatar=avatar
       this.connect()
    }
    setHeader=()=>{
        $(".header .avatar").attr("src",this.avatar)
        $(".header .name").html(this.friendName)

    }
    loadChats=(id)=>{
        this.setHeader()
        var messenger=$('#'+id)
        this.unRead=0;
        var messageList=messenger.children('.messageList')
        messageList.children().remove()
        
        console.log(this.data)
        for (let message of this.data){
            console.log(message)
            message.time="16:20"
            
            
            this.addMessage(message)
        }
      //  messageList.scrollTop(messageList.prop("scrollHeight"))
    }
    createMessage=(message)=>{
        var item=$('<div/>')
        var messageBox=$('<div/>',{
            'class':message.user._id==this.userId?"sendMessage messageBox":"messageBox recievedMessage",
            
        })
        messageBox.append($('<div/>',{
            'class':'message',
            html:message.content
        }))
        messageBox.append($('<div/>',{
            'class':'time',
            html:message.time
        }))
        item.append(messageBox)
        item.append($('<div/>',{
            'class':message.user._id==this.userId?'username textRight':'username textLeft',
            html:message.user.name
        }))
        return item;
    }
    addMessage=(message)=>{
        console.log("add Message")
        var messenger=$('#room')
        var messageList=messenger.children('.messageList')
        message.time="16:20"
        messageList.append(this.createMessage(message))
        console.log("messageList.height()",messageList.height())
        messageList.scrollTop(messageList.prop("scrollHeight"))
    }
    connect=()=>{
        this.socket.emit('init_room',{
            roomId:this.roomId,
            userId:this.userId
        })
        this.socket.on('init_'+this.roomId,(data)=>{
                console.log(data)
                this.username=data.username.name
                this.data=data.data.chats;
                this.unRead=data.unRead
                this.loadChats('room');
        })
    }
    send=(data)=>{
        var message={
            content:data,
            user:{
                _id:this.userId,
                name:this.username,
            },
            roomId:this.roomId
        }
        this.data.push(message)
        this.socket.emit('message',message)
        this.addMessage(message)
    }
    receive=(data)=>{
        console.log(data)
        if(data.user._id==this.userId)
        return 
        this.data.push(data)
        this.addMessage(data)
    }

}


class chatEngine{
    constructor(userId){
        this.userId=userId
        this.recieveEvent={}
        this.rooms={}
        this.curRoom=null
        this.io=io('http://localhost:3000/')
        this.socket=this.io.connect()
        this.unReadRooms=0
        this.socket.on('connect',()=>{
            console.log('connection success')
            console.log(this.socket)
            this.socket.on('message',this.receive)
        })
    }
    
    join_room=(id,username,avatar)=>{
        console.log("joining room ",id)
        var host="http://localhost:3000/Auth/Friends/roomId/"+id
        var temp=$.get({
            url:host,
            withCredentials:true,
        },async(data)=>{
            console.log("room_id",data)
                if(!this.rooms[data])
                    {
                        this.rooms[data]=new chatBox(data,this.userId,this.socket,id,username,avatar)
                        this.curRoom=data
                        if(this.rooms[data].unRead>0){
                            $.get({
                                url:'http://localhost:3000/Auth/Friends/Read/'+data,
                                withCredentials:true,
                            },(data)=>{
                                console.log("Successful read Set")
                            })
                        }
                        return;
                    }
                this.rooms[data].loadChats('room')   
                this.setRead(0,this.rooms[data].itemId)             
                this.curRoom=data
        })
     }

     send=(data)=>{
         if(this.curRoom==null)
            return;
         this.rooms[this.curRoom].send(data)
         return;
    }

     receive=(data)=>{
            console.log(data)
            if(!this.rooms[data.roomId]){
                {
                    this.unReadRooms++;
                  //  this.setRead(1,data.user.id)
                }
            }else if(this.curRoom !=data.roomId){
                this.rooms[data.roomId].data.push(data)
                this.rooms[data.roomId].unRead++;
                this.setRead(this.rooms[data.roomId].unRead,this.rooms[data.roomId].itemId)
            }else
                this.rooms[this.curRoom].receive(data)
     }
     setRead=(unRead,id)=>{
         var item=$("#"+id+" .notify")
         item.html(unRead)
         unRead>0?item.show():item.hide()
         return;
     }
}

var chat=null
$(document).ready(function(){
   chat =new chatEngine($('temp').attr('id'))
    function init(){
       $(".chat").click((event)=>{
           var target=$(event.target)
           var avatar=$(target.find(".avatar"))
           var username=$(target.find(".name"))
           console.log("chat")
           chat.join_room(target.attr('id'))
           $("#room").show()
       })

       $(".messageContainer .send").click((event)=>{
           var mess=$(".messageContainer .message")
           if(mess.val()!="")
           {
               chat.send(mess.val())
           }
           mess.val("");
       })

       $(".messageNotification").click((event)=>{
        var target=$(event.currentTarget)
        chat.join_room(target.attr('id'))

        })

        $("#room .close").click((event)=>{
            $("#room").hide()
        })
        $("li.item").click((event)=>{
            var target=$(event.currentTarget)
            var id=target.attr('id')
            var avatar=target.find(".avatar").attr("src")
            var username=target.find(".name").html()
            console.log(id,avatar,username)
            chat.join_room(id,username,avatar)
            $("#room").show()
        })
        $("#postImg").click((e)=>{
            $(".MakePost input[type='file']").click()
        })
    }
    init()

})