import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import bookingsImg from '../images/bookingsCover.jpg';
import influencerImg from '../images/bookingsCover/2.jpg';
import hotelBookingImg from '../images/bookingsCover/1.jpg'
import Footer from './Footer';

const Bookings = () => {
    const navigate=useNavigate()

  return (
    <>
    <div className='container margin-top-content'>
        <div className='row p-2 mt-2 mb-2'>
             <div className='card box-shadow rounded-2 ps-4 p-2 border'>
                <nav aria-label="breadcrumb" className="">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Bookings</li>
                  </ol>
                </nav>
            </div>
        </div>
        <div className='row justify-content-center p-2'>
            <div className='rounded-2 bg-light booking-img-cover'>
                <img src={bookingsImg} style={{objectFit:"cover"}} alt="bookings cover" className='rounded-3' width="100%" height="100%"/>
            </div>
        </div>
        
    </div>
    

    <div className='container-fluid half-color-background pt-1 pb-2'>
        <div style={{alignItems:"stretch"}} className='row justify-content-center mt-3'>
            <div className='card col-10 col-md-5 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-booking-image"
                 src={hotelBookingImg}
                 alt="Card cap" style={{backgroundColor:"#c67474"}}/>
                <div className="card-body rounded-2 text-center">
                  <h5 className=" card-title">Book Hotels</h5>
                  <p className='card-text'>Search for best hotels for desired place and book it.</p>
                
                   <button className='btn btn-primary w-100 rounded-5' onClick={()=>navigate('/bookings/hotels')}>Book Hotels</button>
                </div>
            </div>
            <div className='card col-10 col-md-5 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-booking-image"
                 src={influencerImg}
                 alt="Card cap" style={{backgroundColor:"#aa91af"}}/>
                <div className="card-body rounded-2 text-center">
                  <h5 className=" card-title">Travel with Influencer</h5>
                  <p className="card-text">Find out travel plans from the list and book a trip with travellers.</p>
                    
                   <button className='btn btn-primary w-100 rounded-5' onClick={()=>navigate('/bookings/influencer')}>Find Trips</button>
                </div>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default Bookings