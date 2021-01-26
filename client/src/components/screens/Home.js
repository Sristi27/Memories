import React, { useState, useEffect,useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import {Link} from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import { Button, Input } from '@material-ui/core';
import {UserContext} from '../../App';
import Navbar from '../Navbar';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 750,
    margin: "20px auto",
  },
  icons:
  {
    display: 'block',
    width: "100%"
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  avatar: {
    backgroundColor: red[500],
  },
  col1:
  {
    color: 'red',
  },
  col2:
  {
    color: 'light-grey'
  },
  inp:
  {
    display: 'block',
    // width:750
  },
  show:
  {
    display: 'block'
  },
  hide:
  {
    display: 'none'
  },
  icon:
  {
    fontSize: "10px"
  }
}));

export default function Home() {
  const classes = useStyles();

  // const [change, setChange] = useState('true');
  const [text,setText]=useState("");

  const [data, setData] = useState([]);
  const {state,dispatch}=useContext(UserContext)
  const [nullposts,setPosts]=useState(true)

  useEffect(() => {
    fetch("/allposts",
      {
        headers:
        {
          "Authorization": "Bearer" + localStorage.getItem("jwt")
        },
        method: "get"
      }).then(res => res.json())
      .then(result => {
        console.log(result)
        setData(result.posts)
        setPosts(false)
      })
  }, [])


  const likePost = (id) =>
  {
    
     fetch("/like",
     {
       method:"put",
       headers: 
       {
         "Content-Type":"application/json",
         "Authorization":"Bearer"+localStorage.getItem("jwt")

       },
       body:JSON.stringify(
            {
                post_id:id
            }
          )
       
     }).then(res=>res.json())
     .then(result=>
      {
        console.log(result )
        const newData = data.map ( item => 
          {
            if(item._id == result._id)
            {
              return result
            }
            else
            {
              return item
            }
          })
  
          setData(newData);
      }).catch(err=>console.log(err))
  }

  const unlikePost = (id) =>
  {
     fetch("/unlike",
     {
       method:"put",
       headers: 
       {
         "Content-Type":"application/json",
         "Authorization":"Bearer"+localStorage.getItem("jwt")

       },
       body:JSON.stringify(
            {
                post_id:id
            }
          )
       
     }).then(res=>res.json())
     .then(result=>{
      console.log(result)
      let newData = data.map ( item => 
        {
          if(item._id == result._id)
          {
            return result
          }
          else
          {
            return item
          }
        })

        setData(newData);
    }).catch(err=>console.log(err))
  }

  //when component is mounted
  

  const makeComment = (text,postId) => 
  {
    fetch("/comment",
    {
      headers: 
      {
        "Content-Type":"application/json",
        "Authorization":"Bearer"+localStorage.getItem("jwt")
      },
      method:"put",
      body:JSON.stringify(
      {
        text,
        postId
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
      let newData = data.map ( item => 
        {
          if(item._id == result._id)
          {
            return result
          }
          else
          {
            return item
          }
        })

        setData(newData);
        setText("");
      })

  } 


  const deletePost = (postId) =>
  {
     fetch(`/deletepost/${postId}`,
     {
        headers:
        {
          "Authorization":"Bearer" + localStorage.getItem("jwt")
        }
        ,
        method:"delete"
     }).then(res=>res.json)
     .then(result=>
      {
        let newData = data.filter(item=>
          {
            return item._id!==result._id
          })

          setData(newData)
      })
     .catch(err=>console.log(err))
  }


  return (
    <div>
        <Navbar/>
      {
        (state&&!nullposts) ? 
        data.map((item) => {
          return (
            <Card className={classes.root} key={item._id}>
              <CardHeader
                avatar=
                  {<Link to={
                    item.postedBy._id !== state._id ?
                    "/profile/" + item.postedBy._id
                  :
                  "/profile"
                  }><Avatar aria-label="recipe" className={classes.avatar}
                  src={item.postedBy.image}/></Link>
                }
                  
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title=  
                {<Link to={
                  item.postedBy._id !== state._id ?
                  "/profile/" + item.postedBy._id
                :
                "/profile"
                }>{item.postedBy.name}</Link>
              }
                subheader={item.title}
              />
              <CardMedia
                className={classes.media}
                image={item.image}
                title="Paella dish"
              />

              <CardContent>
              <IconButton className={classes.col1}><FavoriteIcon/></IconButton>
                {item.likes.includes(state._id)?
                <IconButton aria-label="unlike"
                onClick={()=>unlikePost(item._id)}><ThumbDownIcon/></IconButton>:
                <IconButton aria-label="like"
                onClick={()=>likePost(item._id)}><ThumbUpIcon/></IconButton>
                }
                <IconButton aria-label="share">
                  <SendIcon />
                </IconButton>
                {item.postedBy._id===state._id?
                <IconButton aria-label="delete" 
                onClick={()=>deletePost(item._id)}>
                  <DeleteIcon />
                </IconButton>:""}
                <div style={{ marginLeft: "11px" }}>
                  <Typography style={{margin:"10px 0"}}>{item.likes.length} Likes</Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {item.body}
                  </Typography>
                  {
                    item.comments.map(record=>{
                      return(
                      <h4 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h4>
                      )
                  })
                }
                </div>


              </CardContent>
              <hr></hr>
              <CardActions disableSpacing style={{ marginLeft: "20px",bottom:"0" }}>
                <form style={{width:"100%"}} onSubmit = { (e)=>
                {
                      e.preventDefault();
                      if(e.target[0].value!=="")
                     { makeComment(e.target[0].value,item._id)}
                      // texts.push(text);
                      // // setText("");
                      // console.log(texts)
                }}>
                <Input style={{width:"90%"}} placeholder="Add a Comment" 
                value={text} onChange={(e)=>setText(e.target.value)}
                />
                <Button color="primary" type="submit"
                //  disabled={!text?true:false}
                 >Post</Button> 
                </form>
              </CardActions>

            </Card>
          )

        }): <h3>Loading...</h3>
      }</div>
  );
}