const httpStatus = require('http-status');
const Track = require('../models/track.model');
const ApiError = require('../utils/ApiError');

const createTrack = async (trackBody) => {
  const track = await Track.create(trackBody);
  return track;
};

const getTracksByUserAndEvent = async (userId, eventId) => {
  const tracks = await Track.find({ userId: userId, eventId: eventId })
    .sort('day'); // Sort by date in ascending order
  if (!tracks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No tracks found for this user and event');
  }
  return tracks;
};


module.exports = {
  createTrack,
  getTracksByUserAndEvent,
};
