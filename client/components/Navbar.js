import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import exploreImg from '../images/explore1.jpg'
import { getLoginData } from '../utilities/getLoginData';
import { UserContext } from '../App';
import { FaPlus } from 'react-icons/fa';

const Navbar = () => {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const {state, dispatch} = useContext(UserContext)
  const navigate = useNavigate();

  useEffect(()=>{ 
    const fetchData = async() =>{
      const userData = await getLoginData();
      dispatch({type:"USER",payload:userData})
      if(localStorage.getItem('token') && userData){
        setIsLoggedIn(true)
      }
    }
    fetchData();
  },[])

  useEffect(()=>{
    if(state){
      if(state.email){
        setIsLoggedIn(true)
      }else{
        setIsLoggedIn(false)
      }
    }
  },[state])
  return (
    <>
    <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top border-bottom">
      <div className="container">
        <a className="navbar-brand" href="#brand"><span style={{fontFamily:"Lucida Handwriting",color:"blue"}}>Travel </span>EXPO</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="main-nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to='/'  className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to='/social' className="nav-link">Social</Link>
            </li>
            <li className="nav-item">
              <Link to='/bookings' className="nav-link">Bookings</Link>
            </li>
            <li className="nav-item">
              <Link to='/blogs' className="nav-link">Blogs</Link>
            </li>
            <li className="nav-item dropdown">
              {
                isLoggedIn?
                <>
                <a className="nav-link dropdown-toggle" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={state?
                    state.avatar.includes('gravatar')?state.avatar:`http://localhost:5000/uploads/profileImages/${state.avatar}`
                    : null} alt='profile' width={23} height={23} className='rounded-circle border'/>
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  <li><Link to='/profile' className="dropdown-item">My Profile</Link></li>
                  <li><Link to='/login' className="dropdown-item"
                  onClick={()=>{
                    dispatch({type:'USER',payload:{}});
                    localStorage.clear();
                    setIsLoggedIn(false)
                  }}>Logout</Link></li>
                </ul>
                </>
                :
                <>
                <a className="nav-link dropdown-toggle" href="#check" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Login/Register
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  <li><Link to='/login' className="dropdown-item">Login</Link></li>
                  <li><Link to='/register' className="dropdown-item" href="#another">Register</Link></li>
                </ul>
                </>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {
      isLoggedIn?
      <div id='create-post-btn'>
          <button
           className='btn btn-primary rounded-circle ps-3 pe-3 p-2 box-shadow'
           data-bs-toggle="tooltip" data-bs-placement="left" title="Create a post"
           onClick={()=>navigate('/upload')}
           ><FaPlus/></button>
      </div>
      :null
    }
    </>
  )
}

export default Navbar