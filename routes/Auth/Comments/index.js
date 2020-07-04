const express=require('express')
const commentController=require('../../../controller/commentController')
const router=express.Router()

//Route handler for creating comments
router.post('/create-comment/:id',commentController.createComment)

//Route handler for deleting comments
router.get('/delete-comment/:id',commentController.deleteComment)
//Route handler for liking a comment
router.get('/like/:id',commentController.likeComment)
//Route handler for removing a like
router.get('/unlike/:id',commentController.unlikeComment)

module.exports=router