const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    day: {
      type: Date,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Track = mongoose.model('Track', trackSchema);
module.exports = Track;
