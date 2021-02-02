import React,{useContext, useEffect, useState} from 'react'
import {UserContext} from '../../App'
import {Link,useParams} from 'react-router-dom'


const SinglePost = () => {
    const { id }= useParams()
    const [data,setData] = useState([])
    
    const {state, dispatch} =useContext(UserContext)

    useEffect(() => {

        fetch(`${process.env.REACT_APP_API}/post/allPost/${id}`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setData(result.post)
        })

    },[])




    return (
        <div className="home">
            
            <div className="card home-card" key={data._id}>  
    <h5 style={{padding:"5px"}}>{data.title}</h5> 
            <div className="card-image">
                   <img src={data.photo} />      
                </div>
            </div>                 
                                    
                                    
         </div>
    )
}

export default SinglePost
