const user=require('../models/User')
const pages=require('../models/pages')
const post=require('../models/posts')
const comments=require('../models/comments')
module.exports.createPage=async function(req,res){
    try{
        var filePath='';
        
        if(req.file)//handle file not uploaded
        {
            filePath=String(req.file.path)
            filePath=filePath.substring(filePath.indexOf('\\userUploads'))
        }
        //create page
        let doc=await pages.create({
            name:req.body.name,
            avatar:filePath,
            info:req.body.info,
            Admins:req.user.id,
            followers:req.user.id,
        })
        // push page id into admin and pages following of the created user 
        let data=await user.findByIdAndUpdate(req.user.id,{
            $push:{
                PagesFollowing:doc._id,
                Admin:doc.id
                }
        },{new:true})
       
        return res.redirect('back')
    }catch(e){
        console.log(e)
        return res.send(401,"Error Creating page")
    }
}

module.exports.getPage=async function(req,res){
    try{    

            //get page with id
            let pagesDoc=await pages.findById(req.params.id).populate('Posts')
            //populate posts
            pagesDoc=await comments.populate(pagesDoc,{
                path:'Posts.comments',
            })
            //populate users data
            pagesDoc=await user.populate(pagesDoc,{
                path:'Admins followers Posts.comments.User',
                select:'name avatar'
            })
            // check if admin or is following page
            let isAdmin=req.user.Admin.some((id)=>{
                return id==pagesDoc.id;
            })
            let isLiked=isAdmin||req.user.PagesFollowing.some((id)=>{
                return id==pagesDoc.id
            })
           
            return res.render('pages.ejs',{
                Followers:pagesDoc.followers,
                posts:pagesDoc.Posts,
                page:{
                    name:pagesDoc.name,
                    avatar:pagesDoc.avatar,
                    info:pagesDoc.info,
                    id:pagesDoc.id
                },
                user:req.user,
                isAdmin,
                isLiked

            })
    }catch(e){
        console.log(e)
       return res.send(404,"Page not found")
    }
}

module.exports.getPages=async function(req,res){
    try{
        //get all pages
        let pagesList=await pages.find({}).select('name avatar info')
        
        return res.render('pagesView.ejs',{
            pages:pagesList,
            user:req.user
        })
    }catch(e){
        console.log(e)
        return res.send(404,"Error")
    }
}

module.exports.createPost=async (req,res)=>{
    // console.log('user',req.user)

    var filePath=''
    if(req.file)//handle if img is not present
    {
        filePath=String(req.file.path)
        filePath=filePath.substring(filePath.indexOf('\\userUploads'))
    }
     //var reactionId=await mongoose.Types.ObjectId()
     //create post
     var postData=await post.create({
         content:req.body.content,
         CreatedUser:req.user._id,
         img:filePath
     })
     //push post id to page 
     let pageData=await pages.findByIdAndUpdate(req.params.id,{
         $push:{Posts:postData.id}
     },{upsert:true,new:true})

    
  
     return res.redirect('back')
 }

 module.exports.AddFollower=async function(req,res){
     try{
         // add followewr to page
            let pageData=await pages.findByIdAndUpdate(req.params.id,{$push:{followers:req.user.id}});
            await user.findByIdAndUpdate(req.user.id,{$push:{PagesFollowing:pageData.id}})
            return res.redirect('back')
     }catch(e){
         console.log('AddFollwoer',e)
         return res.send(404,"Error")
     }
 }

 module.exports.RemoveFollower=async function(req,res){
     try{
         //pull follower from the page
        let pageData=await pages.findByIdAndUpdate(req.params.id,{$pull:{followers:req.user.id}});
        await user.findByIdAndUpdate(req.user.id,{$pull:{PagesFollowing:pageData.id}})
        return res.redirect('back')
     }catch(e){
         console.log('Remove Follower',e)
         return res.send(404,"Error")
     }
 }