const express=require('express')
const multer=require('multer')
const path=require('path')

const upload=multer({storage:multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../../../userUploads/',req.user.id))
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
router.get('/add-friend/:id',friendController.addFriend)
router.get('/accept/:id',friendController.accept)
router.get('/remove/:id',friendController.removeFriend)
router.get('/reject/:id',friendController.reject)
router.get('/profile/:id',friendController.profile)
router.get('/roomId/:id',friendController.roomId)
router.post('/upload',upload.single('img'),friendController.upload)
router.get('/messenger',friendController.messenger)
router.get('/Read/:id',friendController.Read)

module.exports=router