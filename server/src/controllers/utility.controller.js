
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { utilityService } = require('../services');

const getLocations = catchAsync(async (req, res) => {
  const locations = await utilityService.getLocations();
  res.status(httpStatus.OK).send(locations);
});

const getCommuterModes = catchAsync(async (req, res) => {
  const commuterModes = await utilityService.getCommuterModes();
  res.status(httpStatus.OK).send(commuterModes);
});

const getTeams = catchAsync(async (req, res) => {
  const teams = await utilityService.getTeams();
  res.status(httpStatus.OK).send(teams);
});

module.exports = {
  getLocations,
  getCommuterModes,
  getTeams
};