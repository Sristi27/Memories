import React, { useContext } from 'react';
import { UserContext } from '../App';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	nav:
	{
		color: "black",
		paddingTop: "10px",
		backgroundColor: "transparent"
	},
	button: {
		textTransform: "capitalize"
	}

}));

export default function Navbar() {
	const classes = useStyles();

	const { state, dispatch } = useContext(UserContext);

	const renderList = () => {
		//   if logged in
		if (state) {
			return [
				<Link to="/createpost"><Button color="inherit" className={classes.button}>Create Post</Button></Link>,
				<Link to="/myfollowingpost"><Button color="inherit" className={classes.button}> Following Posts</Button></Link>,
				<Link to="/profile"><Button color="inherit" className={classes.button}> Profile</Button></Link>,
				<Link to="/signin"><Button className={classes.button} variant="contained"
				color="secondary" style={{marginLeft:"10px"}}
				onClick={()=>{
					localStorage.clear()
					dispatch({type:"CLEAR"})
				}}>Logout</Button></Link>
				
			]
		}
		else {
			return [
				<Link to="/signin"><Button color="inherit" className={classes.button}>Login</Button></Link>,
				<Link to="/signup"><Button color="inherit" className={classes.button}>Signup</Button></Link>
			]
		}
	}
	return (
		<div className={classes.root}>
			<AppBar position="static" className={classes.nav}>
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						<Link to="/">Instagram </Link>
					</Typography>
						{renderList() }
				</Toolbar>
			</AppBar>
		</div>
	);
}

 
 
 

