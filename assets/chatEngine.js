class chatBox{
    constructor(roomId,userId,socket,data){
        this.roomId=roomId,
        this.userId=userId
        this.socket=socket
        this.data=[]
       this.connect()
    }
    loadChats=(id)=>{
        var messenger=$('#'+id)
        var messageList=messenger.children('.messageList')
        messageList.children().remove()
        
        console.log(this.data)
        for (let message of this.data){
            console.log(message)
            message.time="16:20"
            message.userId=message.user
            
            this.addMessage(message)
        }
        messageList.scrollTop(messageList.height())
    }
    createMessage=(message)=>{
        var item=$('<div/>')
        var messageBox=$('<div/>',{
            'class':message.userId==this.userId?"sendMessage messageBox":"messageBox recievedMessage",
            
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
            'class':message.userId==this.userId?'username textRight':'username textLeft',
            html:message.userId
        }))
        return item;
    }
    addMessage=(message)=>{
        var messenger=$('#room')
        var messageList=messenger.children('.messageList')
        message.time="16:20"
        messageList.append(this.createMessage(message))
        messageList.scrollTop(messageList.height())
    }
    connect=()=>{
        this.socket.emit('init_room',{
            roomId:this.roomId,
            userId:this.userId
        })
        this.socket.on('init',(data)=>{
                console.log(data)
                this.username=data.username
                this.data=data.data.chats;
                this.loadChats('room');
        })
    }
    send=(data)=>{
        var message={
            content:data,
            userId:this.userId,
            username:this.username,
            roomId:this.roomId
        }
        this.data.push(message)
        this.socket.emit('message',message)
        this.addMessage(message)
    }
    receive=(data)=>{
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
        
        this.socket.on('connect',()=>{
            console.log('connection success')
            console.log(this.socket)
            this.socket.on('message',this.receive)
        })
    }
    
    join_room=(id)=>{
        console.log("joining room ",id)
        var host="http://localhost:3000/Auth/Friends/roomId/"+id
        var temp=$.get({
            url:host,
            withCredentials:true,
        },async(data)=>{
                if(!this.rooms[data])
                    {
                        this.rooms[data]=new chatBox(data,this.userId,this.socket)
                        this.curRoom=data
                        return;
                    }
                this.rooms[data].loadChats('room')                
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
            if(this.curRoom!=data.roomId||this.curRoom==null)
                return;
            this.rooms[this.curRoom].receive(data)
     }
}

var chat=null
$(document).ready(function(){
   chat =new chatEngine($('temp').attr('attr'))
    function init(){
       $(".chat").click((event)=>{
           var target=$(event.target)
           console.log("chat ")
           chat.join_room(target.attr('id'))

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
        var target=$(event.target)
        chat.join_room(target.attr('id'))

    })
    }
    init()

})