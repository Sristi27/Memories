module.exports=
{
	secret:process.env.JWT_SEC || "eertyu",
	MONGOURL: process.env.MONGODB_URI  ||  "mongodb+srv://sristi:<password>@cluster0.9f1qo.mongodb.net/<dbname>?retryWrites=true&w=majority"
}
