const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model("User");

const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");

const beforelog = require('../middleware/loginauth')

const {secret} = require("../config/keys");

 router.get("/protected",beforelog, (req, res) => {
   	res.send("Hello")
 })


router.post("/signin",(req,res)=>
{
	const {email,password}=req.body;
	if(!email || !password)
	{
    	return res.status(422).json({error:"Please fill all the details"})
	}
	User.findOne({email:email})
	.then(savedUser=>
    	{
        	if(!savedUser)
        	{
            	return res.status(404).json({error:"User not found"})
        	}
        	bcrypt.compare(password,savedUser.password)
        	.then(match =>
            	{
                	if(match){
                    	const token=jwt.sign(
                       	{ _id:savedUser._id},
                       	secret
						)
					const {_id,name,email,followers,following,image}=savedUser;
                    return	res.json({token:token,message:"Signed in successfully",user:savedUser})

                    	// res.json({})
                	}
                	else{
                    	return res.status(404).json({error:"Authentication Failed"})
                	}
            	}
            	)
            	.catch(err=>
                	{
                    	return res.status(404).json({error:err})
                	})
    	})
    	.catch(err=>
        	{
				return res.status(404).json({error:err})
        	})
})



router.post("/signup", (req, res) => {
	const { name, email, password , url } = req.body;
	if (!email || !password || !name) {
   	return res.status(422).json(
        	{ error: "Please fill all the fields" })
	}
	// res.json({message:"Successfully saved!"})
	User.findOne({ email: email })
    	.then((savedUser) => {
        	if (savedUser) {
            	return res.status(404).json({ error: "User already exists!" });

        	}
        	bcrypt.hash(password, 12)
            	.then(
                	hashedpassword => {
                    	const user = new User(
                        	{
                            	email, name, password:hashedpassword , image:url 
                        	}
                    	)
                    	user.save()
                        	.then(user => {
                            	return res.json({ message: "Saved Successfully",data:user })
                        	})
                        	.catch(err => {
                            	console.log(err);
                        	})

                	}
            	)

            	.catch(err => {
                	console.log(err);
            	})


    	})
})

module.exports = router;