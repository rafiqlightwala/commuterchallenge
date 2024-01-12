
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { utilityService } = require('../services');

const getLocations = catchAsync(async (req, res) => {
  const locations = await utilityService.getLocations();
  res.status(httpStatus.OK).send(locations);
});

module.exports = {
  getLocations,
};