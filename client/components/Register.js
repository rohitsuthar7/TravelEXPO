import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLoginData } from '../utilities/getLoginData';
import Loader from './Loader';

const Register = () => {
    const [show,setShow] = useState(false)
    const [formData,setFormData] = useState({ name:"",email:"",username:"",password:""});
    const [available,setAvailable] = useState(false);
    const [debounced,setDebounced] = useState('');
    const [isPageLoading, setPageLoading] = useState(true)
    const navigate = useNavigate()
    const handleClick=(e)=>{
        e.preventDefault()
        setShow(!show)
    }

    const handleFormData = (e) =>{
        const key = e.target.name

        setFormData(f=>({...f,[key]:e.target.value}))
    }

    useEffect(()=>{
        const fetchData = async() =>{
          const userData = await getLoginData();
  
          setPageLoading(false)
          if(userData){
            navigate('/')
          }else{
            navigate('/register')
          }
        }
        fetchData();
      },[])

    useEffect(()=>{
        async function fetchUsernameStatus(){
            if(formData.username.length>=6){
                console.log(formData.username.length," Andr kese gusa Bc")
                const res = await fetch('/api/users/check-username',{
                    method:"POST",
                    headers:{
                        'Content-type':'application/json'
                    },
                    body:JSON.stringify(formData)
                })
                const data = await res.json()
    
                if(res.status===200){
                    setAvailable(true)
                }else{
                    setAvailable(false)
                }
            }else{
                setAvailable(false)
            } 
        }
        fetchUsernameStatus();
    },[formData.username])

    useEffect(()=>{
        const debouncedInterval = setTimeout(()=>{
            setFormData(f=>({...f,username:debounced}))
        },1000)
        
        return ()=>{
            clearTimeout(debouncedInterval)
        }
    },[debounced])

    const handleFormSubmit=async(e)=>{
        e.preventDefault()

        let registerBtn = document.getElementById('registerBtn')
        registerBtn.disabled=true
        registerBtn.classList.add('btn-secondary')
        registerBtn.innerHTML="Registering..."
        try {
            if(!formData.email || !formData.name || !formData.password || !formData.username){
                alert("All fields are required")
                throw new Error("All fields are required")
            }
            
            const res = await fetch('/api/users/register',{
                method:"POST",
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(formData)
            })
            const data = await res.json()

            if(res.status===200){
                registerBtn.classList.add('btn-success')
                registerBtn.disabled=false
                registerBtn.innerHTML="Registered!"
                setTimeout(()=>{
                    navigate('/login')
                },2000)
            }else{
                registerBtn.classList.remove('btn-secondary')
                registerBtn.disabled=false
                registerBtn.innerHTML="Register"
                alert(data.msg)
                setFormData({})
            }

        } catch (error) {
            console.error(error);
        }

    }
  return (
    <>
    {
        isPageLoading?
        <Loader/>
        :
        <>
    <div className='container-fluid'>
        <div className='row justify-content-center align-items-center' style={{height:"100vh"}}>
            <div className='col-11 col-md-6 card-md-6 p-3 p-sm-5'>
        
                <h2 className='display-6 mt-3 mt-sm-none text-center'>
                <img src="https://img.freepik.com/free-vector/woman-personal-profile-employer-holding-job-candidate-cv-employee-resume-isolated-flat-design-element-medical-clinic-hospital-patient-card-concept-illustration_335657-1660.jpg?w=740&t=st=1685187967~exp=1685188567~hmac=6f1a7c9bcefb8b64bddb124cbee2c33e7921ad74c145b882c728809d12f01e28" alt='general'
                     className='rounded-circle border d-md-none d-inline me-2'
                     width="70px"
                     height="70px"
                     />
                    Register
                </h2>
                <form>
                    <div className='form-group mt-3 mb-2'>
                        <input className="form-control" placeholder='Enter Name' name="name" 
                        value={formData.name} onChange={handleFormData}/>
                    </div>
                    <div className='form-group mt-3 mb-2'>
                        <input className="form-control" placeholder='Enter Email' name="email"
                        value={formData.email} onChange={handleFormData}/>
                    </div>
                    <div className='form-group mt-3 mb-2'>
                        <input name='username' className="form-control" 
                        placeholder='Enter Username' type='text' 
                        value={debounced} onChange={(e)=>setDebounced(e.target.value)}/>
                        {
                            available && formData.username!==''?
                            <small className="form-text text-success">Success! Username available</small>
                            :
                            null
                        }
                        {
                            !available && formData.username.length>=6 && formData.username!==''?
                            <small className="form-text text-danger">Username not available</small>
                            :
                            null
                        }
                        {
                            formData.username.length<6?
                            <small className="form-text text-muted">Username must be atleast 6 characters</small>
                            :
                            null
                        }
                    </div>
                    <div className="input-group mt-3 mb-3">
                        <input className='form-control'  placeholder='Enter Password' type={show?'text':'password'}
                        name="password" value={formData.password} onChange={handleFormData}/>
                        <div className="input-group-append ">
                          <span style={{borderRadius:"0 5px 5px 0"}} onClick={handleClick} className="input-group-text">
                            {!show?"Show":"Hide"}
                          </span>
                        </div>
                    </div>
                    <div className='text-center'>
                        <button onClick={(e)=>handleFormSubmit(e)} className='btn btn-primary m-2' id='registerBtn'>Register</button>
                        <p className='card-text'>Already have an account? <Link to='/login'>Login now!</Link></p>
                    </div>
                </form>
            </div>
            <div className='d-none d-md-block col-md-6' style={{height:"100%",backgroundColor:"white",alignItems:"center"}}>
                <img src="https://img.freepik.com/free-vector/woman-personal-profile-employer-holding-job-candidate-cv-employee-resume-isolated-flat-design-element-medical-clinic-hospital-patient-card-concept-illustration_335657-1660.jpg?w=740&t=st=1685187967~exp=1685188567~hmac=6f1a7c9bcefb8b64bddb124cbee2c33e7921ad74c145b882c728809d12f01e28"
                 alt='general'
                 width="100%"
                 height="100%"/>
            </div>
        </div>
    </div>
    </>
    }
    </>
  )
}

export default Register