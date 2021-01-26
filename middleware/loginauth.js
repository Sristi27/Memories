const jwt = require('jsonwebtoken');
const { secret } = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model("User");

module.exports = (req, res, next) => {
	const { authorization } = req.headers
    // console.log(req.headers)
	if (!authorization) {
    	return res.status(404).json({ error: "You must be logged in!" })
	}
	const token = authorization.replace("Bearer","");
	jwt.verify(token, secret, (err, payload) => {

    	if(err)
    	{
        	return res.status(422).json({error:"You faced error!"})
    	}

    	const {_id}=payload;
    	// console.log(payload)
    	User.findById(_id).then(
        	userdata =>
        	{
				req.user=userdata;
				// console.log(req.user)
            	next();
        	}
    	)
	})
}