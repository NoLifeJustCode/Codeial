const express=require('express')
const commentController=require('../../../controller/commentController')
const router=express.Router()


router.post('/create-comment/:id',commentController.createComment)


router.get('/delete-comment/:id',commentController.deleteComment)

router.get('/like/:id',commentController.likeComment)

router.get('/unlike/:id',commentController.unlikeComment)

module.exports=router