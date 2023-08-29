const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  seats:{
    type: Number
  },
  tripDates:{
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      }
  },
  place: {
    type: String,
    required: true
  },
  bookings:[
    {
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USER'
      },
      seats:{
        type:Number
      },
      amount:{
        type:Number
      }
    }
  ]
});

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
