import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {useParams} from 'react-router-dom';
import { Button } from '@material-ui/core';
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
        width:800,
        height:600,
     },
}));

export default function User() {

    const {id} = useParams()
    console.log(id)
    const {state,dispatch} =useContext(UserContext);

    const [userProfile,setProfile] = useState(null)
    const [showFollow,setshowFollow]=useState(state?!state.following.includes(id):true);
    //if it includes current logged in user id

    useEffect(() => {
        fetch(`/user/${id}`,
            {
                headers: {

                    "Authorization": "Bearer" + localStorage.getItem("jwt")
                },
                method: "get"
            }).then(res => res.json())
            .then(data => 
                {
                    // console.log(data)
                    setProfile(data)
                })

    }, []);


    const follow = () =>
    {
        // console.log("followed") 
        fetch("/follow",
        {
            method:"put",
            headers:{
                "Authorization":"Bearer"+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                    followId:id
                }
            )
        }).then(res=>res.json())
        .then(result=>
            {
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result));
                setProfile(prevState=>
                    {
                        return {
                            ...prevState,
                            user:
                            {
                                ...prevState.user,
                                followers:[...prevState.user.followers,result._id]
                                //current logged in user is a follower of localstorage.getITem("user")
                                //hence we append the logged in user's id to the followers array
                            }
                        }
                    }) 
                setshowFollow(!showFollow);
                console.log(result)
            })
    }

    const unfollow = () =>
    {
        fetch("/unfollow",
        {
            method:"put",
            headers:{
                "Authorization":"Bearer"+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify(
                {
                    unfollowId: id
                }
            )
        }).then(res=>res.json())
        .then(result=>
            {
                dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
                localStorage.setItem("user",JSON.stringify(result));
                
                setProfile(prevState=>
                    {
                        const newFollower = prevState.user.followers.filter(item=> item!==result._id)
                        return {
                            ...prevState,
                            user:
                            {
                                ...prevState.user,
                                followers:newFollower
                                //removing that _id
                            }
                        }
                    })
                setshowFollow(!showFollow);
                console.log(result)
            })
    }

    const classes = useStyles();


    return (
        <> 
        <div>
        <Navbar/>
        {userProfile?
        <div
            style={{
                maxWidth: 900,
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
                    <img style={{ height: "180px", width: "170px", borderRadius: "50%", marginBottom: "20px" }} alt="profile-pic"
                        src={userProfile.user.image} />
                </div>
                <div>
                    <h1 style={{marginTop:"35px",marginBottom:"0"}}>{userProfile.user.name}</h1>
                    <div style={{ display: "flex" }}>
                        <h3 style={{ marginRight: "10px",fontWeight:"lighter" }}>{userProfile.posts.length} <span>{userProfile.posts.length>1?"Posts":"Post"}</span></h3>
                        <h3 style={{ marginRight: "10px",fontWeight:"lighter"  }}>{userProfile.user.followers.length} <span>{userProfile.user.followers.length>1?"Followers":"Follower"}</span></h3>
                        <h3 style={{ marginRight: "10px",fontWeight:"lighter"  }}>{userProfile.user.following.length} Following</h3>
                    </div>
                    {showFollow?
                    <Button variant="contained" color="primary" style={{marginRight:"15px"}}
                    onClick={()=>follow()}>Follow</Button>:
                    <Button variant="contained" color="primary"
                    onClick={()=>unfollow()}>Unfollow</Button>}
                </div>
            </div>


            <div className={classes.grid}>
                <GridList cellHeight={200} className={classes.gridList} cols={3} spacing={15}>
                    {
                    userProfile.posts.map(item=>
                    (  
                    <GridListTile>
                        <img key={item._id}
                        src={item.image} alt={item.title}/>
                    </GridListTile>
                    ))}
                </GridList>
            </div>

        </div>:
        <h2>Loading...</h2>}
        </div> 
        </>
    )
}