import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import { useNavigate } from 'react-router-dom'
import { getLoginData } from '../utilities/getLoginData';
import { FaSearch, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: "block",
  margin: "0 auto",
  borderWidth:"5px"
};

const Social = () => {
    const navigate = useNavigate();
    const [isPageLoading,setPageLoading] = useState(true)
    const [searchInp, setSearchInp] = useState('')
    const [imageContent,setImageContent] = useState([])
    const [videoContent,setVideoContent] = useState([])
    const [users,setUsers] = useState([])
    const [openModalState,setOpenModalState] = useState(false)
    const [selectedPost, setSelectedPost] = useState({});

    const modeOptions = ['place','username']
    const [searchMode, setSearchMode] = useState(modeOptions[0])
    const [postAuthor, setPostAuthor] = useState()
    const [audioMute, setAudioMute] = useState(false)
    const [postLike, setPostLike] = useState(null)
    const [likeCounts, setLikeCounts] = useState(0);
    const [isContentLoading, setContentLoading] = useState(true)
    
    const fetchData = async() =>{
      const userData = await getLoginData();

      setPageLoading(false)
      if(!userData){
        navigate('/login')
      }

      const res = await fetch('/api/social/content',{
          method:"GET",
          headers:{
              'x-auth-token':localStorage.getItem('token')
          }
      })

      const data = await res.json();

      if(res.status===200 && data){
        setImageContent(data.images)
        setVideoContent(data.videos)
        setContentLoading(false)
      }
    }

    useEffect(()=>{
      fetchData();
    },[])
    useEffect(()=>{
      if(searchInp===''){
        fetchData();
      }
    },[searchInp])

    const openModal = () =>{
      setOpenModalState(true)
    }

    const closeModal = () =>{
      setOpenModalState(false)
      setAudioMute(false)
      setPostLike(false)
      setLikeCounts(0)
    }

    const handleSearchClick = async(e) =>{
      e.preventDefault();

      setContentLoading(true)
      switch (searchMode) {
        case modeOptions[0]:
          const res0 = await fetch(`api/social/get/content?search=${searchInp}`, {
            method: "GET",
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
          const data0 = await res0.json();
      
          setContentLoading(false)
          if (res0.status === 201 && data0) {
            setVideoContent(data0.videos);
            setImageContent(data0.images);
          }
          break;
        case modeOptions[1]:
          const res1 = await fetch(`api/social/get/users?search=${searchInp}`, {
            method: "GET",
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
          const data1 = await res1.json();
          
          setContentLoading(false)
          if(res1.status===201 && data1){
            setUsers(data1.users)
          }
          break;
      }
    }

    const fetchUsername = async(user_id) =>{
      const res = await fetch(`/api/social/get/author/${user_id}`,{
        method:"GET"
      })

      const data = await res.json()

      if(res.status===201 && data){
        setPostAuthor(data.user)
      }
    }

    const fetchUserLikeStatus = async(id) =>{
      const res = await fetch(`/api/social/post/status`,{
        method:'PUT',
        headers:{
          'Content-type':'application/json',
          'x-auth-token':localStorage.getItem('token')
        },
        body:JSON.stringify({post_id:id})
      })

      const data = await res.json();

      if(res.status===201 && data){
        setPostLike(true)
      }else{
        setPostLike(false)
        setLikeCounts(data.likes.length)
      }
      setLikeCounts(data.likes.length)
    }

    const handleAudioMute = () =>{
      setAudioMute(!audioMute)

      let video = document.querySelector("#reelVideo")
      if(audioMute){
        video.muted=true
      }else{
        video.muted=false
      }
    }

    const handlePostLike = async() => {
      if(!postLike){
        const res = await fetch('/api/social/post/like',{
          method:'PUT',
          headers:{
            'Content-type':'application/json',
            'x-auth-token':localStorage.getItem('token')
          },
          body:JSON.stringify({postId:selectedPost._id})
        })

        const data = await res.json();

        if(res.status===201 && data){
          setPostLike(true)
          setLikeCounts(likeCounts+1)
        }
      }
      else{
        const res = await fetch('/api/social/post/unlike',{
          method:'PUT',
          headers:{
            'Content-type':'application/json',
            'x-auth-token':localStorage.getItem('token')
          },
          body:JSON.stringify({postId:selectedPost._id})
        })

        const data = await res.json();

        if(res.status===201 && data){
          setPostLike(false)
          setLikeCounts(likeCounts-1)
        }
      }
    }

    return (
        <>
        {
            isPageLoading?
            <Loader/>
            :
            <>
            <div className='container-fluid margin-top-content'>
              <div className="row justify-content-center align-items-center">
                <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
                  <h4 className='lead'>{searchMode===modeOptions[0]?"Search for your place...":"Search for Users..."}</h4>
                   
                  <div className="input-group mt-3 mb-3">
                    <input
                      className='form-control border'
                      placeholder={searchMode===modeOptions[0]?'Search for places...':'Search for username...'}
                      type="text"
                      name="hotelplace"
                      value={searchInp}
                      onChange={(e)=>setSearchInp(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span
                      style={{backgroundColor:"#EEE"}}
                      className="btn rounded-0 dropdown-toggle border"
                      type="button" data-bs-toggle="dropdown" aria-expanded="false">{searchMode===modeOptions[0]?'Place':'User'}</span>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" onClick={()=>{
                          setSearchMode(modeOptions[0])
                          setUsers([])
                          setSearchInp('')
                        }}>By Places</a></li>
                        <li><a className="dropdown-item" onClick={()=>{
                          setSearchMode(modeOptions[1])
                          setSearchInp('')
                        }}>By Username</a></li>
                      </ul>
                    </div>

                    <div className="input-group-append">
                      <button
                        style={{ borderRadius: "0 5px 5px 0" }}
                        className="btn btn-primary input-group-text"
                        id='searchBtn'
                        onClick={handleSearchClick}
                      >
                        <FaSearch/>
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          <div className='container-fluid'>
            <div style={{display:isContentLoading?"block":"none"}} className='row justify-content-center p-5 align-items-center'>
                <ClipLoader
                      color='dodgerblue'
                      size={70}
                      loading={isContentLoading}
                      cssOverride={override}
                />
            </div>
          </div>
                    
          { searchMode===modeOptions[0]?
            <>
            <div className='mt-2 container-fluid'>
              <div className="row justify-content-center align-items-center">
                <div className="col-11 col-lg-9 p-2 rounded-3">
                        { videoContent.length>0 || imageContent.length>0?
                          <>
                          <div className="custom-grid-layout">
                          {videoContent ? (
                            videoContent.map((video,index) => (
                              <div key={index} className="custom-grid-item grid-video-item" onClick={()=>{
                                  openModal()
                                  setSelectedPost(video)
                                  fetchUsername(video.user);
                                  fetchUserLikeStatus(video._id)
                                }}>
                                <video preload="auto" className='w-100 h-100 rounded' style={{ objectFit: "cover" }} autoPlay loop muted>
                                  <source type="video/mp4" id="mp4" src={"http://localhost:5000/uploads/socialMedia/" + video.name} />
                                  Your browser does not support video playback.
                                </video>
                              </div>
                            ))
                          ) : null}
                            
                          {imageContent ? (
                            imageContent.map((image,index) => (
                              <div key={index} className="custom-grid-item" onClick={()=>{
                                openModal();
                                setSelectedPost(image);
                                fetchUsername(image.user);
                                fetchUserLikeStatus(image._id)
                                }}>
                                <img src={`http://localhost:5000/uploads/socialMedia/`+image.name} className='rounded w-100 h-100' alt={image.place}
                                 style={{ objectFit: "cover"}} />
                              </div>
                            ))
                          ) : null}
                           </div>
                          </>
                          :
                          isContentLoading?
                          <></>
                          :
                          <div className='text-muted d-flex justify-content-center align-items-center'
                           style={{height:"300px",fontSize:"20px"}}>No upload History for the place.</div>
                      } 
                  </div>
                </div>             
            </div>
            </>
            :
            users.length>0 && searchMode===modeOptions[1]?
            <>
            <div className='container-fluid mt-2 margin-top-content'>
              <div className='row justify-content-center'>
                <div className='col-10 col-lg-9 bg-light rounded border'>
                {
                  users.map((user)=>(
                    <div key={user.username} className='p-3 border-bottom d-flex align-items-center username-card' onClick={()=>navigate(`/user-profile/${user.username}`)}>
                      <img src={user.avatar.includes('gravatar')?user.avatar:`http://localhost:5000/uploads/profileImages/${user.avatar}`}
                       className='rounded-circle border'
                       width={50} height={50} alt='user'/>
                      <p className='ps-3 p-2'>{user.username}</p>
                    </div>
                  ))
                }
                </div>
              </div>
            </div>
            </>
            :
            <div className='text-muted d-flex justify-content-center align-items-center'
            style={{height:"300px",fontSize:"20px"}}>No Users found.</div>
          }
        </>
      }

        {
          openModalState?
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-sm mt-2 ms-4 me-4 me-sm-auto ms-sm-auto" role="document">
                <div className="modal-content border border-2">
                  <div className="modal-header p-2 ps-3 pe-3">
                    <h5 className="modal-title">
                    {
                      postAuthor?
                      <div className='d-flex align-items-center username-card' onClick={()=>navigate(`/user-profile/${postAuthor.username}`)}>
                        <img src={postAuthor.avatar.includes('gravatar')?postAuthor.avatar:`http://localhost:5000/uploads/profileImages/${postAuthor.avatar}`}
                        className='rounded-circle border'
                        width={40} height={40} alt='user'/>
                        <div className='p-2 lead'>
                          {postAuthor.username}
                        </div>
                      </div>
                      :
                      null
                    }
                    </h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
          
                  <div className="modal-body container-fluid p-0">
                    {
                      selectedPost.type==='video'?
                      <>
                      <div className='d-flex w-100'>
                          <video preload="auto" id="reelVideo" className='content-card' autoPlay loop muted>
                            <source type="video/mp4" id="mp4" src={"http://localhost:5000/uploads/socialMedia/" + selectedPost.name} />
                            Your browser does not support video playback.
                          </video>
                      </div>
                      </>
                      :null
                    }
                    {
                      selectedPost.type==='image'?
                        <img src={`http://localhost:5000/uploads/socialMedia/`+selectedPost.name} 
                        className='rounded content-card'  alt={selectedPost.place} style={{ objectFit:"contain"}} />
                      :
                      null
                    }
                  </div>
          
                  <div className="modal-footer justify-content-start p-0 bg-light">
                    <div className='p-1 d-flex '>
                          <div className='p-2'>
                          {
                            postLike?
                            <>
                            <AiFillHeart color='red' size={30} onClick={handlePostLike}/><span className='ps-1'>{likeCounts}</span>
                            </>
                            :
                            <>
                            <AiOutlineHeart color='red' size={30} onClick={handlePostLike}/><span className='ps-1'>{likeCounts}</span>
                            </>
                          }
                           </div>
                          {
                            selectedPost.type==='video'?
                            <div className='p-2 ps-3'>
                            {
                              audioMute?
                              <FaVolumeUp color='black' size={30} onClick={handleAudioMute}/>
                              :
                              <FaVolumeMute color='grey' size={30} onClick={handleAudioMute}/>
                            }
                            </div>
                          :null
                          }
                      </div>
                  </div>
                </div>
              </div>
            </div>
          :
          null
        }
        {
          openModalState?
          <div className="modal-backdrop" style={{backgroundColor:"rgba(0,0,0,0.7)"}} onClick={closeModal}></div>
          :
          null
        }
      </>
    )
}

export default Social