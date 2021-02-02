import React,{useContext,useEffect,useState} from 'react'
import {UserContext} from '../../App'
import image1 from './default.png'

const Profile = () => {
    const {state,dispatch} = useContext(UserContext)
     const [mypics, setPics] = useState([])
     const [image,setImage] = useState("")
     const [url,setUrl] = useState("")

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/post/mypost`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            //console.log(result)
            setPics(result.mypost)
        })
    },[])

useEffect(() => {
    if(image){
        const data = new FormData();
        data.append('file',image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name","pallishree-saswat")
        fetch("	https://api.cloudinary.com/v1_1/pallishree-saswat/image/upload" ,{
            method:"post",
            body:data
        }).then(res => res.json())
        .then(data => {
            //console.log(data)
            

            fetch(`${process.env.REACT_APP_API}/users/uploadpic`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res => res.json())
            .then(result => {
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state, pic: result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
            window.location.reload()

            })
        }).catch(err => {
            console.log(err)
        })
    }
},[image])



//update photo
const updatePhoto = (file) => {
   setImage(file)
   
}




    return (
        <div style={{maxWidth:'550px',margin:'0px auto'}}>
               

            <div  style={{display:'flex', justifyContent:'space-around',margin:"18px 0px",borderBottom:'1px solid grey'}}>
                <div>
                    <img style={{width:"160px", height:"160px", borderRadius:"80px"}} 
                    src={state ? state.pic : image1} />
                   
                   <div className="file-field input-field">
               <div className="btn">
                   <spna>Upload pic</spna>
                   <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
               </div>
               <div className="file-path-wrapper" >
                   <input className="file-path validate" type="text" />
               </div>
           </div>


                </div>
                <div style={{marginRight:"10%"}}>
                    <h3>{state?state.name.toUpperCase() :"loading"}</h3>
                    <div style={{display:'flex', justifyContent:"space-between", width:'108%'}}>
                        <h6>{mypics.length} posts</h6>
                         <h6> { state? state.followers.length :"0"}followers</h6>
                        <h6> {state? state.following.length : "0"}followings</h6>
                    </div>
                </div>
            </div>
        <div className="gallery">
          
          {
              mypics.map(item => {
                  return(
                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                  )
              })
          }   
        </div>
        
        </div>
    )
}

export default Profile
