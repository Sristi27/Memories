import React, { useState,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {Link, useHistory} from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {TextField } from '@material-ui/core';
import {UserContext} from '../../App'
import Alert from '@material-ui/lab/Alert';
 
const useStyles = makeStyles({
   root: {
       width:500,
       textAlign:"center",
       margin:'40px auto',
   },
   title: {
       fontSize: 14,
   },
   pos: {
       marginBottom: 12,
   },
  
});
 
export default function Login() {

   const classes = useStyles();

   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [err,setErr]=useState("false");
    const [emailErr,setemailErr]=useState("true");

   const history = useHistory();

   const {state,dispatch}=useContext(UserContext)

   const loginAcc = () =>
   {
       setErr("false");
       setemailErr("true");
    
    //    console.log(email,password)
    if(email==="" || password === "")
    setErr(!err)

    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        setemailErr(!emailErr)
    }

    else
    {
       fetch("/signin",
       {
           method:"post",
           headers: {
               "Content-Type":"application/json"
           },
           body: JSON.stringify(
           {
               email,password
           })
       })
       .then(res=>res.json())
       .then(
           data=>
           {
               if(!data.error)
               {
                   localStorage.setItem("jwt",data.token);
                   //data.user was an object
                   localStorage.setItem("user",JSON.stringify(data.user))
                   dispatch({type:"USER",payload:data.user})
                   console.log(data)
                   history.push("/")
               }
               else
               {
                    console.log(data.error)
               }
           }
           ).catch(err=>console.log(err))
       
   }
}


 
  
   return (
       <Card className={classes.root}>
           {(!err)?<Alert severity="error">Please fill all the fields!</Alert>:""}
           {(!emailErr)?<Alert severity="error">Invalid Email!</Alert>:""}
           <CardContent>
               <Typography variant="h5" style={{textTransform:"uppercase",margin:"20px auto",fontWeight:"bold"}}>Login</Typography>
               <form>
                   <TextField type="email" style={{width:"80%",margin:"10px auto",padding:"10px"}}
                   value={email}
                   onChange={(e)=>setEmail(e.target.value)}
                   placeholder="Enter your email"/>
                   <TextField type="password" style={{width:"80%",margin:"10px auto",padding:"10px"}}
                   value={password}
                   onChange={(e)=>setPassword(e.target.value)}
                   placeholder="Enter your password"/>
               </form>
           </CardContent>
           <CardActions>
               <Button
               style={{margin:"0 auto",textTransform:"capitalize",fontSize:"17px"}}
               variant="contained" color="primary" type="submit"
               onClick={()=>loginAcc()}
               >Login</Button>
           </CardActions>
           <p>
           <Typography style={{display:"inline"}}>
               New here?
           </Typography>
               <Link to="/signup"><Button style={{textTransform:"capitalize",marginLeft:"2px"}}
               color="primary">Signup</Button></Link>
           </p>
       </Card>
   );
}
 