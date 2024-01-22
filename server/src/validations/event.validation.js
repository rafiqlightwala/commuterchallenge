const Joi = require('joi');
const { dateString } = require('./custom.validation');

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.string().custom(dateString).required(),
    endDate: Joi.string().custom(dateString).required(),
    cities: Joi.array().items(Joi.string().required()).required(),
    commuterModes: Joi.array().items(Joi.string().required()).optional(),
  }).custom((object, helpers) => {
    // Ensure endDate is not before startDate
    if (new Date(object.endDate) < new Date(object.startDate)) {
      return helpers.message('End date must be on or after the start date');
    }
    return object; // Return the object if validation passes
  }, 'custom end date validation')
};

module.exports = {
  createEvent
};
