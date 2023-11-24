import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAdminAuth } from '../../utilities/getAdminAccess';
import Loader from '../Loader';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {  FaCalendar, FaEdit } from 'react-icons/fa';

const UpdateTrip = () => {
    const navigate = useNavigate();
    const [isPageLoading, setPageLoading] = useState(true)
    const [searchInp, setSearchInp] = useState('');
    const [tripsData, setTripData] = useState([])
    const [selectedTrip, setSelectedTrip] = useState({})
    const [openModalState, setOpenModalState] = useState(false)
    const [influencerImg, setInfluencerImg] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const formRef = useRef()
    const formData = new FormData();

    useEffect(()=>{
      const fetchData = async() =>{
        const userData = await getAdminAuth();
        handleSearchClick();
        setPageLoading(false)
        if(!userData){
          navigate('/')
        }
      }
      fetchData();
    },[])

    const handleSearchInput = (e) =>{
        setSearchInp(e.target.value)
    }
    const handleSearchClick = async()=>{

        try{
            const res = await fetch(`/api/admin/trips?search=${searchInp}`,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('token')
                }
            })
            const data = await res.json();

            if(res.status===201 && data){
                setTripData(data.trips)
            }
        }catch(err){
            console.error(err.message)
        }
    }

    const openModal=()=>{
        setOpenModalState(true)
    }
    const closeModal=()=>{
        setOpenModalState(false)
        setSelectedTrip(null)
    }

    const handleFormChange = (e) =>{
        setSelectedTrip({...selectedTrip,[e.target.name]:e.target.value})
    }
    const prepareFormData = () =>{
        formData.append('name',selectedTrip.name)
        formData.append('username', selectedTrip.username)
        formData.append('price',selectedTrip.price)
        formData.append('seats',selectedTrip.seats)
        formData.append('place',selectedTrip.place)
        if(startDate && endDate){
          formData.append('startDate',startDate.toISOString())
          formData.append('endDate',endDate.toISOString())
        }else{
          formData.append('startDate',selectedTrip.startDate)
          formData.append('endDate',selectedTrip.endDate)
        }

        if(influencerImg){
            formData.append('influencerImg',influencerImg)
        }
    }
    const handleUpdate = async() =>{
        prepareFormData();
        let updateBtn = document.getElementById('updateButton')
        updateBtn.disabled=true
        updateBtn.innerHTML="Updating..."

        const res = await fetch(`/api/admin/update/trip/${selectedTrip._id}`,{
            method:"PUT",
            headers:{
                'x-auth-token':localStorage.getItem('token')
            },
            body:formData
        })
        const data = await res.json()
        if(res.status===201 && data){
            updateBtn.disabled=false
            updateBtn.classList.add('btn-success')
            updateBtn.innerHTML="Updated!"
            setTimeout(()=>{window.location.reload()},2000)
        }else{
            alert(data.error)
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
  return (
    <>
    {
      isPageLoading?
      <Loader/>
      :
      <>
      <div className='container-fluid margin-top-content'>
        <div className='row mt-2 mb-3 justify-content-center'>
             <div className='col-10 col-lg-9 bg-light box-shadow border rounded-2 ps-4 p-2'>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin">Admin</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Update trip</li>
                  </ol>
                </nav>
             </div>
        </div>
        <div className="row justify-content-center align-items-center">
            <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
              <h4 className='lead'>Find out Trips and Update...</h4>
              <div className="input-group mt-3 mb-3">
                <input
                  className='form-control'
                  placeholder='Search for Trips or Places...'
                  type="text"
                  name="hotelplace"
                  value={searchInp}
                  onChange={handleSearchInput}
                />
                <div className="input-group-append">
                  <button
                    style={{ borderRadius: "0 5px 5px 0" }}
                    className="btn btn-primary input-group-text"
                    id='searchBtn'
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
            tripsData.map((trip)=>(
                <div key={trip._id} className='container-fluid'>
                      <div className='row justify-content-center align-items-center'>
                        <div className='col-11 col-sm-10 col-lg-9 card bg-light box-shadow border-2 rounded-1 m-2 ' >
                          <div className='row justify-content-center Bookings-card'>
                            <div className='col-12 col-md-4 p-3 Bookings-image'>
                              <img src={`http://localhost:5000/uploads/influencerImages/${trip.image}`} className='rounded-1' alt='hotel'/>
                            </div>
                            <div className='col-12 col-md-5 col-lg-6 ps-4 ps-md-1 pt-1 p-md-3 Bookings-description'>
                                <h3>{trip.name}</h3>
                                <p className='text-muted'>A trip with @{trip.username} to {trip.place}</p>
                                <div className='sub-description p-2 w-100'>
                                  <div className='sub-description-child'>
                                    <div>
                                      <p> <b>From</b><br/> {formatDate(new Date(trip.tripDates.startDate))}</p>
                                    </div>
                                    <div>
                                      <p> <b>To</b><br/> {formatDate(new Date(trip.tripDates.endDate))}</p>
                                    </div>                                
                                  </div>
                                  <button className='btn btn-outline-primary btn-sm'
                                   onClick={()=>navigate(`/user-profile/${trip.username}`)}>See Profile</button>
                                </div>

                            </div>
                            <div className='col-12 col-md-3 col-lg-2 pt-1 pe-3 Bookings-price'>
                              <div className='d-flex d-md-block'>
                                <p className='w-100 text-start text-md-end'>
                                  <span className='lead'>Rs. {trip.price}</span><br/>
                                  <span className='text-muted'>Per Seat</span>
                                </p>
                                <div className='w-100 mt-3 mt-md-0'>
                                  <button type="button"
                                   onClick={()=>{
                                    setSelectedTrip(trip)
                                    openModal();
                                   }} 
                                   className="btn btn-success mb-3 text-end" id='updateBtn'><FaEdit/> Update</button>
                                </div>
                              </div>
                            </div> 
                          </div>
                      </div>
                    </div>
                  </div>
              ))
            }

      </>
    }
          
          {
          openModalState?
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Trip Booking</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
          
                  <div className="modal-body container-fluid">
                  <form encType='multipart/form-data' ref={formRef}>
                  <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Influencer Name' name="name"
                            value={selectedTrip.name}
                            onChange={handleFormChange}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Influencer Username' name="username"
                            value={selectedTrip.username}
                            onChange={handleFormChange}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Price' name="price"
                            value={selectedTrip.price}
                            onChange={handleFormChange}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Seats' name="seats"
                            value={selectedTrip.seats}
                            onChange={handleFormChange}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Travel Place' name="place"
                            value={selectedTrip.place}
                            onChange={handleFormChange}/>
                        </div>
                        <div className="form-group  mt-3 mb-2">
                          <input name="influencer" type="file" className="form-control" onChange={(e)=>setInfluencerImg(e.target.files[0])}/>
                        </div>
                        <div className="form-group d-flex mt-3 mb-2 align-items-center">
                            <div className='p-2'>
                                <FaCalendar size="18px"/>
                            </div>
                            <div className='pe-1 w-100'>
                                <DatePicker
                                 placeholderText='Start Date'
                                 className='form-control'
                                 selected={startDate}
                                 onChange={date=>setStartDate(date)}
                                 minDate={new Date()}
                                 dateFormat='dd/MM/yyyy'
                                 isClearable
                                 showYearDropdown
                                 scrollableYearDropdown
                                />
                            </div>
                            <div className='ps-1 w-100'>
                                <DatePicker
                                 placeholderText='End Date'
                                 className='form-control'
                                 selected={endDate}
                                 onChange={date=>setEndDate(date)}
                                 minDate={ startDate?startDate:new Date()}
                                 dateFormat='dd/MM/yyyy'
                                 isClearable
                                 showYearDropdown
                                 scrollableYearDropdown
                                />
                            </div>
                        </div>
                    </form>
                  </div>
          
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button className='btn btn-primary' id="updateButton" onClick={handleUpdate}>Update</button>
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

export default UpdateTrip