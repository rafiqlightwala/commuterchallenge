const Joi = require('joi');
const { dateString } = require('./custom.validation');

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.string().custom(dateString).required(),
    endDate: Joi.string().custom(dateString).required(),
    cities: Joi.array().items(Joi.string().required()).required() 
  }),
};

module.exports = {
  createEvent
};
