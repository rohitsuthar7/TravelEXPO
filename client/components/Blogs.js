import React, { useEffect, useState, useRef } from 'react'
import manaliImg from '../images/manali.jpg'
import kerelaImg from '../images/kerela.jpg'
import sikkimImg from '../images/Sikkim.jpg'
import udaipurImg from '../images/udaipur.jpg'

import { FaSearch } from 'react-icons/fa'

const Blogs = () => {
    const modeOptions = ['Famous','Off-beat']
    const btnRef = useRef();
    const [searchMode, setSearchMode] = useState(modeOptions[0])
    const [searchInp, setSearchInp ] = useState('');
    const [searchData, setSearchData] = useState(null)

    const handleSearchClick = async() =>{
        const res = await fetch(`/api/admin/get/blog/${searchInp}`,{
            method:"GET"
        })

        const data = await res.json()

        if(res.status===200 && data){
            setSearchData(data.blog)
        }else{
           alert('Refresh! Nothing to display')
        }
    }
    const handleBanner = async(query) =>{
        setSearchInp(query)
        const res = await fetch(`/api/admin/blogs/${query}`,{
            method:"GET"
        })

        const data = await res.json()

        if(res.status===200 && data){
            setSearchData(data.blog)
        }
    }
    return (
        <>
        <div className='container-fluid margin-top-content'>
              <div className="row justify-content-center align-items-center">
                <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
                  <h4 className='lead'>{searchMode===modeOptions[0]?"Search for famous places...":"Search for Off-beat places..."}</h4>
                  <div className="input-group mt-3 mb-3">
                    <input
                      className='form-control border'
                      placeholder={searchMode===modeOptions[0]?'Search for places...':'Search for off-beat places...'}
                      type="text"
                      name="place"
                      value={searchInp}
                      onChange={(e)=>setSearchInp(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span
                      style={{backgroundColor:"#EEE"}}
                      className="btn rounded-0 dropdown-toggle border"
                      type="button" data-bs-toggle="dropdown" aria-expanded="false">{searchMode===modeOptions[0]?'Famous':'Off-beat'}</span>
                      <ul className="dropdown-menu">
                        <li><a className="dropdown-item" onClick={()=>{
                          setSearchMode(modeOptions[0])
                        }}>Top Places</a></li>
                        <li><a className="dropdown-item" onClick={()=>{
                          setSearchMode(modeOptions[1])
                        }}>Off beat Places</a></li>
                      </ul>
                    </div>

                    <div className="input-group-append">
                      <button
                        ref={btnRef}
                        style={{ borderRadius: "0 5px 5px 0" }}
                        className="btn btn-primary input-group-text"
                        id='searchBtn'
                        onClick={handleSearchClick}
                      >
                        <FaSearch/>
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          {
            searchData?
                <>
                <div className="container-fluid mt-3">
                  <div className="row justify-content-center pt-3 pb-3" id="blog-head">
                    <div className="col-11 col-sm-10 col-md-4">
                      <h5 className="display-6 text-center" style={{borderBottom:"2px solid #9facf7"}}>{searchData.place}</h5>
                      <img src={searchData.placeImg} alt={searchData.place} className="w-100 rounded mt-1" />
                    </div>
                    <div className="col-11 col-md-6 pt-3 pt-md-5">
                      <p className="card-text">{searchData.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className='container-fluid mt-3 mb-5'>
                    <div className='row justify-content-center align-items-center'>
                {
                    searchData.topPlaces && searchMode === modeOptions[0] ? (
                        <>
                        <h3 className='text-center text-shadow mt-2 mb-2'>Top Places</h3>
                        {searchData.topPlaces.map((place,index)=>(
                            <div key={index} className='col-11 col-sm-10 col-lg-9 card box-shadow border rounded-1 m-2 ' >
                              <div className='row justify-content-center Bookings-card'>
                                <div className={`col-12 col-md-4 col-md- p-3 Bookings-image ${index%2?'order-md-0':'order-md-1'}`}  style={{backgroundColor:"#dde2ff"}}>
                                  <img src={place.img} className='rounded-1' alt='place'/>
                                </div>
                                <div className='col-12 col-md-8 ps-3 pt-1 pt-md-4 Bookings-description rounded'>
                                    <h5 className="mt-1 mt-md-0">{index+1}. {place.name}</h5>
                                    <p className='text-muted'>{place.detail}</p>
                                </div>
                              </div>
                          </div>
                          
                         ))  }
                        </> 
                      ) :   searchData.offbeatPlaces && searchMode === modeOptions[1] ? (
                                <>
                                <h3 className='text-center text-shadow mt-2 mb-2'>Off-beat Places</h3>
                                {searchData.offbeatPlaces.map((place,index)=>(
                                    <div key={index} className='col-11 col-sm-10 col-lg-9 card box-shadow border rounded-1 m-2 ' >
                                      <div className='row justify-content-center Bookings-card'>
                                        <div className={`col-12 col-md-4 col-md- p-3 Bookings-image ${index%2?'order-md-0':'order-md-1'}`}  style={{backgroundColor:"#dde2ff"}}>
                                          <img src={place.img} className='rounded-1' alt='place'/>
                                        </div>
                                        <div className='col-12 col-md-8 ps-3 pt-1 pt-md-4 Bookings-description rounded'>
                                            <h5 className="mt-1 mt-md-0">{index+1}. {place.name}</h5>
                                            <p className='text-muted'>{place.detail}</p>
                                        </div>
                                      </div>
                                  </div>
                                  
                                 ))  }
                                 </>    
                            ) : null
                  }
                    </div>
                </div>
                </>
            :
            <div className='container-fluid mt-3 mb-5'>
                <div className='row justify-content-center align-items-center mb-3'>
                    <div className='col-10 col-lg-9 text-start'>
                        Popular Searches...
                    </div>
                    <div className='col-12 col-md-10 col-lg-9 d-flex'>
                        <div className='w-100 d-flex card box-shadow p-2 border rounded m-1 m-sm-2' onClick={()=>handleBanner('Manali')}>
                            <img src={manaliImg} className='rounded w-100' height={120} style={{objectFit:"cover"}} alt='manali'/>
                            <div className='w-100 ps-2'>
                                <p className='lead mt-2'>Manali</p>
                                <p className='text-muted'>Majestic mountains and breath taking view...</p>
                            </div>
                        </div>
                        <div className='w-100 d-flex card box-shadow p-2 border rounded m-1 m-sm-2' onClick={()=>handleBanner('Udaipur')}>
                            <img src={udaipurImg} className='rounded w-100' height={120} style={{objectFit:"cover"}} alt='udaipur'/>
                            <div className='w-100 ps-2'>
                                <p className='lead mt-2'>Udaipur</p>
                                <p className='text-muted'>The Lakecity, the venice of India...</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 col-md-10 col-lg-9 d-flex'>
                        <div className='w-100 d-flex card box-shadow p-2 border rounded m-1 m-sm-2' onClick={()=>handleBanner('Ladakh')}>
                            <img src={sikkimImg} className='rounded w-100' height={120} style={{objectFit:"cover"}} alt='sikkim'/>
                            <div className='w-100 ps-2'>
                                <p className='lead mt-2'>Ladakh</p>
                                <p className='text-muted'>Brown and white, mountains are always right...</p>
                            </div>
                        </div>
                        <div className='w-100 d-flex card box-shadow p-2 border rounded m-1 m-sm-2' onClick={()=>handleBanner('Kerala')}>
                            <img src={kerelaImg} className='rounded w-100' height={120} style={{objectFit:"cover"}} alt='kerala'/>
                            <div className='w-100 ps-2'>
                                <p className='lead mt-2'>Kerala</p>
                                <p className='text-muted'>The Green valley surrounded by rivers and sea...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          }
        </>
    )
}

export default Blogs