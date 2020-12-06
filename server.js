const express=require('express');
var cors=require('cors');
const app=express();
const PORT = process.env.PORT||5000 ;

const mongoose=require('mongoose');

const {MONGOURL} = require("./config/keys");

mongoose.connect(MONGOURL,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    },err=>
    {
        if(!err) console.log("Database Connected");
        else console.log("err")
    })

require("./models/user");
require("./models/post");


app.use(cors());
app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/posts"));
app.use(require("./routes/users"));

if(process.env.NODE_ENV=="production")
{
    app.use(express.static('client/build'));
    const path=require('path') //path module
    app.get("*",(req,res)=>
    {
        res.sendFile(path.resolve(__dirname,'client/build/index.html')) //static file
        //if client will be making any req,then index.html will be sent for all cases.Index.html has all the react code
    })
}


app.listen(PORT,()=>console.log('server is running on port',PORT))