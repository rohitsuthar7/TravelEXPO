import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userAvatar from '../images/userAvatar.jpg'
import { getLoginData } from '../utilities/getLoginData';
import { UserContext } from '../App';
import Loader from './Loader';

const Login = () => {
    const navigate = useNavigate();
    const [show,setShow] = useState(false)
    const [loginDetails,setLoginDetails] = useState({email:'',password:''})
    const [isPageLoading,setPageLoading] = useState(true)
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
      const fetchData = async() =>{
        const userData = await getLoginData();

        setPageLoading(false)
        if(userData){
          navigate('/')
        }else{
          navigate('/login')
        }
      }
      fetchData();
    },[])
    const handlePassVisibility=(e)=>{
      e.preventDefault()
      setShow(!show)
    }
    const handleLoginData=(e)=>{
      const key = e.target.name
      setLoginDetails(l=>({...l,[key]:e.target.value}))
    }
    const handleLogin=async(e)=>{
      e.preventDefault();

      let loginBtn = document.querySelector("#loginBtn")
      loginBtn.disabled=true;
      loginBtn.innerHTML="Logging in..."

      const res = await fetch('/api/auth',{
        method:"POST",
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify(loginDetails)
      })

      const data = await res.json()

      if(res.status===200){
        loginBtn.disabled=false
        loginBtn.classList.remove('btn-primary')
        loginBtn.classList.add('btn-success')
        loginBtn.innerHTML="Logged In!"

        localStorage.setItem('token',data.token)
        const userData  = await getLoginData()
        dispatch({ type:"USER", payload:userData})
        setTimeout(()=>{
          navigate('/');
        },1000)
      }else{
        alert("Login Unsuccessful!")
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
                      <div className='text-center'>
                        <img src={userAvatar} alt='general'
                         className='rounded-circle'
                         width="100px"
                         height="100px"
                         />
                      </div>
                    <h2 className='display-6 mt-3 mt-sm-none'>Welcome</h2>
                      <form>
                        <div className='form-group mt-3 mb-2'>
                            <input className="form-control" placeholder='Enter Email' name="email" 
                            value={loginDetails.email} onChange={handleLoginData}/>
                        </div>

                        <div className="input-group mt-3 mb-3">
                            <input className='form-control'  placeholder='Enter Password' type={show?'text':'password'}
                            name="password" value={loginDetails.password} onChange={handleLoginData}/>
                            <div className="input-group-append ">
                              <span style={{borderRadius:"0 5px 5px 0"}} onClick={handlePassVisibility} className="input-group-text">
                                {!show?"Show":"Hide"}
                              </span>
                            </div>
                        </div>
                        <button className='btn btn-primary m-2' id="loginBtn" onClick={handleLogin}>Login</button>
                        <p className='card-text'>Don't have an account? <Link to='/register'>Register here</Link></p>
                    </form>
                </div>
            </div>
        </div>
      }
    </>
  )
}

export default Login