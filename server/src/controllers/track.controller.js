const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { trackService } = require('../services');

const createTrack = catchAsync(async (req, res) => {
  const track = await trackService.createTrack({
    ...req.body,
    userId: req.user.id,
  });
  res.status(httpStatus.CREATED).send(track);
});

const getTotalImpact = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const totalImpact = await trackService.calculateTotalImpact(userId, eventId);
  res.status(httpStatus.OK).send(totalImpact);
});

const getMyTracksForEvent = catchAsync(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  const tracks = await trackService.getTracksByUserAndEvent(userId, eventId);
  res.send(tracks);
});

module.exports = {
  createTrack,
  getMyTracksForEvent,
  getTotalImpact,
};
