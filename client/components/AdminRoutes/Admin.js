import React, { useState, useEffect } from 'react'
import influencerImg from '../../images/bookingsCover/2.jpg';
import hotelBookingImg from '../../images/bookingsCover/1.jpg'
import { useNavigate } from 'react-router-dom';
import { getAdminAuth } from '../../utilities/getAdminAccess';
import Loader from '../Loader';

const Admin = () => {
    const navigate = useNavigate();
    const [isPageLoading, setPageLoading] = useState(true)

    useEffect(()=>{
      const fetchData = async() =>{
        const userData = await getAdminAuth();

        setPageLoading(false)
        if(!userData){
          navigate('/')
        }
      }
      fetchData();
    },[])
  return (
    <>
    {
      isPageLoading?
      <Loader/>
      :
      <div className='container-fluid margin-top-content'>
        <div className='row justify-content-center align-items-center mt-3'>
            <div className='display-6 text-center text-shadow'>Admin Panel</div>
            <div className='card col-10 col-md-5 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-booking-image"
                 src={hotelBookingImg}
                 alt="Card cap" style={{backgroundColor:"#c67474"}}/>
                <div className="card-body rounded-2 text-center">
                  <h5 className=" card-title">Manage Hotels</h5>
                  <p className='card-text'>Add, Delete, Update your Hotels.</p>
                
                  <button className='btn btn-primary m-2 rounded-5' onClick={()=>navigate("/admin/add/hotel")}>Add Hotels</button>
                  <button className='btn btn-outline-primary m-2 rounded-5' onClick={()=>navigate("/admin/update/hotel")}>Update Hotels Data</button>
                  <button className='btn btn-danger m-2 rounded-5' onClick={()=>navigate("/admin/delete/hotel")}>Delete Hotel </button>
                </div>
            </div>
            <div className='card col-10 col-md-5 m-3 p-0 box-shadow border'>
                <img className="card-img-top custom-booking-image"
                 src={influencerImg}
                 alt="Card cap" style={{backgroundColor:"#aa91af"}}/>
                <div className="card-body rounded-2 text-center">
                  <h5 className=" card-title">Manage Influencer Trips</h5>
                  <p className="card-text">Add, Delete, Update your Influencer Trips.</p>
                    
                  <button className='btn btn-primary m-2 rounded-5' onClick={()=>navigate('/admin/add/influencer')}>Add Influencer Trip</button>
                  <button className='btn btn-outline-primary m-2 rounded-5' onClick={()=>navigate('/admin/update/trip')}>Update Influencer Trip</button>
                  <button className='btn btn-danger m-2 rounded-5' onClick={()=>navigate('/admin/delete/trip')}>Delete Influencer Trip</button>
                </div>
            </div>
            <div className='card col-10 col-md-5 m-3 p-0 box-shadow border'>
                <div className='card-img-top custom-booking-image p-5 text-center display-6'style={{backgroundColor:"#aa91af"}}>
                  Blogs
                </div>
                <div className="card-body rounded-2 text-center">
                  <h5 className=" card-title">Manage Blog Data</h5>
                  <p className="card-text">Add Famous Place, Add Off-beat Places</p>
                    
                  <button className='btn btn-primary m-2 rounded-5' onClick={()=>navigate('/admin/add/place')}>Add Main Place</button>
                  <button className='btn btn-primary m-2 rounded-5' onClick={()=>navigate('/admin/add/top-place')}>Add Famous Places</button>
                  <button className='btn btn-primary m-2 rounded-5' onClick={()=>navigate('/admin/add/off-beat')}>Add Off-beat</button>
                  <button className='btn btn-danger m-2 rounded-5' onClick={()=>navigate('/admin/delete/place')}>Delete Blog Data</button>
                </div>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default Admin