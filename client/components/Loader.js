import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderWidth:"5px"
};

const Loader = () => {
    
  return (
    <div className='container-fluid'>
        <div style={{height:"100vh"}} className='row align-items-center justify-content-center'>
            <ClipLoader
            color='dodgerblue'
            size={70}
            loading={true}
            cssOverride={override}
            />
        </div>
    </div>
  )
}

export default Loader