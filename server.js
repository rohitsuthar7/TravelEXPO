const express = require('express')
const app = express();
const PORT =  5000 || process.env.PORT
const connectDB = require('./config/db');
const cors = require('cors');

//DB Connection
connectDB();

//application/json
app.use(express.json())
//application/x-www-form-urlencoded
app.use(express.urlencoded({extented:true}))
//Static files
app.use(express.static('./public'))
//cors means accepting multipart data from frontend 
app.use(cors())

//Defining Routes
app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/admin',require('./routes/api/amenities'))
app.use('/api/bookings',require('./routes/api/bookings'))
app.use('/api/profile',require('./routes/api/profile'))
app.use('/api/social',require('./routes/api/social'))

app.listen(PORT,(req,res)=>(
    console.log("SERVER LISTENING at PORT:",PORT)
))