import React, { useContext, useEffect, useState } from 'react'
import { getLoginData } from '../utilities/getLoginData'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App';
import userAvatar from '../images/userAvatar.jpg'
import Loader from './Loader';
import { FaEdit, FaVolumeMute, FaVolumeUp, FaTrashAlt } from 'react-icons/fa';
import {  AiFillHeart, AiOutlineHeart, AiTwotoneDelete } from 'react-icons/ai';

const Profile = () => {
    const navigate = useNavigate();
    const {state,dispatch} = useContext(UserContext);
    const [isLoading,setIsLoading] = useState(true);
    const [orderHistory, setOrderHistory] = useState({})
    const [profileUpdate,setProfileUpdate] = useState(false)
    const [profilePic,setProfilePic] = useState(null)
    const [userUploads,setUserUploads] = useState({})
    const [listMode, setListMode] = useState(false)
    const [openModalState, setOpenModalState] = useState(false)
    const [postOpen, setPostOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [audioMute, setAudioMute] = useState(false)
    const [postLike, setPostLike] = useState(false)
    const [likeCounts, setLikeCounts] = useState(0)

    useEffect(()=>{
        const fetchData = async() =>{
            const userData = await getLoginData();

            if(userData){
                dispatch({type:"USER",payload:userData})
                setIsLoading(false)

                let res = await fetch('/api/profile/bookings/history',{
                  method:"GET",
                  headers:{
                    'x-auth-token':localStorage.getItem('token')
                  }
                })
                let data = await res.json();

                if(res.status===200 && data){
                  setOrderHistory(data);
                  console.log(data)
                }else{
                  setOrderHistory({message:data.error})
                }

                //For getting uploads
                res = await fetch('/api/profile/user/uploads',{
                  method:"GET",
                  headers:{
                    'x-auth-token':localStorage.getItem('token')
                  }
                })

                data = await res.json()

                if(res.status===201 && data){
                  setUserUploads(data.userContent)
                }
            }else{
                navigate('/login')
            }
        }
        fetchData();
    },[])

    const editBtnClick = () =>{
      setProfileUpdate(!profileUpdate)
    }
    const updateProfile = async(e) =>{
      e.preventDefault()
      const formData = new FormData()

      formData.append('profile',profilePic);

      const res = await fetch('/api/users/update/profile',{
        method:"POST",
        headers:{
          'x-auth-token':localStorage.getItem('token')
        },
        body:formData
      })

      const data = await res.json()

      if(data && res.status===200){
        alert('Profile Updated')
        setProfileUpdate(false)
      }
    }

    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      // Add leading zeros if necessary
      const formattedDay = String(day).padStart(2, '0');
      const formattedMonth = String(month).padStart(2, '0');

      return `${formattedDay}-${formattedMonth}-${year}`;
    };
    const openModal = () =>{
      setOpenModalState(true)
    }
    const closeModal = () =>{
        setOpenModalState(false)
        setAudioMute(false)
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
    const closePostOpen = () =>{
      setPostOpen(false)
      setSelectedPost(null)
      setAudioMute(false)
    }

    const handlePostDelete = async() =>{
      const shouldDelete = window.confirm("Are you sure to delete this post?");

      if(shouldDelete){
        const res = await fetch(`/api/profile/post/delete/${selectedPost._id}`,{
          method:"DELETE",
          headers:{
            'x-auth-token':localStorage.getItem('token')
          }
        })
        const data = await res.json();

        if(res.status===201 && data){
          window.location.reload()
        }else{
          alert("Unable to Delete Post")
        }
      }
    }
  return (
    <>
    {
        isLoading?
        <Loader/>
        :
        <>
        <div className='container-lg margin-top-content'>
          <div className='row p-2 mt-2 mb-2'>
             <div className='card box-shadow rounded-2 ps-4 p-2'>
                <nav aria-label="breadcrumb" className="">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">User Profile</li>
                  </ol>
                </nav>
             </div>
          </div>
          <div className='row justify-content-center profile-boxes'>
            <div className='col-12 col-md-4 p-2'>
              <div className='card box-shadow p-2 h-100'>
                <div className='text-center'>
                  <img src={state.avatar.includes('gravatar')?state.avatar: `http://localhost:5000/uploads/profileImages/${state.avatar}`}
                  alt="avatar"
                  className="rounded-circle img-fluid mb-3 mt-1 border"
                  style={{width: "150px",height:"150px"}}/>

                  <h5>{state.name}</h5>
                  <p className='text-muted'>{state.username}</p>
                  <div className='d-flex p-1 pb-2'>
                    <span className='w-100 text-center' onClick={()=>{
                      openModal();
                      setListMode(true)
                    }}>
                      <span className='text-muted'>Followers</span> {state.followers.length}
                    </span>
                    <span className='w-100 text-center' onClick={()=>{
                      openModal();
                      setListMode(false);
                    }}>
                      <span className='text-muted'>Following</span> {state.following.length}
                    </span>
                  </div>
                  <div className='d-flex'>
                    <button className='btn btn-outline-primary m-1 w-100' onClick={editBtnClick}><FaEdit/> Edit Profile</button>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-8 p-1 p-md-2'>
              <div className='card p-2 ps-3 pe-3 text-center'>
                <h5>Your Uploads</h5>
                
                    { userUploads.videos && userUploads.images?
                          <>
                          <div className="custom-grid-layout">
                          {userUploads.videos ? (
                            userUploads.videos.map((video,index) => (
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
                            
                          {userUploads.images ? (
                            userUploads.images.map((image,index) => (
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
          <div className='row justify-content-center profile-boxes'>
            <div className='col-12 col-lg-6 p-2'>
              <div className='box-shadow card p-2 text-center'>
                <h5>Hotel Bookings</h5>
              
               {
                orderHistory.hotelBookings?
                    orderHistory.hotelBookings.map((order)=>(
                      <div className='m-1 ps-2 pe-2 pt-1 pb-0 rounded-2 order-history'>
                        <div className='w-100'>
                          <p className='card-text'>Booked {order.roomQty} rooms at <b>{order.name}</b>, {order.place}</p>
                          <p className='text-muted'><b>From:</b> {formatDate(new Date(order.checkin))} 
                          &nbsp; <b>to:</b> {formatDate(new Date(order.checkout))}</p>
                        </div>
                        <div className='ps-3'>
                          <b>₹{order.amount}</b>
                        </div>
                      </div>
                    ))
                    :
                    <div className='text-muted d-flex justify-content-center align-items-center' style={{height:"300px"}}>No Hotel Booking History</div>
               }
               </div>
            </div>
            <div className='col-12 col-lg-6 p-2'>
              <div className='box-shadow card p-2 text-center'>
                <h5>Influencer Bookings</h5>

                {
                orderHistory.tripBookings?
                    orderHistory.tripBookings.map((order)=>(
                      <div className='m-1 ps-2 pe-2 pt-1 pb-0 rounded-2 order-history'>
                        <div className='w-100'>
                          <p className='card-text'>Booked {order.seats} seats of trip to {order.place} with <b>{order.name}</b></p>
                          <p className='text-muted d-block d-sm-flex'>
                            <p className='mb-0'><b>From:</b> {formatDate(new Date(order.startDate))}
                            &nbsp;<b>to:</b> {formatDate(new Date(order.endDate))}</p> 
                          </p>
                        </div>
                        <div className='ps-3'>
                          <b>₹{order.amount}</b>
                        </div>
                      </div>
                    ))
                    :
                    <div className='text-muted d-flex justify-content-center align-items-center' style={{height:"300px"}}>No Trip Booking History</div>
               }
              </div>
            </div>
          </div>
        </div>

        {
          profileUpdate?
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Profile</h5>
                <button type="button" className="btn-close" onClick={editBtnClick}></button>
              </div>

              <div className="modal-body container-fluid">
                  <div className='row p-2 justify-content-center'>
                    <div className='col-11'>
                      <div className='text-center'>
                        <img src={userAvatar} alt='general'
                         className='rounded-circle'
                         width="100px"
                         height="100px"
                         />
                      </div>
                    </div>
                    <form encType='multipart/form-data'>
                    <div className='col-11'>
                      <div className="form-group  mt-3 mb-2">
                        <input name="profile" type="file" className="form-control" onChange={(e)=>setProfilePic(e.target.files[0])}/>
                      </div>
                    </div>
                    </form>
                  </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={editBtnClick}>
                  Cancel
                </button>
                <button id='bookTripBtn' type="button" className="btn btn-primary" onClick={updateProfile}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        :
        null
        }
        {
          profileUpdate?
          <div className="modal-backdrop" style={{backgroundColor:"rgba(0,0,0,0.7)"}}></div>
          :
          null
        }
        {
          openModalState?
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-sm mt-1" role="document">
                <div className="modal-content  border-0">
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
                            state.followers.map((user)=>(
                                <div className="p-2 border-bottom">{user.username}</div>
                            ))
                            :
                            state.following.map((user)=>(
                                <div className="p-2 border-bottom">{user.username}</div>
                            ))
                    }
                  </div>
                  <div className='modal-footer p-1'>
                    <button className='btn btn-secondary' onClick={closeModal}>Close</button>
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
      }
  
      {
          postOpen?
          <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-sm mt-1" role="document">
                <div className="modal-content border border-2">
                  <div className="modal-header p-2 ps-3 pe-3">
                    <h5 className="modal-title">
                      <div className='d-flex align-items-center'>
                        <img src={state.avatar.includes('gravatar')?state.avatar:`http://localhost:5000/uploads/profileImages/${state.avatar}`}
                        className='rounded-circle'
                        width={40} height={40} alt='user'/>
                        <div className='p-2 lead'>
                          {state.username}
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
          
                  <div className="modal-footer justify-content-evenly p-0 bg-light">
                        <div className='d-flex justify-content-start w-100 '>
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
                        <div className='ms-auto rounded-circle post-delete' onClick={handlePostDelete}>
                          <FaTrashAlt size={20}/>
                        </div>
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

export default Profile
