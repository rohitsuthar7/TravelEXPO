import './App.css';
import React, { createContext, useReducer } from 'react';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import { initialState, userReducer } from './reducers/userReducer';
import Profile from './components/Profile';
import Bookings from './components/Bookings';
import HotelBookings from './components/HotelBookings';
import Admin from './components/AdminRoutes/Admin';
import AddHotel from './components/AdminRoutes/AddHotel';
import DatePicker from './components/OnlyForTesting';
import AddInfluencer from './components/AdminRoutes/AddInfluencer';
import InfluencerBookings from './components/InfluencerBookings';
import UploadPage from './components/UploadPage';
import Social from './components/Social';
import Blogs from './components/Blogs';
import UserProfileCard from './components/UserProfileCard';
import DeleteHotel from './components/AdminRoutes/DeleteHotel';
import UpdateHotel from './components/AdminRoutes/UpdateHotel';
import DeleteTrip from './components/AdminRoutes/DeleteTrip';
import UpdateTrip from './components/AdminRoutes/UpdateTrip';
import AddMainPlace from './components/AdminRoutes/AddMainPlace';
import AddOffbeatPlaces from './components/AdminRoutes/AddOffbeatPlaces';
import AddFamousPlaces from './components/AdminRoutes/AddFamousPlaces';
import DeleteBlogData from './components/AdminRoutes/DeleteBlogData';

export const UserContext = createContext()
const App = () => {
  const [state,dispatch] = useReducer(userReducer,initialState)
  return (
    <>
    <UserContext.Provider value={{state, dispatch}}>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}>
        </Route>
        <Route path='/login' element={<Login/>}>
        </Route>
        <Route path='/register' element={<Register/>}>
        </Route>
        <Route path='/profile' element={<Profile/>}>
        </Route>
        <Route path='/bookings' element={<Bookings/>}>
        </Route>
        <Route path='/bookings/hotels' element={<HotelBookings/>}>
        </Route>
        <Route path='/bookings/influencer' element={<InfluencerBookings/>}>
        </Route>
        <Route path='/upload' element={<UploadPage/>}>
        </Route>
        <Route path='/social' element={<Social/>}>
        </Route>
        <Route path='/blogs' element={<Blogs/>}>
        </Route>
        <Route path='/user-profile/:username' element={<UserProfileCard/>}>
        </Route>


        <Route path='/test' element={<DatePicker/>}>
        </Route>

        {/* ADMIN ROUTES */}
        <Route path='/admin' element={<Admin/>}>
        </Route>
        <Route path='/admin/add/hotel' element={<AddHotel/>}>
        </Route>
        <Route path='/admin/delete/hotel' element={<DeleteHotel/>}>
        </Route>
        <Route path='/admin/update/hotel' element={<UpdateHotel/>}>
        </Route>

        <Route path='/admin/add/influencer' element={<AddInfluencer/>}>
        </Route>
        <Route path='/admin/delete/trip' element={<DeleteTrip/>}>
        </Route>
        <Route path='/admin/update/trip' element={<UpdateTrip/>}>
        </Route>

        <Route path='/admin/add/place' element={<AddMainPlace/>}>
        </Route>
        <Route path='/admin/add/off-beat' element={<AddOffbeatPlaces/>}>
        </Route>
        <Route path='/admin/add/top-place' element={<AddFamousPlaces/>}>
        </Route>
        <Route path='/admin/delete/place' element={<DeleteBlogData/>}>
        </Route>
        <Route path='*' element={<ErrorPage/>}>
        </Route>
      </Routes>
    </UserContext.Provider>
    </>
  );
}

export default App;
