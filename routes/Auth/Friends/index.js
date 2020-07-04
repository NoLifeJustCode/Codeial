const express=require('express')
const multer=require('multer')
const path=require('path')
const fs=require('fs')
const upload=multer({storage:multer.diskStorage({
    destination:(req,file,cb)=>{
        let destPath=path.join(__dirname,'../../../userUploads/',req.user.id);
        if(!fs.existsSync(destPath))
            {
                fs.mkdirSync(destPath)
            }
        cb(null,destPath)
    },
    filename:(req,file,cb)=>{
        var temp=new Date().toISOString().replace(/[\W_]+/g,"");
        temp+=""+req.user.id+""+path.extname(file.originalname)
       // cb(null,req.user.id+""+path.extname(file.originalname))
       cb(null,temp)
    }

}),
fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
},})
const friendController=require('../../../controller/FriendsController')

const router=express.Router()
//router.use(upload)
//Route handler for adding a freind
router.get('/add-friend/:id',friendController.addFriend)
//Route handler for accepting a request
router.get('/accept/:id',friendController.accept)
//Route handler for removing a friend
router.get('/remove/:id',friendController.removeFriend)
//Route handler for rejecting a request
router.get('/reject/:id',friendController.reject)
//Route handler for get a profile page
router.get('/profile/:id',friendController.profile)
//Route handler for create Dynamic chat room
router.get('/roomId/:id',friendController.roomId)
//Route handler for uploading image
router.post('/upload',upload.single('img'),friendController.upload)
//Route handler for settup of messenget and chats
router.get('/messenger',friendController.messenger)
router.get('/Read/:id',friendController.Read)

module.exports=router