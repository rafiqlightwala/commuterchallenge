const express = require('express');
const utilityController = require('../../controllers/utility.controller');
const router = express.Router();

router
  .route('/locations')
  .get(utilityController.getLocations);

router
  .route('/commutermodes')
  .get(utilityController.getCommuterModes);

  
router
  .route('/teams')
  .get(utilityController.getTeams); // Use the getTeams controller method

module.exports = router;
