import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAdminAuth } from '../../utilities/getAdminAccess';
import Loader from '../Loader';
import { FaTrashAlt } from 'react-icons/fa';

const DeleteTrip = () => {
    const navigate = useNavigate();
    const [isPageLoading, setPageLoading] = useState(true)
    const [searchInp, setSearchInp] = useState('');
    const [tripsData, setTripData] = useState([])

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

    const handleDelete = async(id) =>{
        const shouldDelete = window.confirm("Are you sure to delete this trip");
        let deleteBtn = document.querySelector('#deleteBtn')
        deleteBtn.disabled=true
        deleteBtn.innerHTML="Deleting..."

        if(shouldDelete){
            const res = await fetch(`/api/admin/delete/trip/${id}`,{
                method:"DELETE",
                headers:{
                    'x-auth-token':localStorage.getItem('token')
                }
            })
            const data = await res.json()

            if(res.status===201 && data){
                deleteBtn.disabled=false
                deleteBtn.classList.add('btn-success')
                deleteBtn.innerHTML="Deleted!"
                setTimeout(()=>{
                    window.location.reload()
                },2000)
            }else{
                alert(data.error)
            }
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
                    <li className="breadcrumb-item active" aria-current="page">Delete trip</li>
                  </ol>
                </nav>
             </div>
        </div>
        <div className="row justify-content-center align-items-center">
            <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
              <h4 className='lead'>Find out Trips and Delete...</h4>
              <div className="input-group mt-3 mb-3">
                <input
                  className='form-control'
                  placeholder='Search for Influencer or Places...'
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
                                   onClick={()=>handleDelete(trip._id)} 
                                   className="btn btn-danger mb-3 text-end" id='deleteBtn'><FaTrashAlt/> Delete</button>
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
    </>
  )
}

export default DeleteTrip