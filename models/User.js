const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    contact:{
        type:Number
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    followers:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'USER'
            },
            username:{
                type:String
            }
        }
    ],
    following:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'USER'
            },
            username:{
                type:String
            }
        }
    ],
    admin:{
        type:Boolean
    }
})

const User = mongoose.model('USER',UserSchema)

module.exports = User; 