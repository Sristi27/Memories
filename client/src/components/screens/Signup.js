import React, { useState,useEffect } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import { Link, useHistory } from 'react-router-dom';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TextField } from '@material-ui/core';
import profile from '../../images/profile.png'


const useStyles = makeStyles({
    root: {
        width: 500,
        textAlign: "center",
        margin: '40px auto',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    image:
    {
        height: 100,
        width: 100,
        borderRadius: "50%",
        cursor: "pointer"
    }

});

export default function Signup() {


    const history = useHistory();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("false");
    const [emailErr, setemailErr] = useState("true");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const [file, setFile] = useState(null);


    useEffect(() => {
        if(url)  
        {
            uploadFields();
        }
    }, [url])


    

    const uploadPic = () => {

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
                // console.log(data.url)
                setUrl(data.url);

            })
            .catch(err => console.log(err))


    }

    const uploadFields = () =>
    {
        if (email === "" || password === "")
                setErr(!err)

            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
                setemailErr(!emailErr)
            }
            else {
                fetch("/signup", {
                    headers:
                    {
                        "Content-Type": "application/json" 
                    },
                    method: "post",
                    body: JSON.stringify(
                        {
                            name,
                            email,
                            password,
                            url

                        })
                }).then(res => res.json())
                    .then(data => {
                        if (!data.error) {
                            console.log(data);
                            history.push('/signin');
                        }
                        else {
                            setErr(!err)
                        }
                    }
                    ).catch(err => console.log(err))

            }   
    }
    const postData = () => {

        if (image) {
            uploadPic();
        }
        else {
            uploadFields(); 
        }

    }


    const classes = useStyles();
    return (

        <Card className={classes.root}>
            {(!err) ? <Alert severity="error">Please fill all the fields!</Alert> : ""}
            {(!emailErr) ? <Alert severity="error">Invalid Email!</Alert> : ""}
            <CardContent>
                <Typography variant="h5"
                    style={{ textTransform: "uppercase", margin: "20px auto", fontWeight: "bold" }}>Signup</Typography>
                <form>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="contained-button-file"
                        multiple
                        onChange={(e) => {
                            setImage(e.target.files[0]);
                            setFile(URL.createObjectURL(e.target.files[0]))
                            console.log(URL.createObjectURL(e.target.files[0]))
                        }
                        }
                        type="file"
                    />
                    <label htmlFor="contained-button-file">
                        {!file ?
                            <img src={profile} className={classes.image} /> :
                            <img src={file} className={classes.image} />}
                    </label>


                    <TextField type="text" style={{ width: "80%", margin: "10px auto", padding: "10px" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name" />
                    <TextField type="email" style={{ width: "80%", margin: "10px auto", padding: "10px" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email" />
                    <TextField type="password" style={{ width: "80%", margin: "10px auto", padding: "10px" }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" />
                </form>
            </CardContent>
            <CardActions>
                <Button
                    style={{ margin: "0 auto", textTransform: "capitalize", fontSize: "17px" }}
                    variant="contained" color="primary"
                    type="submit"
                    onClick={() => postData()}>
                    Signup</Button>
            </CardActions>
            <p>
                <Typography style={{ display: "inline" }}>
                    Already have an account?
           </Typography>
                <Link to="/signin"><Button style={{ textTransform: "capitalize", marginLeft: "2px" }}
                    color="primary">Signin</Button></Link>
            </p>
        </Card>
    );
}


