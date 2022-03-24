const multer = require('multer');
const uuid = require('uuid').v4;

const upload = multer({
  storage: multer.diskStorage({
    destination: 'product-data/images',
    filename: (req, file, callback) => {
      callback(null, uuid() + '-' + file.originalname);
    }
  })
});

const configuredMulterMiddleware = upload.single('product-image');

module.exports = configuredMulterMiddleware;
