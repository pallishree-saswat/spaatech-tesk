import React,{useContext,useRef,useEffect,useState} from 'react'
import {UserContext} from './../App'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()

useEffect(() => {
  M.Modal.init(searchModal.current)
},[])


 const renderList = () => {
   if(state){
     return [
      <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"rgb(198, 190, 231)"}}>search</i></li>,
 /*      <Link class="nav-link ml-auto"  to="/profile">profile</Link>, */
 /*      */
 /*      <Link class="nav-link" to="/myfollowingspost">following Posts</Link >,*/
    
      <li class="nav-item dropdown ml-auto">
      <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
        
{state ? state.name.toUpperCase() : "Profile"} </a>
      <div class="dropdown-menu">
      <Link class="nav-link ml-auto"  to="/profile">Profile</Link>
      <Link class="nav-link" to="/myfollowingspost">following Posts</Link>
      <a class="nav-link" href="#!" 
      onClick={() =>{
        localStorage.clear()
        dispatch({type: "CLEAR"})
        history.push('/signin')
      }}
      
      >Logout</a>
      </div>
    </li>,
      <Link class="nav-link" to="/createPost">UPLOAD</Link>

     
     ]
   }else {
     return [
      <Link class="nav-link ml-auto" to="/signup" >signup</Link>,
      <Link class="nav-link " to="/signin">signin</Link>
     ]
   }
 }

//fetch search users

const fetchUsers = (query)=>{
  setSearch(query)
  fetch(`${process.env.REACT_APP_API}/users/search-users`,{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      query
    })
  }).then(res=>res.json())
  .then(results=>{
    //console.log(results)
    setUserDetails(results.user)
  })
}





    return (
      <nav class="nav " style={{background:'black'}}>
      <Link class="nav-link active" to={ state ? "/" : "/signin"}><h2>SpaaTech</h2></Link>
      {renderList()}
      <div id="modal1" class="modal" ref={searchModal} style={{color:"black",width:"400px"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            autoFocus
            />
             <ul className="collection">
      
             {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
          </div>
          </div>





    </nav>
    )
}

export default Navbar
