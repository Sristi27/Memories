const express = require('express');
const router = express.Router();

const beforelog=require('../middleware/loginauth');

const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const User = mongoose.model('User')

// const bodyparser=require('body-parser');

const {secret} = require("../config/keys");


router.get("/user/:id",beforelog,(req,res)=>
{
    User.findOne({_id:req.params.id})
    .select("-password")   //all fields without password
     .then(
        user=>
        {
            Post.find({postedBy:req.params.id})
            .populate("postedBy","_id name")
            .exec((err,posts)=>
            {
                if(err)
                {
                    // return res.status(422).json({error:err})
                    console.log(err)
                }
                else{
                    return res.json({user,posts})  //all posts and the user
                }
            })
        }
    ).catch(err=>
        {
            return res.status(404).json({error:err})
        })
})


router.put("/follow",beforelog,(req,res) =>
{
     User.findByIdAndUpdate({_id:req.body.followId},
        {
            $push:{followers:req.user._id}
        },
        {new:true}
        ,
        (err,result)=>
        {
            if(err)
            {
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate({_id:req.user._id},
                    {
                        $push:{following:req.body.followId},
                        
                    },
                    {new:true}).select("-password") 
                    .then(
                        result=>
                        {
                            res.json(result)
                        }
                    )
                    .catch(err=>
                        {return res.status(404).json({error:err})}
                    )
                    
            
        })
})

router.put("/unfollow",beforelog,(req,res) =>
{
     User.findByIdAndUpdate({_id:req.body.unfollowId},
        {
            $pull:{followers:req.user._id}
        },
        {new:true}
        ,
        (err,result)=>
        {
            if(err)
            {
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate({_id:req.user._id},
                    {
                        $pull:{following:req.body.unfollowId},
                        
                    },
                    {new:true}).select("-password")  
                    .then(
                        result=>
                        {
                            res.json(result)
                        }
                    )
                    .catch(err=>
                        {return res.status(404).json({error:err})}
                    )
                    
            
        })
})

router.put("/updatepic",beforelog,(req,res)=>
{
    User.findByIdAndUpdate({_id:req.user._id},
        {$set:{image:req.body.url}},
        {new:true},
        (err,result)=>
        {
            if(err)
            {
                return res.status(422).json({error:err})
            }
            res.json(result);
            
        })
})


module.exports=router