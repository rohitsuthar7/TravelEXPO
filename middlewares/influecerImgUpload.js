const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/influencerImages');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+file.originalname);
  },
});

const influencerImgUpload = multer({ storage });

module.exports= influencerImgUpload