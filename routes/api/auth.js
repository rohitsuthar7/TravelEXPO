const express = require('express')
const router = express.Router()
const authenticate = require('../../middlewares/authenticate')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

//@route        GET /api/auth/
//@Description  Authentication of user with token
//@Access       Private
router.get('/',authenticate,async(req,res)=>{
    try{
        const user = await User.findById(req.userDetail.id).select('-password');
        
        res.status(200).json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route        GET /api/auth/
//@Description  Authentication of user with token
//@Access       Private
router.get('/admin',authenticate,async(req,res)=>{
    try{
        const user = await User.findById(req.userDetail.id).select('-password');

        if(!user.admin){
            return res.status(401).json({error:"Unauthenticated Access!"})
        }
        
        res.status(200).json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route        POST /api/auth/
//@Description  Login Route
//@Access       Public
router.post('/', async(req,res)=>{

    const { email, password }=req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{msg:"Invalid Credentials"}]});
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({errors: [{msg:"Invalid Credentials"}]});
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token) => {
                if(err) throw err;
                res.status(200).json({token});
            }
        )
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error!')
    }

})

module.exports=router