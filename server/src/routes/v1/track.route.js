const express = require('express');
const validate = require('../../middlewares/validate');
const trackController = require('../../controllers/track.controller');
const auth = require('../../middlewares/auth');
const trackValidation = require('../../validations/track.validation');

const router = express.Router();

router.post('/', auth(), validate(trackValidation.createTrack), trackController.createTrack);

router.get('/event/:eventId', auth(), trackController.getMyTracksForEvent);

router.get('/total-impact/:eventId', auth(), trackController.getTotalImpact);


module.exports = router;
