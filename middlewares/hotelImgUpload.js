const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/hotelImages');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+file.originalname);
  },
});

const hotelImgUpload = multer({ storage });

module.exports= hotelImgUpload