import React, { useState, useRef, useEffect } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { FaHotel } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { getAdminAuth } from '../../utilities/getAdminAccess';

const AddHotel = () => {
    const [hotelData,setHotelData] = useState({name:"",description:"",roomQty:0,place:"",price:0,file:null})
    const formRef = useRef();
    const formData = new FormData()

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

    const prepareFormData = () =>{
        const { name, description, roomQty, place, price, file } = hotelData;
        formData.append("name",name)
        formData.append("description",description)
        formData.append("roomQty",roomQty)
        formData.append("place",place)
        formData.append("price",price)
        formData.append("hotelimg",file)
    }
    const handleHotelData = (e) =>{
        const key = e.target.name

        setHotelData(h=>({...h,[key]:e.target.value}))
    }
    const handleFormSubmit = async(e) =>{
        e.preventDefault()
        prepareFormData();

        let hotelBtn = document.querySelector('#hotelAddBtn');
        hotelBtn.disabled =true
        hotelBtn.classList.add('btn-secondary');
        hotelBtn.innerHTML="Submitting..."

        const res = await fetch('/api/admin/add/hotel', {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()

        if(data && res.status===200){
            hotelBtn.disabled = false
            hotelBtn.classList.add('btn-success');
            hotelBtn.innerHTML="Submitted!"

            setTimeout(()=>{
                hotelBtn.classList.remove('btn-success');
                hotelBtn.classList.remove('btn-secondary');
                hotelBtn.innerHTML="Submit"
            },2000)
            formRef.current.reset();
            setHotelData({name:"",description:"",roomQty:0,place:"",price:0,file:null});
        }else{
            alert(data.error)
        }
    }
  return (
    <>
    {
        isPageLoading?
        <Loader/>
        :
        <div className='container-fluid'>
            <div className='row justify-content-center align-items-center vh-100'>
                <div className='col-11 col-md-6 p-3 p-sm-5 text-center'>
                    <h2 className='display-6 mt-3 mt-sm-none'><FaHotel/> List Hotels</h2>
                      <form encType='multipart/form-data' ref={formRef}>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Hotel Name' name="name"
                            value={hotelData.name}
                            onChange={handleHotelData}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Hotel Description' name="description"
                            value={hotelData.description}
                            onChange={handleHotelData}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Price' name="price"
                            value={hotelData.price===0?'':hotelData.price}
                            onChange={handleHotelData}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Room Quantity' name="roomQty"
                            value={hotelData.roomQty===0?'':hotelData.roomQty}
                            onChange={handleHotelData}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Hotel Place' name="place"
                            value={hotelData.place}
                            onChange={handleHotelData}/>
                        </div>
                        <div className="form-group mt-3 mb-2">
                          <input name="hotelimg" type="file" className="form-control" onChange={(e)=>setHotelData({...hotelData,file:e.target.files[0]})}/>
                        </div>
                        <button className='btn btn-primary mt-3' id='hotelAddBtn' onClick={handleFormSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    }
    </>
  )
}

export default AddHotel