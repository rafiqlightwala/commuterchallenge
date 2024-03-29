const express = require('express');
//const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const eventValidation = require('../../validations/event.validation');
const eventController = require('../../controllers/event.controller');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.memoryStorage()

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

const uploadMiddleware = upload.single('eventLogo');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post(
  '/',
  uploadMiddleware,  // Use the middleware here
  (req, res, next) => {
    // Convert cities and commuterModes from multiple entries to arrays
    req.body.cities = Array.isArray(req.body.cities) ? req.body.cities : [req.body.cities].filter(Boolean);
    req.body.commuterModes = Array.isArray(req.body.commuterModes) ? req.body.commuterModes : [req.body.commuterModes].filter(Boolean);
    
    next(); // Proceed to the next middleware
  },
  validate(eventValidation.createEvent),
  eventController.createEvent
);


router.put(
  '/:eventId',
  uploadMiddleware,  // Use the same middleware for file upload
  (req, res, next) => {
    // The same middleware logic for handling cities and commuterModes
    req.body.cities = Array.isArray(req.body.cities) ? req.body.cities : [req.body.cities].filter(Boolean);
    req.body.commuterModes = Array.isArray(req.body.commuterModes) ? req.body.commuterModes : [req.body.commuterModes].filter(Boolean);
    
    next(); // Proceed to the next middleware
  },
  validate(eventValidation.updateEvent), // Make sure you have corresponding validation for updating an event
  eventController.updateEvent // You will define this in event.controller.js
);


// Assuming eventController.getEvent is the function that handles fetching an event by ID
router.get('/:eventId', eventController.getEvent);


module.exports = router;