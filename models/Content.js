const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
        user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'USER',
           required: true
        },
        name:{
            type: String,
            required: true
        },
        place:{
            type: String,
            required: true
        },
        type:{
            type: String,
            enum: ['video','image'],
            required: true
        },
        likes:[
            {
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'USER'
                }
            }
        ],
        postedAt:{
            type: Date,
            default: Date.now
        }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
