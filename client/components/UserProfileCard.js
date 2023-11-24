import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import { getLoginData } from "../utilities/getLoginData";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const UserProfileCard = () => {
    const { username } = useParams()
    const [isPageLoading,setPageLoading] = useState(true)
    const [userProfile, setUserProfile] = useState({})
    const [openModalState, setOpenModalState] = useState(false)
    const [listMode, setListMode] = useState(false)
    const [followBtnState, setFollowBtnState] = useState(true)
    const [followers, setFollowers] = useState(null)
    const [following, setFollowing] = useState(null)
    const [postOpen, setPostOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [audioMute, setAudioMute] = useState(false)
    const [postLike, setPostLike] = useState(false)
    const [likeCounts, setLikeCounts] = useState(0)
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async() =>{
          const userData = await getLoginData();
  
          if(!userData){
            navigate('/login')
          }

          const res = await fetch(`/api/users/find/${username}`,{
            method:"GET",
            headers:{
                'x-auth-token':localStorage.getItem('token')
            }
          })
          const data = await res.json();

          if(res.status===200 && data){
            setUserProfile(data.user)
            setFollowers(data.user.profile.followers.length)
            setFollowing(data.user.profile.following.length)
            console.log("USER FOLLOW :",userData.following.filter((follow)=>follow.username===data.user.username))
            if(userData.following.filter((follow)=>follow.username===username).length>0){
              setFollowBtnState(false)
            }
            setPageLoading(false)
          }else{
            setPageLoading(false)
            navigate('/');
            alert('No User found with this username')
          }
        }
        fetchData();     
    },[])

    const openModal = () =>{
        setOpenModalState(true)
    }
    const closeModal = () =>{
        setOpenModalState(false)
    }
    const closePostOpen = () =>{
      setPostOpen(false)
      setAudioMute(false)
      setSelectedPost(null)
    }
    const handleFollow = async() => {
        const res = await fetch('/api/users/add/follower',{
            method:'PUT',
            headers:{
                'Content-type':'application/json',
                'x-auth-token':localStorage.getItem('token')
            },
            body:JSON.stringify({username})
        })

        const data = await res.json();
        if(res.status===201 && data){
            setFollowBtnState(false)
            setFollowers(followers+1);
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
            <div className="margin-top-content">
                <div className="container-fluid h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                      <div className="col-12 col-md-8 p-1 p-md-2">
                        <div className="card">
                          <div className="container-fluid card-body p-3">
                            <div className="row text-black">
                              <div className="col-4 col-md-5 text-center">
                                <img src={userProfile.profile.avatar.includes('gravatar')?userProfile.profile.avatar:`http://localhost:5000/uploads/profileImages/${userProfile.profile.avatar}`}
                                  alt="Generic placeholder image" className="rounded-circle handle-width-user border"
                                  />
                              </div>
                              <div className="col-7 col-md-6">
                                <h5 className="mb-1">{userProfile.profile.name}</h5>
                                <p className="mb-2 pb-1" style={{color: "#2b2a2a"}}>{userProfile.profile.username}</p>
                                <div className="d-flex justify-content-start w-100 rounded-3 p-2 mb-2"
                                  style={{backgroundColor: "#efefef"}}>
                                  <div className="ps-2" onClick={()=>{
                                    setListMode(true);
                                    openModal()
                                  }}>
                                    <p className="small text-muted mb-1">Followers</p>
                                    <p className="mb-0">{followers}</p>
                                  </div>
                                  <div className="ps-3" onClick={()=>{
                                    setListMode(false);
                                    openModal();
                                  }}>
                                    <p className="small text-muted mb-1">Following</p>
                                    <p className="mb-0">{following}</p>
                                  </div>
                                </div>
                                <div className="d-flex pt-1">
                                  {
                                    followBtnState?
                                    <button type="button" className="btn btn-primary flex-grow-1" id="followBtn" onClick={handleFollow}>Follow</button>
                                    :
                                    <button type="button" className="btn btn-secondary flex-grow-1" disabled>Following</button>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
                      </div>
                    </div>
                </div>
            </div>
           <div className="container-fluid">
            <div className="row justify-content-center">
                <div className='col-12 col-md-8 p-1 p-md-2'>
                    <div className='card p-2 ps-3 pe-3 text-center'>
                        <h5>Uploads</h5>
                  
                      { userProfile.uploads.videos && userProfile.uploads.images?
                            <>
                            <div className="custom-grid-layout">
                            {userProfile.uploads.videos ? (
                              userProfile.uploads.videos.map((video,index) => (
                                <>
                                <div key={index} className="custom-grid-item grid-video-item" onClick={()=>{
                                  setSelectedPost(video)
                                  setPostOpen(true)
                                  fetchUserLikeStatus(video._id)
                                }}>
                                  <video preload="auto" className='w-100 h-100 rounded' style={{ objectFit: "cover" }} autoPlay loop muted>
                                    <source type="video/mp4" id="mp4" src={"http://localhost:5000/uploads/socialMedia/" + video.name} />
                                    Your browser does not support video playback.
                                  </video>
                                </div>
                                </>
                              ))
                            ) : null}
                              
                            {userProfile.uploads.images ? (
                              userProfile.uploads.images.map((image,index) => (
                                <div key={index} className="custom-grid-item" onClick={()=>{
                                  setSelectedPost(image)
                                  setPostOpen(true)
                                  fetchUserLikeStatus(image._id)
                                }}>
                                  <img src={`http://localhost:5000/uploads/socialMedia/`+image.name} className='rounded w-100 h-100'  alt={image.place} style={{ objectFit: "cover" }} />
                                </div>
                              ))
                            ) : null}
                             </div>
                            </>
                            :
                            <div className='text-muted d-flex justify-content-center align-items-center' style={{height:"300px"}}>No upload History</div>
                        }
                    </div>
                </div>
            </div>
           </div>
            </>
        }
        {
          openModalState?
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-sm mt-1" role="document">
                <div className="modal-content">
                  <div className="modal-header p-2 ps-3 pe-3">
                    <h5 className="modal-title">
                      {
                        listMode?
                        'Followers'
                        :
                        'Following'
                      }
                    </h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body container-fluid p-0 followList">
                    {
                        listMode?
                            userProfile.profile.followers.map((user)=>(
                                <div className="p-2 border-bottom">{user.username}</div>
                            ))
                            :
                            userProfile.profile.following.map((user)=>(
                                <div className="p-2 border-bottom">{user.username}</div>
                            ))
                    }
                  </div>
                  <div className="modal-body p-1">
                    <button className="btn btn-secondary" onClick={closeModal}>Close</button>
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
        {
          postOpen?
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-sm mt-1" role="document">
                <div className="modal-content border border-2">
                  <div className="modal-header p-2 ps-3 pe-3">
                    <h5 className="modal-title">
                      <div className='d-flex align-items-center'>
                        <img src={userProfile.profile.avatar.includes('gravatar')?userProfile.profile.avatar:`http://localhost:5000/uploads/profileImages/${userProfile.profile.avatar}`}
                        className='rounded-circle'
                        width={40} height={40} alt='user'/>
                        <div className='p-2 lead'>
                          {userProfile.profile.username}
                        </div>
                      </div>
                    </h5>
                    <button type="button" className="btn-close" onClick={closePostOpen}></button>
                  </div>
          
                  <div className="modal-body container-fluid p-0">
                    {
                      selectedPost.type==='video'?
                      <>
                      <div className='d-flex w-100'>
                          <video preload="auto" id="reelVideo" className='w-100' style={{ objectFit: "cover",height:"420px" }} autoPlay loop muted>
                            <source type="video/mp4" id="mp4" src={"http://localhost:5000/uploads/socialMedia/" + selectedPost.name} />
                            Your browser does not support video playback.
                          </video>
                      </div>
                      </>
                      :null
                    }
                    {
                      selectedPost.type==='image'?
                        <img src={`http://localhost:5000/uploads/socialMedia/`+selectedPost.name} className='rounded w-100 h-100'  alt={selectedPost.place} style={{ objectFit: "cover" }} />
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
            :null
        }
        {
          postOpen?
          <div className="modal-backdrop" style={{backgroundColor:"rgba(0,0,0,0.7)"}} onClick={closePostOpen}></div>
          :
          null
        }
        </>
    )
}

export default UserProfileCard;