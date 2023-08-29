const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const config = require('config')
const profileImgUpload = require('../../middlewares/profileImgUpload')
const authenticate = require('../../middlewares/authenticate')
const Content = require('../../models/Content')

//@route        POST /api/users/register
//@Description  Registration of the user
//@Access       Public
router.post('/register',async(req,res)=>{

    const {name,email,username,password} = req.body;

    if(username.length<6 || password.length<6){
        return res.status(500).send('Invalid Details')
    }
    try{
        let user = await User.findOne({email})
        let user2 = await User.findOne({username})

        if(user){
            return res.status(400).json({msg: "User Already Exists!"})
        }
        if(user2){
            return res.status(400).json({msg: "Username already exists. Choose new one"})
        }
        //Creating Avatar
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        //Creating New User
        user = new User({
            name,
            email,
            username,
            avatar,
            password
        })

        //Encrypting Passwords
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        //Saving User .save() is promise so await
        await user.save()
        res.status(200).json({msg:"User Registered Successfully"})

        //Creating JWT token
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn:360000 },
            (err,token)=>{
                if(err) throw err
                res.json({token})
            }
        )

    }
    catch(err){
        console.log(err.message)
        res.status(500).send('Server Error')
    }
    
})

//@route        POST /api/users/check-username
//@Description  Checking for username available or not
//@Access       Public
router.post('/check-username',async(req,res)=>{
    const {username} = req.body;
    try{
        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({msg:"Username not available"})
        }
        res.status(200).json({json:"Success! Username available"})
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error');
    }
})

//@route        POST /api/users/update/profileG
//@desciption   Uploading user profile
//@Access       Private
router.post('/update/profile',[profileImgUpload.single('profile'),authenticate],async(req,res)=>{
    try {
        let user = await User.findOne({_id:req.userDetail.id})

        if(!user){
            return res.status(404).json({error:"User Not found"})
        }
        user.avatar = req.file.filename
        await user.save()

        res.status(200).json({user})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route        POST /api/users/find/:username
//@desciption   Find a user profile
//@Access       Private
router.get('/find/:username',authenticate,async(req,res)=>{
    const username = req.params.username

    try{
        const profile = await User.findOne({username});
        if(profile){
            const videoContent = await Content.find({user:profile._id,type:'video'})
            const imageContent = await Content.find({user:profile._id,type:'image'})
       
            if(!videoContent && !imageContent){
                return res.status(200).json({user:profile})
            }
            const user = {
                profile,
                uploads:{
                    videos:videoContent,
                    images:imageContent
                }
            }
            return res.status(200).json({user});
        }else{
            return res.status(404).json({error:"No User Found!"})
        }
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@route        POST /api/users/find/:username
//@desciption   Find a user profile
//@Access       Private
router.put('/add/follower',authenticate,async(req,res)=>{
    const { username } = req.body;
    try{
        const account = await User.findOne({username});
        if(account.followers.filter(follower=>follower.userId.toString() === req.userDetail.id.toString()).length > 0){
            return res.status(400).json({msg:"User already followed!"})
        }
        const userAccount = await User.findOne({_id:req.userDetail.id})

        if(account.username===userAccount.username){
            if(userAccount.following.filter((follow)=>follow.username===account.username).length >0 ){
                return res.status(400).json({error:"Can't do this"})
            }else{
                userAccount.following.unshift({userId:account._id,username:account.username});
                userAccount.followers.unshift({userId:account._id,username:account.username});
                await userAccount.save();
                return res.status(201).json(userAccount)
            }
        }

        account.followers.unshift({userId:req.userDetail.id,username:userAccount.username});
        userAccount.following.unshift({userId:account._id,username:account.username});

        await userAccount.save();
        await account.save();

        res.status(201).json({userAccount})

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports=router