const multer = require('multer');
const filestorage=multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
        //const ext = file.originalname.split('.')[1];
        const ext =  file.mimetype.split('/')[1];
    cb(null, `admin-${file.fieldname}-${Date.now()}.${ext}`);
      //cb(null, uuidv4());
        //new Date().toISOString() + '-' + file.originalname);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  module.exports = multer({storage:filestorage,fileFilter:fileFilter}).single('image');