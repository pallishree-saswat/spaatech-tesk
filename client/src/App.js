import React,{useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import UserProfile from './components/pages/UserProfile';
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import CreatePost from './components/pages/CreatePost';
import { initialState, reducer } from './reducers/userReducer'
import SuscribesUserPosts from './components/pages/SuscribesUserPosts';
import SinglePost from './components/pages/SignlePost';


 export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
     
    }else {
      history.push('/signin')
    }
  },[])
  return (
         <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/profile/:userid" component={UserProfile} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path ="/signin" component={Login} />
        <Route exact path ="/createPost" component={CreatePost} />
        <Route exact path ="/myfollowingspost" component={SuscribesUserPosts} />
        <Route exact path ="/singlePost/:id" component={SinglePost} />
      </Switch>
  )
}



function App() {

const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{state, dispatch}}>
    <Router>
    <div className="App">
      <Navbar/>
      <Routing />
    </div>
    </Router>
    </UserContext.Provider>
  );
}

export default App;
