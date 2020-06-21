const express=require('express')
const postController=require('../../../controller/postController')
const router=express.Router()

router.post('/create-post',postController.createPost)

router.get('/delete-post/:id',postController.deletePost)

router.get('/like/:id',postController.likePost)

router.get('/unlike/:id',postController.unlikePost)

module.exports=router