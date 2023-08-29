const express = require('express')
const router = express.Router()
const authenticate = require('../../middlewares/authenticate');
const Hotel = require('../../models/Hotels');
const Influencer = require('../../models/Influencers');
const Bookings = require('../../models/Bookings');
const Content = require('../../models/Content');

//@route        GET /api/profile/bookings/hotel
//@Description  Getting all hotels and trips bookings of the user
//@Access       Private
router.get('/bookings/history',authenticate,async(req,res)=>{
    try {
        const findUser = await Bookings.findOne({user:req.userDetail.id})
        if(!findUser){
            return res.status(404).json({error:"No booking history"})
        }

        res.status(200).json({hotelBookings:findUser.hotelBookingDetails,tripBookings:findUser.influencerTripBookings})
    } catch (err) {
        console.error(err.message())
        res.status(500).send('Server Error')
    }
})

//@route        GET /api/profile/user/uploads
//@Description  Getting all user uploads post video and images
//@Access       Private
router.get('/user/uploads',authenticate,async(req,res)=>{
    try{
        const videoContent = await Content.find({user:req.userDetail.id,type:'video'}).sort({postedAt:-1})
        const imageContent = await Content.find({user:req.userDetail.id,type:'image'}).sort({postedAt:-1})

        if(!videoContent.length && !imageContent.length){
            return res.status(404).json({error:"No upload history!"})
        }
    
        const user = {
            user:req.userDetail.id,
            videos:videoContent,
            images:imageContent
        }
        res.status(201).json({userContent:user});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//@route        DELETE /api/profile/post/delete/:postId
//@Description  Deleting the post that user have uploaded by ID
//@Access       Private
router.delete('/post/delete/:postId',authenticate,async(req,res)=>{
    const postId = req.params.postId;
    try{
      const post = await Content.findByIdAndDelete(postId);
  
      if(post){
        return res.status(201).json({message:"Deleted Post",refresh:true})
      }
      res.status(404).json({error:"Post Not Found"})
    }catch(err){
      console.error(err.message)
      res.status(500).send('Server Error')
    }
})
module.exports = router