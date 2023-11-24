import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import Loader from './Loader';
import { UserContext } from '../App';

const override = {
    display: "block",
    margin: "0 auto",
    borderWidth:"5px"
};
const InfluencerBookings = () => {
    const [searchInp, setSearchInp] = useState('');
    const [tripData,setTripData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [openModalState, setOpenModalState] = useState(false)
    const [seats,setSeats] = useState(1)
    const [isPageLoading, setPageLoading] = useState(true)
    const {state, dispatch} = useContext(UserContext)
    const navigate = useNavigate();

    const fetchData = async() =>{
      const res = await fetch('/api/bookings/get/influencers',{
          method:"GET",
          headers:{
              'x-auth-token':localStorage.getItem('token')
          }
      })

      const data = await res.json();

      if(res.status===200 && data){
        setIsLoading(false)
        setTripData(data.data);
        setPageLoading(false)
      }else{
        navigate('/')
      }
    }

    useEffect(()=>{
      fetchData();
    },[])

    const handleSearchClick = async(e) =>{
        e.preventDefault()
        setIsLoading(true)
        const res = await fetch(`/api/bookings/get/${searchInp}/influencers`,{
            method:"GET",
            headers:{
                'x-auth-token':localStorage.getItem('token')
            }
        })

        const data = await res.json();

        if(res.status===200 && data){
          setTripData(data.data);
          setIsLoading(false)
        }else{
          alert('No Listed Trip for this place!')
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
    const handleSearchInput = (e) =>{
      setSearchInp(e.target.value)
      if(e.target.value===''){
        fetchData();
      }
    }

    const openModal = () =>{
      setOpenModalState(true)
    }
    const closeModal = () =>{
      setOpenModalState(false)
      setSelectedTrip(null)
    }
    
    const handleBookTrip = async(e) =>{
      e.preventDefault();

      let bookBtn = document.querySelector('#bookTripBtn')
      bookBtn.disabled=true;
      bookBtn.innerHTML="Booking..."

      const bookingData = {
        influencer_id:selectedTrip._id,
        user_id:state._id,
        startDate:selectedTrip.tripDates.startDate,
        endDate:selectedTrip.tripDates.endDate,
        amount:selectedTrip.price*seats,
        place:selectedTrip.place,
        seats,
        influencer:selectedTrip.name
      }
      try{
        const res = await fetch('/api/bookings/influencer',{
          method:"POST",
          headers:{
            'x-auth-token':localStorage.getItem('token'),
            'Content-type':'application/json'

          },
          body:JSON.stringify(bookingData)
        })
        const data = await res.json();

        if(res.status===201 && data){
          bookBtn.disabled=false
          bookBtn.classList.remove('btn-primary')
          bookBtn.classList.add('btn-success')
          bookBtn.innerHTML="Booked!"; 
          setTimeout(()=>{
            setOpenModalState(false)
          },3000)
          closeModal();
        }else{
          alert("Not Booked")
        }
      }catch(err){
        console.log(err)
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
          <h4 className='lead'>Find out trips here for your place..</h4>
          <div className="input-group mt-3 mb-3">
            <input
              className='form-control'
              placeholder='Search for places...'
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

    <div className='container-fluid'>
      <div style={{display:isLoading?"block":"none"}} className='row justify-content-center p-5 align-items-center'>
          <ClipLoader
                color='dodgerblue'
                size={70}
                loading={isLoading}
                cssOverride={override}
          />
      </div>
    </div>
    <div className='container-fluid'>
        <div className='row justify-content-center align-items-center'>
            {
                tripData?
                tripData.map((trip)=>(
                  trip.seats!==0?
                  <>
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
                                     setSelectedTrip(trip);
                                     openModal();
                                    }} 
                                   className="btn btn-primary mb-3 text-end">Book Now</button>
                                </div>
                              </div>
                            </div> 
                          </div>
                      </div>
                    </div>
                  </div>
                  </>
                  :null
                ))
                :
                null
            }
        </div>
    </div>

    {
      openModalState?
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Trip with {selectedTrip.name}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body container-fluid">
                  <div className='row p-2 justify-content-center'>
                    <div className='col-8 col-md-5 col-lg-6'>
                      <img className='rounded-1 box-shadow modal-image' src={`http://localhost:5000/uploads/influencerImages/${selectedTrip.image}`} alt={selectedTrip.name}
                       width="100%"/>
                    </div>
                    <div className='col-12 col-md-7 col-lg-6'>
                      <p className='lead text-center'>A Trip with <b>{selectedTrip.name}</b></p>
                      <p>Place : <span className='text-muted'>{selectedTrip.place}</span></p>
                      <div className='d-flex'>
                        <p>From : <span className='text-muted'>{formatDate(new Date(selectedTrip.tripDates.startDate))}</span></p>
                        <p className='ms-3'>To : <span className='text-muted'>{formatDate(new Date(selectedTrip.tripDates.endDate))}</span></p>
                      </div>

                      <div className='d-flex align-items-baseline'>
                        <p>Seats : &nbsp;</p>
                        <button className='btn btn-outline-primary btn-sm ps-2 pe-2 p-1' onClick={()=>setSeats(seats>1?seats-1:seats)}> - </button>
                        <span>&nbsp; {seats} &nbsp;</span>
                        <button className='btn btn-outline-primary btn-sm ps-2 pe-2 p-1' onClick={()=>setSeats(seats<selectedTrip.seats && 5?seats+1:seats)}> + </button>
                      </div>
                      <div className='d-flex pt-2 pb-1 border-top text-center'>
                        <div className='w-100'>
                          <p className='text-muted'>Description</p>
                          <p>Trip to {selectedTrip.place}</p>
                        </div>
                        <div className='w-100'>
                          <p className='text-muted'>Seats</p>
                          <p>{seats}</p>
                        </div>
                        <div className='w-100'>
                          <p className='text-muted'>Price</p>
                          <p>{selectedTrip.price}</p>
                        </div>
                      </div>
                      <div className='border-top p-1 text-end'>
                            <span className='text-muted'> Total: </span>Rs.{selectedTrip.price*seats}
                      </div>
                    </div>
                  </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button id='bookTripBtn' onClick={handleBookTrip} type="button" className="btn btn-primary">
                  Book Trip
                </button>
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
    </>
  )
}

export default InfluencerBookings