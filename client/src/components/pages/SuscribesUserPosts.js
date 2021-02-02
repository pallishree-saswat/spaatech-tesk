import React,{useContext, useEffect, useState} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const SuscribesUserPosts = () => {
    const [data,setData] = useState([])
    const {state, dispatch} =useContext(UserContext)

    useEffect(() => {

        fetch(`${process.env.REACT_APP_API}/post/getsubpost`, {
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setData(result.posts)
        })

    },[])

const likePost = (id) => {
    fetch(`${process.env.REACT_APP_API}/post/like`,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            postId : id
        })
    }).then(res=> res.json())
    .then(result => {
        //console.log(result)
       const newData = data.map(item => {
           if(item._id == result._id){
            return result
        }else{
            return item
        }
       })
       setData(newData)
    }).catch(err => {
        console.log(err)
    })
}

//unlike a post
const unlikePost = (id) => {
    fetch(`${process.env.REACT_APP_API}/post/unlike`,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            postId : id
        })
    }).then(res=> res.json())
    .then(result => {
        //console.log(result)
        const newData = data.map(item => {
            if(item._id == result._id){
             return result
         }else{
             return item
         }
        })
        setData(newData)
    }).catch(err => {
        console.log(err)
    })
}

//write a comment
const makeComment = (text,postId) => {
    fetch(`${process.env.REACT_APP_API}/post/comment`, {
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })

    }).then(res=>res.json())
    .then(result => {
        console.log(result)
        const newData = data.map(item => {
            if(item._id == result._id){
             return result
         }else{
             return item
         }
        })
        setData(newData)
    }).catch(err => {
        console.log(err)
    })
}

//delete post
const deletePost = (postId) => {
    fetch(`${process.env.REACT_APP_API}/post/deletepost/${postId}`, {
        method:"delete",
        headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
     }
    }).then(res => res.json())
    .then(result => {
        console.log(result)
        const newData = data.filter(item => {
            return item._id !== result._id
        })
        setData(newData)
    })
}

//delete comment

const deleteComment = (postId, commentId)=> {
    fetch(`${process.env.REACT_APP_API}/post/comments/${postId}/${commentId}`, {
        method:"delete",
        headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
     }
    }).then(res => res.json())
    .then(result => {
        console.log(result)
        const newData = data.filter(item => {
            return item._id !== result._id
        })
        setData(newData)
      
    })
}

    return (
        <div className="home">

         { data.map(item => {
             return (
                
                <div className="card home-card">
                      <h5 style={{padding:"5px"}}>
                      <Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> 
                       {item.postedBy._id == state._id
                            && <i className="material-icons" style={{
                                float:"right"
                            }} 
                            onClick={()=>deletePost(item._id)}
                            >delete</i>

                            }</h5>
                <div className="card-image">
                   <img src={item.photo} />      
                </div>
                <div className="card-content">
                    <i className="material-icons" style={{color:'red'}}>favorite</i>

                    { item.likes.includes(state._id)
                    ?
                    <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                    :
                    <i className="material-icons" onClick={()=>{likePost(item._id)}}>thumb_up</i>
                  }

                    
                  
                    <h6>{item.likes.length} likes</h6>
                    <h5>{item.title}</h5>
                    <p>{item.body}</p>
                     {
                         item.comments.map(record => {
                             return (
                                <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} 
                                {record.postedBy._id == state._id
                                 && <i className="material-icons" style={{
                                    float:"right"
                                }} 
                                onClick={()=>deleteComment(item._id,record._id)}
                                >delete</i>
                                
                                }
                                
                                
                                </h6>
                             )
                         })
                     }
                      

                    <form onSubmit={(e)=> {
                        e.preventDefault()
                        console.log(e.target[0].value)
                        makeComment(e.target[0].value, item._id)
                    }}>
                    <input type="text" placeholder="add a comment" />
                    </form>
                </div>
                </div>
             )
         })}

           

    

           
        </div>
    )
}

export default SuscribesUserPosts
