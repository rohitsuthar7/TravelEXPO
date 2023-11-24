import React, { useRef, useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaPeopleArrows} from "react-icons/fa";

const AddInfluencer = () => {
    const [startDate,setStartDate] = useState(null)
    const [endDate,setEndDate] = useState(null)
    const [influencer,setInfluencer] = useState({name:"",username:"",seats:0,place:"",price:0,file:null})
    const formRef = useRef();
    const formData = new FormData()

    const prepareFormData = () =>{
        const { name, username, seats, place, price, file } = influencer;
        formData.append("name",name)
        formData.append("username",username)
        formData.append("seats",seats)
        formData.append("place",place)
        formData.append("price",price)
        formData.append("startDate", startDate)
        formData.append("endDate", endDate)
        formData.append("influencer",file)
    }
    const handleInfluencer = (e) =>{
        const key = e.target.name

        setInfluencer(h=>({...h,[key]:e.target.value}))
    }
    const handleFormSubmit = async(e) =>{
        e.preventDefault()
        prepareFormData();

        let submitBtn = document.getElementById('submitBtn')
        submitBtn.innerHTML="Submitting..."
        submitBtn.disabled=true

        const res = await fetch('/api/admin/add/influencer', {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()
        if(res.status===200 && data){
            console.log(data);
            alert('Uploaded Successfully')
            submitBtn.disabled=false
            submitBtn.classList.remove('btn-primary')
            submitBtn.classList.add('btn-success')
            submitBtn.innerHTML="Submitted!"
            setTimeout(()=>{
                submitBtn.classList.remove('btn-success')
                submitBtn.classList.add('btn-primary')
                submitBtn.innerHTML="Submit"   
            },3000)

            //Resetting the input fields 
            formRef.current.reset() //type="file" reset
            setStartDate(null);
            setEndDate(null);
            setInfluencer({ name: "", username: "", seats: 0, place: "", price: 0, file: null });
        }else{
            alert(data.error)
        }
    }
  return (
    <>
    <div className='container-fluid'>
            <div className='row justify-content-center align-items-center vh-100'>
                <div className='col-11 col-md-6 p-3 p-sm-5 text-center'>
                    <h2 className='display-6 mt-3 mt-sm-none'><FaPeopleArrows/> List Traveller Trip</h2>
                      <form ref={formRef} encType='multipart/form-data'>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Influencer Name' name="name"
                            value={influencer.name}
                            onChange={handleInfluencer}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Influencer Username' name="username"
                            value={influencer.username}
                            onChange={handleInfluencer}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Price' name="price"
                            value={influencer.price===0?'':influencer.price}
                            onChange={handleInfluencer}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Seats' name="seats"
                            value={influencer.seats===0?'':influencer.seats}
                            onChange={handleInfluencer}/>
                        </div>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Travel Place' name="place"
                            value={influencer.place}
                            onChange={handleInfluencer}/>
                        </div>
                        <div className="form-group  mt-3 mb-2">
                          <input name="influencer" type="file" className="form-control" onChange={(e)=>setInfluencer({...influencer,file:e.target.files[0]})}/>
                        </div>
                        <div className="form-group d-flex mt-3 mb-2 align-items-center">
                            <div className='p-2'>
                                <FaCalendar size="18px"/>
                            </div>
                            <div className='pe-1 w-100'>
                                <DatePicker
                                 placeholderText='Start Date'
                                 className='form-control'
                                 selected={startDate}
                                 onChange={date=>setStartDate(date)}
                                 minDate={new Date()}
                                 dateFormat='dd/MM/yyyy'
                                 isClearable
                                 showYearDropdown
                                 scrollableYearDropdown
                                />
                            </div>
                            <div className='ps-1 w-100'>
                                <DatePicker
                                 placeholderText='End Date'
                                 className='form-control'
                                 selected={endDate}
                                 onChange={date=>setEndDate(date)}
                                 minDate={ startDate?startDate:new Date()}
                                 dateFormat='dd/MM/yyyy'
                                 isClearable
                                 showYearDropdown
                                 scrollableYearDropdown
                                />
                            </div>
                        </div>
                        <button className='btn btn-primary mt-3' onClick={handleFormSubmit} id='submitBtn'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default AddInfluencer