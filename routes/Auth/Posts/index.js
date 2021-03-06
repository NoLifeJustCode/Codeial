const express=require('express')
const postController=require('../../../controller/postController')
const router=express.Router()
const multer=require('multer')
const path=require('path')
const fs=require('fs')

/**
 * setup multer for img upload
 */
const upload=multer({storage:multer.diskStorage({
    destination:(req,file,cb)=>{
        let destPath=path.join(__dirname,'../../../userUploads/',req.user.id);
        if(!fs.existsSync(destPath))
            {
                fs.mkdirSync(destPath)
            }
        cb(null,destPath)//setup directory if doesn;t exist
    },
    filename:(req,file,cb)=>{
        var temp=new Date().toISOString().replace(/[\W_]+/g,"");
        temp+=""+req.user.id+""+path.extname(file.originalname)
       // cb(null,req.user.id+""+path.extname(file.originalname))
       cb(null,temp)
    }//setup filename

}),
fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {//only use images or throw error
        return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
},

})

//route handler for creating post
router.post('/create-post',(req,res,next)=>{
    
    if(req.body.img!=''){
        console.log("upload middleware",req.body)
        upload.single('img')(req,res,next)
    }else
        {
            console.log('no img')
            next()
        }
},
postController.createPost)
//route handler for deleing post
router.get('/delete-post/:id',postController.deletePost)
//like or remove like from a post
router.get('/like/:id',postController.likePost)

router.get('/unlike/:id',postController.unlikePost)

module.exports=router