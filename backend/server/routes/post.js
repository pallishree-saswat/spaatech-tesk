const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post')
const requireLogin = require('../middleware/requireLogin')


//get all post
router.get('/allPost', requireLogin,(req,res) => {
    Post.find().populate("postedBy" ,["_id", "name","pic"])
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})

//get all followings  post
router.get('/getsubpost', requireLogin,(req,res) => {

    //if postedBy is in the following list then show the post of that posted by
    Post.find({postedBy:{$in: req.user.following}})
    .populate("postedBy" ,["_id", "name","pic"])
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})





//create a post
router.post('/createPost', requireLogin, (req,res) => {
   const { title , body, pic} = req.body

   console.log(title, body, pic)
   if(!title || !body || !pic){
       return res.status(422).json({error:'Please add all fields'})
   }
     const post = new Post({
         title, 
         body, 
         photo:pic,
         postedBy:req.user
     })
       console.log(req.user)
     post.save()
     .then(result => {
         res.json({post : result})
     })
     .catch(err => {
         console.log(err)
     })
})

//my post
router.get('/mypost',requireLogin, (req,res) => {
    Post.find({postedBy:req.user._id}).populate("postedBy", ["_id", "name"])
    .then(mypost =>{
        res.json({mypost})

    })
    .catch(err => {
        console.log(err)
    })
})


//like a post
router.put('/like',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes: req.user._id}
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



//unlike post
router.put('/unlike',requireLogin,(req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes: req.user._id}
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//add coment on post
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

//delete post
router.delete('/deletepost/:postId' , requireLogin , (req,res) => {
    Post.findOne({_id :req.params.postId})
    .populate("postedBy", "_id")
    .exec((err,post) => {
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err)
            })
        }
    })
})


//delete comment

 router.delete('/comments/:postId/:commentId',requireLogin,(req,res) => {
  
     const postId =req.params.postId
     const commentId =req.params.commentId
  
    Post.findByIdAndUpdate(postId, {
        $pull:{'comments': { _id : commentId }}
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


   //single post
   router.get('/allPost/:id', requireLogin,(req,res) => {
    Post.findById(req.params.id).populate("postedBy" ,["_id", "name","pic"])
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(post => {
        res.json({post})
    })
    .catch(err => {
        console.log(err)
    })
})



module.exports = router;