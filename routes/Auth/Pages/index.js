const router=require('express').Router()
const pagesController=require('../../../controller/pagesController')
const fs=require('fs')
const multer=require('multer')
const path=require('path')

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
//create page route
router.post('/createPage',(req,res,next)=>{
    
    if(req.body.img!=''){
        console.log("upload middleware",req.body)
        upload.single('img')(req,res,next)
    }else
        {
            console.log('no img')
            next()
        }
},pagesController.createPage)

//Get a particular page
router.get('/:id',pagesController.getPage)
//get all pages
router.get('/',pagesController.getPages)

router.post('/create-post/:id',(req,res,next)=>{
    
    if(req.body.img!=''){
        console.log("upload middleware",req.body)
        upload.single('img')(req,res,next)
    }else
        {
            console.log('no img')
            next()
        }
},pagesController.createPost)


router.get('/like/:id',pagesController.AddFollower)


router.get('/unlike/:id',pagesController.RemoveFollower)
module.exports=router