const express = require('express');
const router = express.Router();

const beforelog=require('../middleware/loginauth');

const mongoose = require('mongoose');
const Post = mongoose.model("Post");

// const bodyparser=require('body-parser');

const {secret} = require("../config/keys");

router.post('/createpost',beforelog,(req,res)=>
{
 const {title,body,url}=req.body;
//  console.log(title,body,url)
 if(!title || !body || !url)
 {
 	return res.status(422).json({message:"Please add all the fields!"});
  }
  req.user.password=undefined;
  const post=new Post({
     	title,
		body,
		image:url,
     	postedBy:req.user
    	})

    	post.save().
    	then(result=>
        	{
           	res.json({message:"Post saved successfully",post:result});
        	})
        	.catch(err=>
            	{
                	console.log(err);
            	})
 

})



router.get("/allposts",beforelog,(req,res)=>
{
  Post.find()
  .populate("postedBy","_id name image")
  .populate("comments.postedBy","_id name") 
  //shows all the fields of posted by (populate with id and name only)
  .then(posts=>
	{
    	res.json({posts:posts})
	})
	.catch(
    	err=>
    	{
        	res.status(404).json({error:"Posts not found"})
    	}
	)
})

router.get("/getmyfollowingposts",beforelog,(req,res)=>
{

//search in current logged in user's following array and only their posts will be displayed
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name") 
  //shows all the fields of posted by (populate with id and name only)
  .then(posts=>
	{
    	res.json({posts:posts})
	})
	.catch(
    	err=>
    	{
        	res.status(404).json({error:"Posts not found"})
    	}
	)
})


router.get('/mypost',beforelog,(req,res)=>
{
	Post.find({postedBy:req.user._id})
	.populate("postedBy","_id name")
	.then(
    	post=>
    	{
        	res.json({post})
    	}
	).catch(err=>console.log(err))
})


router.put("/like",beforelog,(req,res)=>
{
	// console.log(req.body.post_id)
  Post.findByIdAndUpdate(req.body.post_id,
  {
	  $push:{likes:req.user._id}
  },
  {
	  new:true
  }).exec((err,result)=>
  {
	  if(err) return res.status(202).json({error:error})
	  else return res.json(result)
  }
  )

})

router.put("/unlike",beforelog,(req,res)=>
{
	// console.log(req.body.post_id)
  Post.findByIdAndUpdate(req.body.post_id,
  {
	  $pull:{likes:req.user._id}
  },
  {
	  new:true
  }).exec((err,result)=>
  {
	  if(err) return res.status(202).json({error:error})
	  else return res.json(result)
  }
  )

})

router.put("/comment",beforelog,(req,res)=>
{
	const comment =
	{
		text:req.body.text,
		postedBy:req.user._id,
		// name:req.user.name
	}
	Post.findByIdAndUpdate(req.body.postId,
		{
			$push:{comments:comment}
		},
		{
			new:true
		})
		.populate("comments.postedBy","_id name")
		.populate("postedBy","_id name")
		.exec((err,result)=>
		{ 
			if(err) return res.status(202).json({error:error})
			else return res.json(result)
		}
		)
})

router.delete("/deletepost/:postId",beforelog,(req,res)=>
{
	Post.findOne({_id:req.params.postId})
	.populate("postedBy","_id name")
	.exec((err,post)=>
	{
		if(err || !post) 
		{

			return res.status(422).json({error:err})
		}
		if(post.postedBy._id.toString() === req.user._id.toString())
		{
			post.remove()
			.then(result=>
				{
					res.json(result)
				})
				.catch(err=>console.log(err))
		}
	})
})

module.exports=router;