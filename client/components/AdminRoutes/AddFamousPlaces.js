import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AddFamousPlaces = () => {
  const [place,setPlace] = useState('')
  const [topPlaces,setTopPlaces] = useState([])
  const [debounced, setDebounced] = useState('')
  const [available, setAvailable] = useState(false)

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

const handleAddField = () =>{
   if(available){
    setTopPlaces([...topPlaces,{name:'',img:'',detail:''}])
   }else{
    alert("First Enter the Place")
   }
}

const handleInput = (index, e) => {
  const { name, value } = e.target;
  const updatedtopPlaces = [...topPlaces];
  updatedtopPlaces[index][name] = value;
  setTopPlaces(updatedtopPlaces);
};

const handleRemove = (index) =>{
  let allfields = [...topPlaces]
  allfields.splice(index,1)
  setTopPlaces(allfields)
}

const handleSubmit=async(e)=>{
  e.preventDefault();

  let submitBtn = document.querySelector("#submitBtn")
  submitBtn.disabled = true
  submitBtn.innerHTML = 'Submitting...'

  const res = await fetch(`/api/admin/add/${place}/top_place`,{
      method:"POST",
      headers:{
          'Content-type':'application/json',
          'x-auth-token':localStorage.getItem('token')
      },
      body:JSON.stringify(topPlaces)
  })

  const data = await res.json()

  if(res.status === 200 && data){
      submitBtn.disabled=false
      submitBtn.classList.add('btn-success')
      submitBtn.innerHTML="Submitted!"
      setTimeout(()=>{
          submitBtn.classList.remove('btn-success')
          submitBtn.innerHTML="Submit"
          setTopPlaces([])
          setDebounced('')
          setPlace('')
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

  return (
    <div className='container-fluid margin-top-content'>
        <div className='row mt-2 mb-3 justify-content-center'>
             <div className='col-10 col-lg-9 bg-light box-shadow border rounded-2 ps-4 p-2'>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin">Admin</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add top places</li>
                  </ol>
                </nav>
             </div>
        </div>
      <div className="row justify-content-center align-items-center">
          <div className='col-10 col-lg-9 p-3 rounded-3 text-center mb-2' id='search-field'>
              <h4 className='lead'>Enter the place for adding top place...</h4>
              <div className='form-group mt-3 mb-2'>
                  <input className="form-control" placeholder='Enter Place Name' name="place" 
                  value={debounced} onChange={(e)=>setDebounced(e.target.value)}/>
                  {
                      available && debounced.length>0?
                      <small className="form-text text-start text-success">Listed! Add top place</small>                      
                      :
                      null
                  }
                  {
                      !available && debounced.length>0?
                      <small className="form-text text-start text-danger">Place not listed</small>
                      :
                      null
                  }
              </div>
              <button className='btn btn-primary m-2' onClick={handleAddField}><FaPlus/> Add</button>
          </div>
      </div>
      {
        available?
        <>
        <div className='container-fluid'>
          <div className="row justify-content-center align-items-center">
          {
            topPlaces.map((topPlace,index)=>(
              
                <div key={index} className="col-11 col-sm-10 col-lg-9 bg-light rounded box-shadow ps-3 pe-3 p-2 mt-2">
                    <form>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Off-beat place' name="name" 
                            value={topPlace.name} onChange={(e)=>handleInput(index,e)}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Image Link (only)' name="img" 
                            value={topPlace.img} onChange={(e)=>handleInput(index,e)}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <textarea className="form-control" placeholder='Enter Detail' name="detail" 
                            style={{height:"100px"}}
                            value={topPlace.detail} onChange={(e)=>handleInput(index,e)}/>
                        </div>
                        <div className='d-flex justify-content-end'>
                          <button className='btn btn-danger m-2' onClick={handleRemove}><FaTrashAlt/> Remove</button>
                        </div>
                    </form>
              </div>
            ))
          }
          </div>
        </div>
        </>
        :null
      }
      <div className="p-2 text-center"> 
        {
          available && topPlaces.length>0?
          <button className='btn btn-primary m-2' id='submitBtn' onClick={handleSubmit}>Submit</button>
          :
          <button className='btn btn-secondary m-2' disabled>Submit</button>
        }
      </div>
    </div>
  );
};

export default AddFamousPlaces;
