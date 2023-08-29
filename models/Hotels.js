const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  roomQty:{
    type: Number
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
      checkin:{
        type:Date
      },
      checkout:{
        type:Date
      },
      roomQty:{
        type:Number
      },
      nights:{
        type:Number
      },
      amount:{
        type:Number
      }
    }
  ]
});

hotelSchema.post('findOneAndUpdate', async function (doc) {
  const currentDate = new Date();
  const bookings = doc.bookings;

  for (const booking of bookings) {
    if (booking.checkout <= currentDate) {
      doc.roomQty += booking.roomQty;
    }
  }

  await doc.save();
});


const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
