const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/socialMedia');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now()+file.originalname);
  },
});

const socialMediaUpload = multer({ storage });

module.exports= socialMediaUpload