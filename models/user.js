const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema(
	{
		name:
		{
			type: String,
			required: true
		},
		email:
		{
			type: String,
			required: true
		},
		password:
		{
			type: String,
			required: true
		},
		image:
		{
			type: String,
			default:"https://res.cloudinary.com/ducw5cejx/image/upload/c_fit,h_83,r_18,w_80/a_0/v1603804438/download_gxqmvc.png",
			// required: true
		},
		followers:
			[{
				type: ObjectId,
				ref: "User"
			}],
		following:
			[{
				type: ObjectId,
				ref: "User"
			}]

	}
)

module.exports = mongoose.model("User", userSchema)