import React from 'react'
import Carousel from './Carousel'
import bookingsImg from '../images/bookings1.jpg'
import bloggingImg from '../images/blogging1.jpg'
import exploreImg from '../images/explore1.jpg'
import Footer from './Footer'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
  return (
    <>
    <Carousel/>

    <div id="about-us-test" className='container-fluid'>
    </div>
    <div id="custom-text-container"className='container-fluid text-set'>
      <div className='row justify-content-center'>
            <div className='col-sm-10 bg-light box-shadow p-4 border rounded-1'>
                <h2 className='text-shadow text-center'>Why Us?</h2>
                <p className='card-text'>TravelEXPO has positioned itself as one-stop solution for all travel queries which includes connecting with 
                other travellers, know about the unexplored places and see the visuals which you really want. We will be providing you the most 
                affordable commuting options for your selected destinations. Apart from it, you can also search for the off-beat places and rural areas where you can know about rich culture and traditional values.</p>
            </div>
      </div>
    </div>

    <div className='container-fluid half-color-background-test pt-1 pb-2'>
        <div style={{alignItems:"stretch"}} className='row justify-content-center mt-3'>
            <div className='card col-10 col-md-3 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-card-image"
                 src={exploreImg}
                 alt="Card cap"/>
                <div className="card-body">
                  <h5 className="text-center card-title">Explore</h5>
                  <p className='card-text'>You are tired, I understand that finding the best visuals of a place can be time-consuming. So, here is traveller's Social Media.</p>
                </div>
            </div>
            <div className='card col-10 col-md-3 m-3 p-0 box-shadow border' onClick={()=>navigate('/bookings')}>
                <img className="card-img-top custom-card-image"
                 src={bookingsImg}
                 alt="Card cap"/>
                <div className="card-body">
                  <h5 className="text-center card-title">Bookings</h5>
                  <p className="card-text">Hotels, your biggest worry that we have scenic view from balcony or not consider this as resolved when you book through us.</p>
                </div>
            </div>
            <div className='card col-10 col-md-3 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-card-image"
                 src={bloggingImg}
                 alt="Card cap"/>
                <div className="card-body">
                  <h5 className="text-center card-title">Blogging</h5>
                  <p className="card-text">Searching Scrolling. Searching Scrolling. Let's end this loop and search all off-beats places near popular destinations at one place.</p>
                </div>
            </div>
        </div>
    </div>

    <div id='last-field' className='container-fluid mt-2'>
        <div className='row justify-content-center align-items-end'>
            <div className='col-12 col-sm-10 box-shadow border rounded-1'>
                <div className='last-field-box p-2 m-2 text-center'>
                    <Link to="/upload"><button className='btn btn-primary box-dark-shadow'>Create & Upload Post</button></Link>
                </div>
            </div>
        </div>
    </div>

    <Footer/>
    </>
  )
}

export default Home