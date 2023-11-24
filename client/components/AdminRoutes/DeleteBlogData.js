import React, { useState, useEffect } from "react";
import { FaArrowAltCircleDown, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

const DeleteBlogData = () =>{
    const [available, setAvailable] = useState(false)
    const [place, setPlace] = useState('')
    const [debounced, setDebounced] = useState('')
    const [searchData, setSearchData] = useState({})
    const [topPlaceOpen, setTopPlaceOpen] = useState(false)
    const [offBeatOpen, setOffBeatOpen] = useState(false)

    useEffect(()=>{
        async function fetchPlaceStatus(){
            if(debounced.length>0){
                const res = await fetch('/api/admin/check-place',{
                    method:"POST",
                    headers:{
                        'Content-type':'application/json',
                        'x-auth-token':localStorage.getItem('token')
                    },
                    body:JSON.stringify({place})
                })
                const data = await res.json()
    
                if(res.status!==200 && data){
                    setAvailable(true)
                }else{
                    setAvailable(false)
                }
            }else{
              setAvailable(false)
            }
        }
        fetchPlaceStatus();
    },[place])
    useEffect(()=>{
        const debouncedInterval = setTimeout(()=>{
            setPlace(debounced)
        },500)
        
        return ()=>{
            clearTimeout(debouncedInterval)
        }
    },[debounced])

    const handleDeleteDoc = async() =>{
        const res = await fetch(`/api/admin/blogs/${place}`,{
            method:"DELETE",
            headers:{
                'x-auth-token':localStorage.getItem('token')
            }
        })
        const data = await res.json()

        if(res.status===200 && data){
            alert("DONE")
        }
    }
    const handleUpdateDoc = async(index,mode) =>{
        const updatedData = searchData;
        if(mode===0){
            updatedData.topPlaces.splice(index,1);
        }else{
            updatedData.offbeatPlaces.splice(index,1);
        }
        setSearchData(updatedData)

        const res = await fetch(`/api/admin/blogs/${place}`,{
            method:"PUT",
            headers:{
                'x-auth-token':localStorage.getItem('token'),
                'Content-type':'application/json'
            },
            body:JSON.stringify({topPlaces:updatedData.topPlaces,offbeatPlaces:updatedData.offbeatPlaces})
        })
        const data = await res.json()

        if(res.status===200 && data){
            alert("DONE")
        }
    }
    const handleSearchClick = async() =>{
        const res = await fetch(`/api/admin/blogs/${place}`,{
            method:"GET"
        })

        const data = await res.json()

        if(res.status===200 && data){
            setSearchData(data.blog)
        }else{
           alert('Refresh! Nothing to display')
        }
    }
    return (
        <>
        <div className='container-fluid margin-top-content'>
            <div className='row mt-2 mb-3 justify-content-center'>
                 <div className='col-10 col-lg-9 bg-light box-shadow border rounded-2 ps-4 p-2'>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin">Admin</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Delete Blogs</li>
                      </ol>
                    </nav>
                 </div>
            </div>
            <div className="row justify-content-center align-items-center">
                <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
                    <h4 className='lead'>Delete Main Place, Off-beat or top places...</h4>
                    <div className="input-group mt-3 mb-3">
                          <input
                            className='form-control'
                            placeholder='Search for any place...'
                            type="text"
                            name="place"
                            value={debounced}
                            onChange={(e)=>setDebounced(e.target.value)}
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
                    {
                        available && debounced.length>0?
                        <small className="form-text text-start text-success">Listed! Delete place</small>                      
                        :
                        null
                    }
                    {
                        !available && debounced.length>0?
                        <small className="form-text text-start text-danger">Place not listed</small>
                        :
                        null
                    }
                    {
                        searchData.topPlaces || searchData.offbeatPlaces?
                        <div className="text-center" onClick={handleDeleteDoc}>
                            <button className="btn btn-danger"><FaTrashAlt/> Delete Whole Place</button>
                        </div>
                        :null
                    }
                    
                </div>
                {
                    searchData?
                    <>
                    <div className="bg-light box-shadow rounded p-3 col-11 col-sm-10 col-lg-9 m-1"
                    onClick={()=>{
                        if(!searchData.topPlaces){
                            alert("No top places")
                        }else{
                            setTopPlaceOpen(!topPlaceOpen)
                            setOffBeatOpen(false)
                        }
                    }}>
                        <span className={`h4 ${topPlaceOpen?'text-muted':''}`}>
                            Top Places 
                            &nbsp;{topPlaceOpen?<IoIosArrowDropup/>:<IoIosArrowDropdown/>}
                        </span>
                    </div>
                    </>
                    :null
                }
                {
                    searchData.topPlaces && topPlaceOpen ? 
                        <>
                        {searchData.topPlaces.map((place,index)=>(
                            <div key={index} className='col-11 col-sm-10 col-lg-9 card box-shadow border rounded-1 m-2 ' >
                              <div className='row justify-content-center Bookings-card'>
                                <div className="col-12 col-md-4 col-md- p-3 Bookings-image order-md-0"  style={{backgroundColor:"#dde2ff"}}>
                                  <img src={place.img} className='rounded-1' alt='place'/>
                                </div>
                                <div className='col-12 col-md-8 ps-3 pt-1 pt-md-4 Bookings-description rounded'>
                                    <h5 className="mt-1 mt-md-0">{index+1}. {place.name}</h5>
                                    <button className="btn btn-danger mb-3 mt-2" onClick={
                                        ()=>handleUpdateDoc(index,0)
                                    }><FaTrashAlt/> Remove</button>
                                </div>
                              </div>
                          </div>
                          
                         ))  }
                        </> :null
                }

                {
                    searchData!=={}?
                    <>
                    <div className="bg-light box-shadow rounded p-3 col-11 col-sm-10 col-lg-9 m-1"
                    onClick={()=>{
                        if(!searchData.topPlaces){
                            alert("No offbeat places")
                        }else{
                            setOffBeatOpen(!offBeatOpen)
                            setTopPlaceOpen(false)
                        }
                    }}>
                        <span className={`h4 ${offBeatOpen?'text-muted':''}`}>
                            Off-beat Places 
                            &nbsp;{offBeatOpen?<IoIosArrowDropup/>:<IoIosArrowDropdown/>}
                        </span>
                    </div>
                    </>
                    :null
                }
                {
                    searchData.offbeatPlaces && offBeatOpen ? 
                        <>
                        {searchData.offbeatPlaces.map((place,index)=>(
                            <div key={index} className='col-11 col-sm-10 col-lg-9 card box-shadow border rounded-1 m-2 ' >
                              <div className='row justify-content-center Bookings-card'>
                                <div className="col-12 col-md-4 col-md- p-3 Bookings-image order-md-0"  style={{backgroundColor:"#dde2ff"}}>
                                  <img src={place.img} className='rounded-1' alt='place'/>
                                </div>
                                <div className='col-12 col-md-8 ps-3 pt-1 pt-md-4 Bookings-description rounded'>
                                    <h5 className="mt-1 mt-md-0">{index+1}. {place.name}</h5>
                                    <button className="btn btn-danger mb-3 mt-2" onClick={
                                        ()=>handleUpdateDoc(index,1)
                                    }><FaTrashAlt/> Remove</button>
                                </div>
                              </div>
                          </div>
                          
                         ))  }
                        </> :null
                }
            </div>
        </div>
        </>
    )
}

export default DeleteBlogData;