const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
        place:{
            type: String,
            required: true
        },
        placeImg:{
            type: String,
            required: true
        },
        description:{
            type:String,
            required:true
        },
        topPlaces:[
            {
                name:{
                    type: String,
                    required: true
                },
                img:{
                    type: String,
                    required: true
                },
                detail:{
                    type:String,
                    required:true
                },
            }
        ],
        offbeatPlaces:[
            {
                name:{
                    type: String,
                    required: true
                },
                img:{
                    type: String,
                    required: true
                },
                detail:{
                    type:String,
                    required:true
                },
            }
        ],
        postedAt:{
            type: Date,
            default: Date.now
        }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
