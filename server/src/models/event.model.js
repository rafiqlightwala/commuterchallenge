const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
//const { roles } = require('../config/roles');

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate(value) {
        if (this.startDate && value < this.startDate) {
          throw new ValidationError('End date must be on or after start date');
        }
      },
    },
    cities: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'City', 
      required: true,
    }],
    commuterModes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommuterMode',
    }],
    eventDays: {
      type: Number,
    },
    eventLogoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return validator.isURL(v);
        },
        message: 'Invalid URL format'
      }
    }
  },
  {
    timestamps: true,
  }
);

// Custom validation to ensure startDate is before or the same as endDate
eventSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.eventDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to count the starting day
  } else {
    this.eventDays = 0;
  }
  next();
});

// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);


/**
 * @typedef Event
 */
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
