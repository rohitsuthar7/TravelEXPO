import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AddMainPlace = () =>{
    const [placeData, setPlaceData] = useState({place:"",image:"",description:""});
    const [debounced, setDebounced] = useState('')
    const [available, setAvailable] = useState(false)

    useEffect(()=>{
        async function fetchPlaceStatus(){
            if(placeData.place.length>0){
                const res = await fetch('/api/admin/check-place',{
                    method:"POST",
                    headers:{
                        'Content-type':'application/json',
                        'x-auth-token':localStorage.getItem('token')
                    },
                    body:JSON.stringify({place:placeData.place})
                })
                const data = await res.json()
    
                if(res.status===200 && data){
                    setAvailable(true)
                }else{
                    setAvailable(false)
                }
            }else{
                setAvailable(false)
            } 
        }
        fetchPlaceStatus();
    },[placeData.place])
    useEffect(()=>{
        const debouncedInterval = setTimeout(()=>{
            setPlaceData(p=>({...p,place:debounced}))
        },500)
        
        return ()=>{
            clearTimeout(debouncedInterval)
        }
    },[debounced])
    const handleSubmit=async(e)=>{
        e.preventDefault();

        let submitBtn = document.querySelector("#submitBtn")
        submitBtn.disabled = true
        submitBtn.innerHTML = 'Submitting...'

        const res = await fetch('/api/admin/add/blog',{
            method:"POST",
            headers:{
                'Content-type':'application/json',
                'x-auth-token':localStorage.getItem('token')
            },
            body:JSON.stringify(placeData)
        })

        const data = await res.json()

        if(res.status === 200 && data){
            submitBtn.disabled=false
            submitBtn.classList.add('btn-success')
            submitBtn.innerHTML="Submitted!"
            setTimeout(()=>{
                submitBtn.classList.remove('btn-success')
                submitBtn.innerHTML="Submit"
                setPlaceData({place:"",placeImg:"",description:""})
                setDebounced('')
            },2000)
        }else{
            submitBtn.classList.add('btn-danger')
            submitBtn.innerHTML="Not Submitted!"
            setTimeout(()=>{
                submitBtn.classList.remove('btn-danger')
                submitBtn.innerHTML="Submit"
            },2000)
        }
    }
    const handleInput = (e) =>{
        setPlaceData({...placeData,[e.target.name]:e.target.value})
    }
    return (
        <>
        <div className="container-fluid margin-top-content">
            <div className='row mt-2 mb-3 justify-content-center'>
                 <div className='col-10 col-lg-9 bg-light box-shadow border rounded-2 ps-4 p-2'>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/admin">Admin</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Place</li>
                      </ol>
                    </nav>
                 </div>
            </div>
            <div className="row justify-content-center align-items-center">
                <div className="col-11 col-lg-9 p-3 p-sm-5">
                    <form>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Place Name' name="place" 
                            value={debounced} onChange={(e)=>setDebounced(e.target.value)}/>
                            {
                                available && debounced.length>0?
                                <small className="form-text text-success">Available to list</small>
                                :
                                null
                            }
                            {
                                !available && debounced.length>0?
                                <small className="form-text text-danger">Already listed</small>
                                :
                                null
                            }
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Image Link (only)' name="image" 
                            value={placeData.image} onChange={handleInput}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <textarea className="form-control" placeholder='Enter Description' name="description" 
                            style={{height:"150px"}}
                            value={placeData.description} onChange={handleInput}/>
                        </div>
                        <button className='btn btn-primary m-2' id="submitBtn" onClick={handleSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    )
}

export default AddMainPlace;