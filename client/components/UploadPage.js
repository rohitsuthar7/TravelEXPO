import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoginData } from '../utilities/getLoginData';
import Loader from './Loader';
import { FaUpload } from 'react-icons/fa';

const UploadPage = () => {
    const navigate = useNavigate();
    const formRef = useRef();

    const [uploads,setUploads] = useState({place:'',content:null})
    const [isPageLoading,setPageLoading] = useState(true)

    useEffect(()=>{
      const fetchData = async() =>{
        const userData = await getLoginData();

        setPageLoading(false)
        if(!userData){
          navigate('/login')
        }
      }
      fetchData();
    },[])

    const handleUpload = async(e) =>{
        e.preventDefault();

        let uploadBtn = document.querySelector('#uploadBtn')
        uploadBtn.disabled=true
        uploadBtn.innerHTML="Uploading..."

        const formData = new FormData()

        formData.append('place',uploads.place)
        formData.append('content',uploads.content)

        const res = await fetch('/api/social/upload/content',{
            method:"POST",
            headers:{
                'x-auth-token':localStorage.getItem('token'),
            },
            body:formData
        })

        const data = await res.json()

        if(res.status === 200 && data){
            uploadBtn.disabled=false
            uploadBtn.classList.remove('btn-primary')
            uploadBtn.classList.add('btn-success')
            uploadBtn.innerHTML="Uploaded!"
            setTimeout(()=>{
                formRef.current.reset()
                setUploads({...uploads,place:''})
                uploadBtn.classList.remove('btn-success')
                uploadBtn.classList.add('btn-primary')
                uploadBtn.innerHTML="Upload a Post"
            },3000)
        }else{
          alert("Unable to upload. Retry!")
          uploadBtn.classList.add('btn-primary')
          uploadBtn.innerHTML="Upload a Post"
        }
    }
  return (
    <>
      {
        isPageLoading?
        <Loader/>
        :
        <div className='container-fluid'>
            <div className='row justify-content-center align-items-center vh-100'>
                <div className='col-11 col-md-6 p-3 p-sm-5 text-center rounded-3' style={{border:"1px dashed grey",borderWidth:"2px"}}>
                    <h2 className='display-6 mt-3 mt-sm-none'><FaUpload/> Upload a Post</h2>
                      <form encType='multipart/form-data' ref={formRef}>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Place' name="place" 
                            value={uploads.place} onChange={(e)=>setUploads({...uploads,place:e.target.value})}/>
                        </div>

                        <div className="form-group mt-3 mb-2">
                          <input name="content" type="file" className="form-control w-100" onChange={(e)=>setUploads({...uploads,content:e.target.files[0]})}/>
                        </div>
                        <button className='btn btn-primary m-2' id="uploadBtn" onClick={handleUpload}>Upload Post</button>
                    </form>
                </div>
            </div>
        </div>
      }
    </>
  )
}

export default UploadPage