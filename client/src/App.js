import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import {BrowserRouter,Route,Switch,useHistory,useLocation} from 'react-router-dom';
import {initialState, reducer} from './reducers/userReducer';
import Navbar from './components/Navbar';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home';
import FollowingPosts from './components/screens/FollowingPosts';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import User from './components/screens/User';


export const UserContext=createContext();
 
const Routing = () =>
{
  const history=useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(() =>
  {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user)
  {
    dispatch({type:"USER",payload:user})
  }
  else{
    history.push('/signin')
  }
  },[])

  return (
    <Switch>
    <Route exact path="/">
      <Home/>
    </Route> 
    <Route path="/myfollowingpost">
      <FollowingPosts/>
    </Route>
    <Route path="/createpost">
      <CreatePost/>
    </Route>
    <Route exact path="/profile">
      <Profile/>
    </Route>
    <Route path="/profile/:id">
      <User/>
    </Route>
    <Route path="/signup"><Signup/></Route>
    <Route path="/signin"><Login/></Route>
    </Switch>
  )
}
function App() {

  const [state,dispatch] = useReducer(reducer,initialState)
  return (

	<div className="App">
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Routing/>
  </BrowserRouter>
  </UserContext.Provider>
  </div>
  );
}

export default App;

