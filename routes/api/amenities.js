const express = require('express')
const router = express.Router()

const Hotels = require('../../models/Hotels')
const authenticate = require('../../middlewares/authenticate')
const Influencer = require('../../models/Influencers')
const hotelImgUpload = require('../../middlewares/hotelImgUpload')
const influencerImgUpload = require('../../middlewares/influecerImgUpload')
const Blog = require('../../models/Blog')

//@route        POST /api/admin/add/hotel
//@Description  Adding the hotel to the database for a place
//@Access       Private
router.post('/add/hotel',hotelImgUpload.single("hotelimg"),async(req,res)=>{
    console.log(req.body);
    const {name,description,price,roomQty,place} = req.body

    if(!req.file){
        return res.status(400).json({error:'File Missing'})
    }
    const hotelDetail = {
        name,
        description,
        price,
        roomQty,
        image:req.file.filename,
        place
    }
    
    try{
        const hotel = new Hotels(hotelDetail);
        await hotel.save()
        res.status(200).json({data:hotel})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})



//@route        POST /api/admin/add/influencer
//@Description  Adding the influencer trip details for a  place
//@Access       Private
router.post('/add/influencer',[influencerImgUpload.single('influencer')],async(req,res)=>{
    const {name,username,price,seats,startDate,endDate,place} = req.body

    if(!req.file){
        return res.status(400).json({error:'File Missing'})
    }
    
    const influencerDetail = {
        name,
        username,
        price,
        image:req.file.filename,
        seats,
        tripDates:{
            startDate,
            endDate
        },
        place
    }

    try{
        const influencer = new Influencer(influencerDetail);
        await influencer.save()
        res.status(200).json({data:influencer})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route        GET /api/admin/hotels
//@Description  Get the hotel listing form DB
//@Access       Private
router.get('/hotels',authenticate, async (req, res) => {
    const searchQuery = req.query.search;
    const regex = new RegExp(searchQuery, 'i');
  
    try {
      const hotels = await Hotels.find({
        $or: [
          { name: { $regex: regex } },
          { place: { $regex: regex } }
        ]
      });
  
      if(!hotels){
        return res.status(404).json({error:"No hotels Found!"})
      }
      res.status(201).json({ hotels });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});
//@route        GET /api/admin/trips?search=${searchInp}
//@Description  Get the hotel listing form DB
//@Access       Private
router.get('/trips',authenticate, async (req, res) => {
    const searchQuery = req.query.search;
    const regex = new RegExp(searchQuery, 'i');
  
    try {
      const trips = await Influencer.find({
        $or: [
          { name: { $regex: regex } },
          { place: { $regex: regex } }
        ]
      });
  
      if(!trips){
        return res.status(404).json({error:"No trips Found!"})
      }
      res.status(201).json({ trips });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});

//@route        PUT /api/admin/update/hotel/:hotel_id
//@Description  Delete the hotel listing from DB
//@Access       Private
router.put('/update/hotel/:hotel_id',[hotelImgUpload.single("hotelImg"),authenticate],async(req,res)=>{
    const {name,description,price,roomQty,place} = req.body
    const id = req.params.hotel_id
    try{
        let hotel = await Hotels.findById(id);

        if(!hotel){
            return res.status(401).json({error:"Hotel Not found"})
        }
        hotel.name=name;
        hotel.description=description;
        hotel.price=price;
        hotel.roomQty=roomQty;
        hotel.place=place;

        if(req.file){
            hotel.image=req.file.filename
        }

        await hotel.save();

        res.status(201).json({hotel})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})
//@route        PUT /api/admin/update/trip/:hotel_id
//@Description  Update the Trip listing from DB
//@Access       Private
router.put('/update/trip/:trip_id',[influencerImgUpload.single("influencerImg"),authenticate],async(req,res)=>{
    const {name,username,price,seats,place,startDate,endDate} = req.body
    const id = req.params.trip_id
    try{
        const trip = await Influencer.findById(id);

        if(!trip){
            return res.status(401).json({error:"trip Not found"})
        }
        trip.name=name;
        trip.username=username;
        trip.price=price;
        trip.seats=seats;
        trip.place=place;
        trip.startDate = startDate
        trip.endDate = endDate

        if(req.file){
            trip.image=req.file.filename
        }

        await trip.save();

        res.status(201).json({trip})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route        DELETE /api/admin/delete/hotel/:hotel_id
//@Description  Delete the hotel listing from DB
//@Access       Private
router.delete('/delete/hotel/:hotel_id',authenticate,async(req,res)=>{
    const id = req.params.hotel_id
    try{
        const hotel = await Hotels.findByIdAndDelete(id);

        if(!hotel){
            return res.status(401).json({error:"Error while deleting hotel"})
        }
        res.status(201).json({msg:"Hotel Deleted", refresh:true})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})
//@route        DELETE /api/admin/delete/trip/${id}
//@Description  Delete the influencer listing from DB
//@Access       Private
router.delete('/delete/trip/:trip_id',authenticate,async(req,res)=>{
    const id = req.params.trip_id
    try{
        const trip = await Influencer.findByIdAndDelete(id);

        if(!trip){
            return res.status(401).json({error:"Error while deleting trip"})
        }
        res.status(201).json({msg:"Trip Deleted", refresh:true})
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route        POST /api/admin/add/blog
//@Description  Add blog data to DB
//@Access       Private
router.post('/add/blog',authenticate,async(req,res)=>{
    const { place, image, description } = req.body
    try {
        const check = await Blog.findOne({place})
        if(check){
            return res.status(400).json({error:"Place Already Listed"})
        }
        const blog = new Blog({
            place:place.toUpperCase(),
            placeImg:image,
            description
        })

        await blog.save();
        res.status(200).json({blog})
    }catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})
//@route        POST /api/admin/check-place
//@Description  Checking for Place listed or not
//@Access       Private
router.post('/check-place',authenticate,async(req,res)=>{
    const {place} = req.body;
    try{
        const field = await Blog.findOne({place:place.toUpperCase()})
        if(field){
            return res.status(400).json({msg:"Place not available",field})
        }
        res.status(200).json({msg:"Success! Place available",field})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})
//@route        POST /api/admin/add/:place/off_beat
//@Description  Add blog data to DB
//@Access       Public
router.post('/add/:place/off_beat',authenticate, async (req, res) => {
    const place = req.params.place;
    const offbeatPlaces = req.body; // Array of offbeat places
  
    try {
      const data = await Blog.findOne({ place: place.toUpperCase() });
      if (!data) {
        return res.status(400).json({ error: "Place not Listed" });
      }
  
      // Iterate over each offbeat place in the array and push it to the offbeatPlaces array
      offbeatPlaces.forEach((offbeatPlace) => {
        const { name, img, detail } = offbeatPlace;
        data.offbeatPlaces.push({ name, img, detail });
      });
  
      await data.save();
      res.status(200).json({ data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
  
//@route        POST /api/admin/add/blog
//@Description  Add blog data to DB
//@Access       Public
router.post('/add/:place/top_place',authenticate,async(req,res)=>{
    const place = req.params.place;
    const topPlaces = req.body; // Array of offbeat places
  
    try {
      const data = await Blog.findOne({ place: place.toUpperCase() });
      if (!data) {
        return res.status(400).json({ error: "Place not Listed" });
      }
  
      // Iterate over each top place in the array and push it to the offbeatPlaces array
      topPlaces.forEach((topPlace) => {
        const { name, img, detail } = topPlace;
        data.topPlaces.push({ name, img, detail });
      });
  
      await data.save();
      res.status(200).json({ data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
})
//@route        PUT /api/admin/blogs/:place
//@Description  Update and delete blog data from DB
//@Access       Public
router.put('/blogs/:place',authenticate, async (req, res) => {
  const { place } = req.params;
  const { topPlaces, offbeatPlaces } = req.body;

  try {
    // Find the blog document by its ID
    const blog = await Blog.findOne({place:place.toUpperCase()});

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Update the topPlaces and offbeatPlaces fields if provided
    if (topPlaces) {
      blog.topPlaces = topPlaces;
    }

    if (offbeatPlaces) {
      blog.offbeatPlaces = offbeatPlaces;
    }

    // Save the updated blog document
    await blog.save();

    return res.status(200).json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a blog document
router.delete('/blogs/:place',authenticate, async (req, res) => {
  const { place } = req.params;

  try {
    let blog = await Blog.findOne({place:place.toUpperCase()});

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog = await Blog.findOneAndDelete({place:place.toUpperCase()})
    await blog.save();

    return res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
//@route        GET /api/admin/get/blog/:place
//@Description  Get Data from DB about place
//@Access       Public
router.get('/blogs/:place',async(req,res)=>{
    try {
        const blog = await Blog.findOne({place:req.params.place.toUpperCase()})

        if(!blog){
            return res.status(400).json({error:"No listed Place"})
        }

        res.status(200).json({blog})
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server Error')        
    }
})

module.exports=router
