import React from 'react'
import carousel1 from "../images/background1.jpg"
import carousel2 from "../images/background2.jpg"
import carousel3 from "../images/background3.jpg"
import { useNavigate } from 'react-router-dom'

const Carousel = () => {
  const navigate = useNavigate();
  return (
    <>
    <div id="carouselExampleInterval" className="carousel slide carousel-fade main-header d-none d-sm-block" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleInterval" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item carousel-images active" data-bs-interval="4000">
            <img src={carousel1} className="d-block w-100"alt="..."/>
            <div className="text-start carousel-caption d-none d-md-block carousel-detail">
              <h2 className="text-shadow">FIND.</h2>
              <h2 className="text-shadow">EXPLORE.</h2>
              <h2 className="text-shadow">ADVENTURE.</h2>
              <button className='btn btn-primary' onClick={()=>{
                localStorage.getItem('token')?
                navigate('/upload')
                :
                navigate('/register')
              }}>Get Started</button>
            </div>
          </div>
          <div className="carousel-item carousel-images" data-bs-interval="3000">
            <img src={carousel2} className="d-block w-100" alt="..."/>
            <div className="text-start carousel-caption d-none d-md-block carousel-detail">
              <h2 className="text-shadow">GO.</h2>
              <h2 className="text-shadow">GREEN &.</h2>
              <h2 className="text-shadow">GET PEACE.</h2>
            </div>
          </div>
          <div className="carousel-item carousel-images" data-bs-interval="3000">
            <img src={carousel3} className="d-block w-100" alt="..."/>
            <div className="text-start carousel-caption d-none d-md-block carousel-detail">
              <h2 className="text-shadow">FORT.</h2>
              <h2 className="text-shadow">LAKES.</h2>
              <h2 className="text-shadow">MONSOON.</h2>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </div>
    </>
  )
}

export default Carousel