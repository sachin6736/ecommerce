const multer = require('multer');


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/Product_images'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // File naming convention
    }
});

const upload = multer({storage:storage});


module.exports = upload;