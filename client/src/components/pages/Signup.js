import React, { useState, useEffect } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
   
    const history = useHistory('')
    const [name,setName] = useState("");
    const [password, setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

         useEffect(() => {
             if(url){
                 uploadFields()
             }
         },[url])


    //upload profile pic
    const uploadPic = () => {
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
            setUrl(data.url)
        }).catch(err => {
            console.log(err)
        })
    }
       

    //upload all fields
    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch(`${process.env.REACT_APP_API}/auth/signup`, {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }else{
                M.toast({html:data.message, classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err => {
            console.log(err)
        })

    }

       //post data to server
      const PostData = () => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
      }

    return (
        <div className="mycard">
        <div className="card auth-card" >
            <h2>Spaatech Solution</h2>
        <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}  />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="file-field input-field">
               <div className="btn">
                   <spna>Upload Image</spna>
                   <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
               </div>
               <div className="file-path-wrapper" >
                   <input className="file-path validate" type="text" />
               </div>
           </div>
        <button className=" btn waves-effect waves-light" onClick={(e)=> PostData()}>
            Sign Up
        </button>
        <h5>
               <Link to="/signin" >Dont have an account? sign in</Link>
           </h5>
    </div>
    </div>
    )
}

export default Signup
