const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'USER',
        required:true
    },
    hotelBookingDetails:[
        {
            place:{
                type:String
            },
            hotelid:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Hotel'
            },
            name:{
                type:String
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
    ],
    influencerTripBookings:[
        {
            place:{
                type:String
            },
            influecerId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Influencer'
            },
            name:{
                type:String
            },
            startDate:{
                type:Date
            },
            endDate:{
                type:Date
            },
            seats:{
                type:Number
            },
            amount:{
                type:Number
            }

        }
    ]
})

const Bookings = mongoose.model('Bookings', bookingSchema)

module.exports = Bookings