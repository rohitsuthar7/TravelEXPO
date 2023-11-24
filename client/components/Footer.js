import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
  return (
    <>
    <div className='container-fluid bg-light border box-shadow mt-5'>
        <div id='footer' className='row justify-content-center'>
            <div className='d-block col-12 col-md-8 text-center'>
                <h2><span style={{fontFamily:'Lucida Handwriting',color:"blue"}}>Travel </span>EXPO.com</h2>
            </div>
            <div className='d-block col-12 col-md-7 p-2 text-center border-top'>
                <div className='row justify-content-center'>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/')}>Home</div>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/social')}>Explore</div>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/bookings')}>Bookings</div>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/blogs')}>Blogs</div>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/login')}>Login</div>
                    <div className='col-12 col-md-2 p-1 hover-link' onClick={()=>navigate('/register')}>Register</div>
                </div>
            </div>
            <div className='d-block col-12 col-md-7 p-2'>
                <div className='row justify-content-center'>
                    <div className='col-6 text-center'>
                        <span className='m-2 text-dark'>
                            <i className="fab fa-facebook"></i>
                        </span>
                        <span className='m-2 text-dark'>
                            <i className="fab fa-twitter"></i>
                        </span>
                        <span className='m-2 text-dark'>
                            <i className="fab fa-instagram"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div className='d-block col-12 text-center p-2' style={{backgroundColor:"lightgrey"}}>
                     © 2023 Company, Inc. All rights reserved.
            </div>
        </div>
    </div>
    </>
  )
}

export default Footer