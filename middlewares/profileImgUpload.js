const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/profileImages');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+file.originalname);
  },
});

const profileImgUpload = multer({ storage });

module.exports= profileImgUpload