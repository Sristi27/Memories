import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import profile from '../../images/profile.png';
import { Button, Input } from '@material-ui/core';
import Navbar from '../Navbar';



const useStyles = makeStyles((theme) => ({
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        marginTop: "80px"
    },
    gridList: {
        width: 800,
        height: 600,
    },
}));

function Profile() {

    const { state, dispatch } = useContext(UserContext);

    const [mypics, setmyPics] = useState([]);

    const [image, setImage] = useState("");
    const [nullposts,setPosts]=useState(true)
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        fetch("/mypost",
            {
                headers: {

                    "Authorization": "Bearer" + localStorage.getItem("jwt")
                },
                method: "get"
            }).then(res => res.json())
            .then(data => {setmyPics(data.post);setPosts(false)})

    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append('file', image);
            data.append("upload_preset", "insta - clone");
            data.append("cloud_name", "ducw5cejx");
            fetch("https://api.cloudinary.com/v1_1/ducw5cejx/image/upload",
                {
                    method: "post",
                    body: data
                })
                .then(res => res.json())
                .then(data => {
                    setUrl(data.url);
                    
                    fetch("/updatepic",
                    {
                        method:"put",
                        headers:
                        {
                            "Authorization":"Bearer"+localStorage.getItem("jwt"),
                            "Content-Type":"application/json"
                        },
                        body:JSON.stringify({url:data.url})
                    }).then(res=>res.json())
                    .then(result=>{
                        
                        console.log(result)
                        localStorage.setItem("user",JSON.stringify({...state,image:result.image}));
                        dispatch({type:"UPDATEPIC ",payload:result.image});
                        window.location.reload()
                    })
                    .catch(err=>console.log(err));
                })
                .catch(err => console.log(err))

        }

    }, [image]);

    const updatePic = (file) => {
        console.log("hello");
        setImage(file);
    }

    const classes = useStyles();


    return (
        <div><Navbar/>
        {!nullposts?<div
            style={{
                maxWidth: 800,
                fontWeight: "normal",
                margin: "10px auto"
            }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    margin: "20px 0",
                    borderBottom: "1px solid grey"

                }}>
                <div>
                    <img
                        style={{ height: "160px", width: "170px", borderRadius: "50%", margin: "20px 0" }}
                        // alt="woman"
                        src={state ? state.image : "loading"} />
                </div>
                <div>
                    <h1 style={{ marginTop: "35px", marginBottom: "0" }}>{state ? state.name : "loading "}</h1>
                    <div style={{ display: "flex" }}>
                        <h3 style={{ marginRight: "10px" }}
                        >{mypics.length} <span>{mypics.length > 1 ? " Posts" : " Post"}</span></h3>
                        <h3 style={{ marginRight: "10px" }}
                        >{state ? state.followers.length : "loading..."} <span>{state ? state.followers.length > 1 ? " Followers" : " Follower" : ""}</span></h3>
                        <h3 style={{ marginRight: "10px" }}
                        >{state ? state.following.length : "loading..."} Following</h3>
                    </div>
                    <Input
                        accept="image/*"
                        // style={{ display: "none" }}
                        id="contained-button-file"
                        multiple
                        onChange={(e) => {
                            updatePic(e.target.files[0]);
                            
                        }
                    }
                        type="file"
                    />
                    {/* <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" style={{ textTransform: "capitalize" }}
                        // onClick = {()=>console.log("Hello")}
                        >
                            Update Profile Pic</Button>
                    </label> */}

                </div>
            </div>


            <div className={classes.grid}>
                <GridList cellHeight={200} className={classes.gridList} cols={3} spacing={15}>
                    {mypics.map(item =>
                        (
                            <GridListTile>
                                <img key={item._id}
                                    src={item.image} alt={item.title} />
                            </GridListTile>
                        ))}
                </GridList>
            </div>

        </div>
        :<h3>Loading....</h3>}
    </div>
    )
}

export default Profile
