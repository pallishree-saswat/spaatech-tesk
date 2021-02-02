const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const { jwtSecret } = require('../config/default.json')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
//api - 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

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))



router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
          return res.status(422).json({error:"user already exists with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                  email,
                  password:hashedpassword,
                  name,
                  pic
                  
              })
      
              user.save()
              .then(user=>{
    
               res.json({message:"saved successfully"})
              })
              .catch(err=>{
                  console.log(err)
              })
        }).catch(err=>{
            console.log(err)
          })
       
    })
    .catch(err=>{
      console.log(err)
    })
  })


  router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},process.env.jwtSecret)
               const {_id,name,email,following,followers,pic} = savedUser
               res.json({token,user:{_id,name,email,following,followers,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


  module.exports = router;