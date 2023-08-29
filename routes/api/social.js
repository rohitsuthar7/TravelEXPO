const express = require('express')
const authenticate = require('../../middlewares/authenticate')
const Content = require('../../models/Content')
const socialMediaUpload = require('../../middlewares/socialMediaUpload')
const User = require('../../models/User')
const router = express.Router()

//@route        POST /api/social/upload/content
//@desciption   upload social content with auth
//@Access       Private
router.post('/upload/content',[socialMediaUpload.single('content'),authenticate],async(req,res)=>{
    try{
        let { place }= req.body
        place=place.toUpperCase();
        const uploadContent = req.file.filename

        const checkType = uploadContent.split(".",2)[1]

        let user;
        
        if(checkType==="jpg"|| checkType==="png" || checkType==="jpeg" || checkType==="heic"){
            user = new Content({
                user: req.userDetail.id,
                type: 'image',
                name: uploadContent,
                place
            })
         }
        else if(checkType==="mp4" || checkType==="mkv" || checkType==="MOV"){
            user = new Content({
                user: req.userDetail.id,
                type:'video',
                name:uploadContent,
                place
            })
        }
        await user.save();
        res.status(200).json({message:"Uploaded Successfully",userContent:user})

    }catch(err){
        console.log(err.message)
        res.status(500).send("Server Error")
    }
})


//@route        GET /api/social/content
//@desciption   Getting all uploaded social content with auth
//@Access       Private
router.get('/content',authenticate, async(req, res) => {
    try {
      const videos = await Content.find({type:'video'}).sort({postedAt:-1});
      const images = await Content.find({type:'image'}).sort({postedAt:-1});

      if(!videos && !images){
        return res.status(404).json({error:"No uploads from any user found."})
      }
      res.status(200).json({videos,images});
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).send('Server Error')
    }
  });

//@route        GET /api/social/get/content?search=query
//@desciption   Getting all uploaded social content for place with Search Query
//@Access       Private
router.get('/get/content',authenticate,async(req,res)=>{
  try{
    const {search} = req.query;

    const videos = await Content.find({type:"video",place:search.toUpperCase()}).sort({postedAt:-1})
    const images = await Content.find({type:"image",place:search.toUpperCase()}).sort({postedAt:-1})

    if(!videos && !images){
      return res.status(404).json({error:"No uploads from any user found."})
    }
    res.status(201).json({videos,images});
  }catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route        GET /api/social/get/users?search=query
//@desciption   Getting all users with username query
//@Access       Private
router.get('/get/users',authenticate,async(req,res)=>{
  try{
    const {search} = req.query;

    const users = await User.find({ username: { $regex: search, $options: 'i' } });

    if(!users){
      return res.status(404).json({error:"No uploads from any user found."})
    }
    res.status(201).json({users});
  }catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route        GET /api/social/get/author/:user_id
//@desciption   Getting Post Author
//@Access       Private
router.get('/get/author/:user_id',async(req,res)=>{
  try{
    const user_id = req.params.user_id;
    const user = await User.findOne({_id:user_id});
    res.status(201).json({user});
  }catch(err){
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

//@route        GET /api/social/post/like
//@desciption   Like the Post
//@Access       Private
router.put('/post/like', authenticate, async (req, res) => {
  const { postId } = req.body;

  try {
    let post = await Content.findOne({ _id: postId });

    if(post.likes.filter(like=>like.userId.toString() === req.userDetail.id.toString()).length > 0){
        return res.status(400).json({msg:"Post already liked"})
    }

    post.likes.unshift({userId: req.userDetail.id})

    await post.save();
    res.status(201).json(post.likes);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route        PUT /api/social/post/unlike
//@desciption   Unlike the post
//@Access       Private
router.put('/post/unlike', authenticate, async (req, res) => {
  try {
    const { postId } = req.body;
    let post = await Content.findOne({_id: postId });

    if(post.likes.filter(like=>like.userId.toString() === req.userDetail.id).length === 0){
      return res.status(400).json({msg:"Post has not been liked or it is already unliked"})
    }

    const removeIndex = post.likes.map(like=>like.userId.toString()).indexOf(req.userDetail.id)

    post.likes.splice(removeIndex,1)

    await post.save();
    res.status(201).json({ post });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route        GET /api/social/post/status/:post_id
//@desciption   Getting Post Like status for logged in user
//@Access       Private
router.put('/post/status', authenticate, async (req, res) => {
  const {post_id} = req.body;
  try {
    let post = await Content.findOne({ _id: post_id });

    if (post) {
      if(post.likes.filter(like=>like.userId.toString() === req.userDetail.id.toString()).length > 0){
        res.set('Cache-Control', 'no-store'); // Disable caching
        return res.status(201).json({ likes: post.likes});
      } else {
        res.set('Cache-Control', 'no-store'); // Disable caching
        return res.status(200).json({ likes: post.likes});
      }
    }

    res.set('Cache-Control', 'no-store'); // Disable caching
    return res.status(404).json({ error: 'Post not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router