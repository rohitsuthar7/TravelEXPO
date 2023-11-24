import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getAdminAuth } from '../../utilities/getAdminAccess';
import Loader from '../Loader';
import { FaBan, FaCheck, FaTrashAlt } from 'react-icons/fa';

const DeleteHotel = () => {
    const navigate = useNavigate();
    const [isPageLoading, setPageLoading] = useState(true)
    const [searchInp, setSearchInp] = useState('');
    const [hotelsData, setHotelData] = useState([])

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
            const res = await fetch(`/api/admin/hotels?search=${searchInp}`,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('token')
                }
            })
            const data = await res.json();

            if(res.status===201 && data){
                setHotelData(data.hotels)
            }
        }catch(err){
            console.error(err.message)
        }
    }

    const handleDelete = async(id) =>{
        const shouldDelete = window.confirm("Are you sure to delete this hotel");
        let deleteBtn = document.querySelector('#deleteBtn')
        deleteBtn.disabled=true
        deleteBtn.innerHTML="Deleting..."

        if(shouldDelete){
            const res = await fetch(`/api/admin/delete/hotel/${id}`,{
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
                    <li className="breadcrumb-item active" aria-current="page">Delete hotel</li>
                  </ol>
                </nav>
             </div>
        </div>
        <div className="row justify-content-center align-items-center">
            <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
              <h4 className='lead'>Find out Hotels and Delete...</h4>
              <div className="input-group mt-3 mb-3">
                <input
                  className='form-control'
                  placeholder='Search for Hotels or Places...'
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
              hotelsData.map((hotel)=>(
                <div key={hotel._id} className='container-fluid'>
                  <div className='row justify-content-center align-items-center'>
                    <div className='col-11 col-sm-10 col-lg-9 card bg-light box-shadow border rounded-1 m-2 ' >
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
                                  <button className='btn btn-danger mb-3 text-end' 
                                  onClick={()=>{handleDelete(hotel._id)}}
                                  id='deleteBtn'
                                  ><FaTrashAlt/> Delete</button>
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

export default DeleteHotel