const express = require('express')
const router = express.Router()
const authenticate = require('../../middlewares/authenticate');
const Hotel = require('../../models/Hotels');
const Influencer = require('../../models/Influencers');
const Bookings = require('../../models/Bookings');


//@route        GET /api/bookings/get/:place/hotels
//@Description  Getting all hotels for given place
//@Access       Private
router.get('/get/:place/hotels',authenticate,async(req,res)=>{
    try {
        const place = req.params.place;
        const hotels = await Hotel.find({place})

        res.status(200).json({hotels,user:req.userDetail});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')        
    }
})

//@route        GET /api/bookings/get/influencers
//@Description  Getting all influencer list
//@Access       Private
router.get('/get/influencers',authenticate,async(req,res)=>{
    try {
        const allTrips = await Influencer.find();
        
        res.status(200).json({data:allTrips,user:req.userDetail})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')        
    }
})

//@route        GET /api/bookings/get/:place/influencers
//@Description  Getting all influencer list
//@Access       Private
router.get('/get/:place/influencers',authenticate,async(req,res)=>{
    try {
        const allTrips = await Influencer.find({place:req.params.place});
        
        res.status(200).json({data:allTrips})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')        
    }
})

//@route        POST /api/bookings/hotel
//@Description  Add Booking of hotel in Order History
//@Access       Private
router.post('/hotel', authenticate, async (req, res) => {
  const { hotel_id, hotelname, checkin, checkout, user_id, roomQty, nights, amount, place } = req.body;
  try {
    const hotel = await Hotel.findOne({ _id:hotel_id});
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    console.log(hotel)
    
    const booking = {
      user: user_id,
      checkin,
      checkout,
      roomQty,
      nights,
      amount
    };

    hotel.roomQty-=roomQty;
    hotel.bookings.push(booking);
    await hotel.save();

    let user = await Bookings.findOne({user:user_id});
    const bookingData = {
        place,
        hotelid:hotel_id,
        checkin,
        checkout,
        roomQty,
        nights,
        amount,
        name:hotelname
    }
    if(user){
        user.hotelBookingDetails.push(bookingData)
    }else{
        user = new Bookings({
            user:user_id,
            hotelBookingDetails:[bookingData]
        })
    }
    await user.save();
    res.status(201).json({hotel,user})

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


//@route        POST /api/bookings/influencer
//@Description  Add Booking of Influencer trip in Order History
//@Access       Private
router.post('/influencer',authenticate,async(req,res)=>{
    const {influencer_id, influencer, user_id,seats,amount,place,startDate,endDate} = req.body

    try{
        const influencer = await Influencer.findOne({_id:influencer_id})
        if(!influencer){
            return res.status(404).json({error:"Trip not found"})
        }

        const booking = {
            user:user_id,
            seats,
            amount
        }  
        influencer.seats-=seats;
        influencer.bookings.push(booking)
        await influencer.save()
        
        
        let user = await Bookings.findOne({user:user_id});
        const bookingData = {
            place,
            influecerId:influencer_id,
            startDate,
            endDate,
            seats,
            amount,
            name:influencer
        }
        if(user){
            user.influencerTripBookings.push(bookingData)
        }else{
            user = new Bookings({
                user:user_id,
                influencerTripBookings:[bookingData]
            })
        }
        await user.save();
        res.status(201).json({influencer,user})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports=router
