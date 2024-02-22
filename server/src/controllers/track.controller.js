const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { trackService } = require('../services');

const createTrack = catchAsync(async (req, res) => {
  console.log(req.user.id)
  const track = await trackService.createTrack({
    ...req.body,
    userId: req.user.id,
  });
  res.status(httpStatus.CREATED).send(track);
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
};
