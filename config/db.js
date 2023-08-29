const mongoose = require('mongoose')
const config = require('config')
const db = config.get("mongoURI")

const connectDB = async() =>{
    try{
        await mongoose.connect(db,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
            connectTimeoutMS: 5000
        })

        console.log("Database Connected !")
    }catch(err){
        console.log(err.message);
        //Exit when failure
        process.exit(1)
    }
}

module.exports = connectDB