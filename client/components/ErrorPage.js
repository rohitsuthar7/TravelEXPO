import React from 'react'
import { Link } from 'react-router-dom'
import ErrorImg from '../images/404Error.jpg'

const ErrorPage = () => {
  return (
    <>
    <div className='container-fluid mt-5'>
        <div className='row justify-content-center align-items-center' style={{height:"calc(100vh - 56px)"}}>
            <div className='col-12 col-md-6 order-md-2' id="error-page-img">
                <img src={ErrorImg} alt='Error' width="100%" height="auto"/>
            </div>
            <div className='col-12 col-md-6 text-center order-md-1'>
                <h2 className='display-6'>Lost while travelling our website</h2>
                <p className='lead'>Don't worry we are here to find your beat in Off-beat</p>
                <Link to='/'><button className='btn btn-primary'>Back to home</button></Link>
            </div>
        </div>
    </div>
    </>
  )
}

export default ErrorPage