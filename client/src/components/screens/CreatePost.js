import React, { useState ,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Navbar from '../Navbar';


const useStyles = makeStyles({
    root: {
        width:750,
        margin: '40px auto',
    },
    pos: {
        marginBottom: 12,
    },
    action:
    {
        width:109,
        margin:"10px auto"
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
      },

    inp:{ 
        width: "90%", 
        margin: "10px auto", 
        padding: "10px" 
    }

});


export default function CreatePost() {
    const classes = useStyles();

    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")

    const [file,setFile]=useState(null);

    const history = useHistory();

    // const [imgPresent,setImgPresent]=useState("")

    useEffect(() => {
         if(url)
         {
             console.log(url)
            fetch("/createpost",{
                headers:
                {
                    "Content-Type":"application/json",
                    "Authorization":"Bearer"+localStorage.getItem("jwt")
                },
                method:"post",
                body:JSON.stringify(
                {
                   title,
                   body,
                   url
                   
                })
            })
            .then(res=>res.json())
            .then(data=>{
                    if(!data.error)
                    {
                        console.log(data)
                        history.push('/')
                    }
                    else
                    {
                       console.log(data.error)
                    }
                })
                .catch(err=>console.log(err))
         }
    }, [url])


    const postDetails = () =>
    {
        //search fetch posts in web
       const data = new FormData();
       data.append('file',image);
       data.append("upload_preset","insta - clone");
       data.append("cloud_name","ducw5cejx");
       fetch("https://api.cloudinary.com/v1_1/ducw5cejx/image/upload",
       {
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>
        {
            // console.log(data.url)
            setUrl(data.url) 
        })
       .catch(err=>console.log(err))
           
}

    return (
        <div>
             <Navbar/>
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h5" 
                style={{ textTransform: "uppercase", textAlign:"center", fontWeight: "bold" }}>
                    New Post</Typography>
                <form>
                    <div style={{textAlign:"center"}}>
                    <TextField type="email" 
                        className={classes.inp}
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder="Add Title" />
                    <TextField multiline type="text" 
                        className={classes.inp}
                        value={body}
                        onChange={(e)=>setBody(e.target.value)}
                        placeholder="Add Body" />
                    </div>
                    <input
                        accept="image/*"
                        style={{display:"none"}}
                        id="contained-button-file"
                        multiple 
                        onChange={(e)=>
                            {
                                setImage(e.target.files[0]);
                                setFile(URL.createObjectURL(e.target.files[0]));
                            }
                            }
                        type="file"
                    /> 
                    <label htmlFor="contained-button-file">
                        {!file?
                        <Button variant="contained" color="primary" 
                        component="span" startIcon={<PhotoCamera />}
                        color="primary" style={{marginLeft:"40px"}}>
                            Upload
                        </Button>:
                        <Card style={{width:650,margin:"0 auto"}}>
                            <CardMedia
                            className={classes.media}
                            image={file}/>
                          </Card>}
                    </label>
                </form>
            </CardContent>
            <CardActions className={classes.action}>
                <Button
                    style={{ textTransform: "capitalize", fontSize: "17px"}}
                    variant="contained" color="primary" type="submit"
                    onClick={()=>postDetails()}>
                        Add Post</Button>
            </CardActions>
            
        </Card>
    
        </div>
       );
}






