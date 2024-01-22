const express = require('express');
const utilityController = require('../../controllers/utility.controller');
const router = express.Router();

router
  .route('/locations')
  .get(utilityController.getLocations);

router
  .route('/commutermodes')
  .get(utilityController.getCommuterModes);

// Add more routes as needed for provinces and cities

module.exports = router;
