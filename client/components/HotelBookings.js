import React, { useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { FaBan, FaCalendar, FaCheck} from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { UserContext } from '../App';
import { getLoginData } from '../utilities/getLoginData';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';

const override = {
    display: "block",
    margin: "0 auto",
    borderWidth:"5px"
};

const HotelBookings = () => {
  const {state, dispatch} = useContext(UserContext)

  const [isPageLoading,setPageLoading] = useState(true)
  const [searchInp,setSearchInp] = useState('');
  const [hotelsData,setHotelsData] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const [openModalState, setOpenModalState] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [rooms,setRooms] = useState(1)
  const [checkin, setCheckin] = useState(null)
  const [checkout, setCheckout] = useState(null)
  const [nights,setNights] = useState(1)
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchData = async() =>{
      const userData = await getLoginData();
      if(!userData){
        navigate('/')
      }else{
        dispatch({ type:"USER", payload:userData})
        setPageLoading(false)
      }
    }
    fetchData();
  },[])
  
  const handleSearchClick = async() => {
    setIsLoading(true)
    let container = document.getElementById('search-container')
    container.style.height = "150px"
    
    const res = await fetch(`/api/bookings/get/${searchInp}/hotels`,{
      method:"GET",
      headers:{
        "x-auth-token":localStorage.getItem('token')
      }
    })

    const data = await res.json()
    if(data && res.status===200){
      setHotelsData(data.hotels)
      setIsLoading(false)
    }else{
      alert("Currently no listed hotels for desired location")
    }
  }
  const openModal = () =>{
    setOpenModalState(true)
  }
  const closeModal = () =>{
    setOpenModalState(false)
    setCheckin(null)
    setCheckout(null)
    setNights(1)
    setRooms(1)
  }
  const findNights = (date) =>{
    setCheckout(date)
    const nights = new Date(date).getDate()- new Date(checkin).getDate()
    setNights(nights)
  }
  const handleHotelBooking = async(e) =>{
    e.preventDefault();

    if(checkin && checkout){
      let bookBtn = document.querySelector("#bookHotelBtn")
      bookBtn.disabled=true
      bookBtn.innerHTML="Booking...";

      const bookingDetails = {
        place:selectedHotel.place,
        hotelname:selectedHotel.name,
        hotel_id:selectedHotel._id,
        user_id:state._id,
        checkin:checkin.toISOString(),
        checkout:checkout.toISOString(),
        roomQty:rooms,
        nights,
        amount:selectedHotel.price*rooms*nights
      }
      const res = await fetch('/api/bookings/hotel',{
        method:'POST',
        headers:{
          'x-auth-token':localStorage.getItem('token'),
          'Content-type':'application/json'
        },
        body:JSON.stringify(bookingDetails)
      })

      const data = await res.json()

      if(res.status===201 && data){
        bookBtn.disabled=false
        bookBtn.classList.remove('btn-primary')
        bookBtn.classList.add('btn-success')
        bookBtn.innerHTML="Booked!";  
        setTimeout(()=>{
          setOpenModalState(false)
          closeModal();
        },3000)
      }else{
        alert("Not Booked")
      }
    }else{
      alert("All fields are required")
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
          <div className="row justify-content-center align-items-center" id='search-container'>
            <div className='col-10 col-md-9 p-3 rounded-3 text-center' id='search-field'>
              <h4 className='lead'>Book your hotels here!</h4>
              <div className="input-group mt-3 mb-3">
                <input
                  className='form-control'
                  placeholder='Search for places...'
                  type="text"
                  name="hotelplace"
                  value={searchInp}
                  onChange={(e)=>setSearchInp(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    style={{ borderRadius: "0 5px 5px 0" }}
                    className="btn btn-primary input-group-text"
                    onClick={handleSearchClick}
                    id='searchBtn'
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
          <div style={{display:isLoading?"block":"none"}} className='row justify-content-center p-5 align-items-center'>
            <ClipLoader
                  color='dodgerblue'
                  size={70}
                  loading={isLoading}
                  cssOverride={override}
            />
          </div>


            {
              hotelsData.map((hotel)=>(
                hotel.roomQty!==0?
                <>
                <div key={hotel._id} className='container-fluid'>
                  <div className='row justify-content-center align-items-center'>
                    <div className='col-11 col-sm-10 col-lg-9 card bg-light box-shadow border rounded-1 m-2 '>
                      <div className='row justify-content-center Bookings-card'>
                        <div className='col-12 col-md-4 p-3 Bookings-image'>
                          <img src={`http://localhost:5000/uploads/hotelImages/${hotel.image}`} className='rounded-1' alt='hotel'/>
                        </div>
                        <div className='col-12 col-md-5 ps-4 ps-md-0 ps-lg-5 col-lg-6 pt-1 pt-md-4 Bookings-descriptiom'>
                            <h3>{hotel.name}</h3>
                            <p className='text-muted'>{hotel.description}, {hotel.place}</p>
                            <div className='mt-2 mt-md-5 d-flex d-md-block'>
                              <p className='text-success w-100'><FaCheck/> TravelEXPO Verified</p>
                              <p className='w-100 text-muted ms-2 ms-md-0'><FaBan/> Non-Refundable</p>
                            </div>
                        </div>
                        <div className='col-12 col-md-3 col-lg-2 pt-1 pe-3 Bookings-price'>
                              <div className='d-flex d-md-block'>
                                <p className='w-100 text-start text-md-end'>
                                  <span className='lead'>Rs. {hotel.price}</span><br/>
                                  <span className='text-muted'>Per Night</span>
                                </p>
                                <div className='w-100 mt-3 mt-md-0'>
                                  <button className='btn btn-primary mb-3 text-end' onClick={()=>{
                                    setSelectedHotel(hotel);
                                    openModal();
                                  }}>Book Now</button>
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
            }

          
          {
          openModalState?
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Hotel Booking</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
          
                  <div className="modal-body container-fluid">
                      <div className='row p-2 justify-content-center'>
                        <div className='col-8 col-md-5 col-lg-6'>
                          <img className='rounded-1 box-shadow modal-image' src={`http://localhost:5000/uploads/hotelImages/${selectedHotel.image}`} alt={selectedHotel.name}
                           width="100%"/>
                        </div>
                        <div className='col-12 col-md-7 col-lg-6'>
                          <p className='lead text-center'><b>{selectedHotel.name}</b></p>
                          <p>Place : <span className='text-muted'>{selectedHotel.place}</span></p>
          

                          <div className="form-group d-flex mb-3 align-items-center">
                                <div className='p-2'>
                                    <FaCalendar size="18px"/>
                                </div>
                                <div className='pe-1 w-100'>
                                    <DatePicker
                                     placeholderText='Check-in date'
                                     className='form-control'
                                     selected={checkin}
                                     onChange={date=>setCheckin(date)}
                                     minDate={new Date()}
                                     dateFormat='dd/MM/yyyy'
                                     isClearable
                                     showYearDropdown
                                     scrollableYearDropdown
                                    />
                                </div>
                                <div className='ps-1 w-100'>
                                    <DatePicker
                                     placeholderText='Check-out date'
                                     className='form-control'
                                     selected={checkout}
                                     onChange={findNights}
                                     minDate={ checkin?checkin:new Date()}
                                     dateFormat='dd/MM/yyyy'
                                     isClearable
                                     showYearDropdown
                                     scrollableYearDropdown
                                    />
                              </div>
                          </div>
                          <div className='d-flex align-items-baseline'>
                            <p>No. of Rooms : &nbsp;</p>
                            <button className='btn btn-outline-primary btn-sm ps-2 pe-2 p-1' onClick={()=>setRooms(rooms>1?rooms-1:rooms)}> - </button>
                            <span>&nbsp; {rooms} &nbsp;</span>
                            <button className='btn btn-outline-primary btn-sm ps-2 pe-2 p-1' onClick={()=>setRooms(rooms<selectedHotel.roomQty && 5?rooms+1:rooms)}> + </button>
                          </div>
                          <div className='d-flex pt-2 pb-1 border-top text-center'>
                            <div className='w-100'>
                              <p className='text-muted'>Description</p>
                              <p className='text-start'>Hotel Booking at {selectedHotel.place}</p>
                            </div>
                            <div className='w-100'>
                              <p className='text-muted'>Rooms</p>
                              <p>{rooms}</p>
                            </div>
                            <div className='w-100'>
                              <p className='text-muted'>Price</p>
                              <p>{selectedHotel.price}</p>
                            </div>
                          </div>
                          <div className='border-top p-1 text-end'>
                                <span className='text-muted'> Total: </span>Rs.{selectedHotel.price*rooms*nights} <span className='text-muted'>({nights} nights)</span>
                          </div>
                        </div>
                      </div>
                  </div>
          
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button onClick={handleHotelBooking} type="button" id="bookHotelBtn" className="btn btn-primary">
                      Book Hotel
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
  );
};

export default HotelBookings;
