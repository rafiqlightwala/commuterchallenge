const Joi = require('joi');
const { dateString } = require('./custom.validation');

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    to: Joi.string().custom(dateString).required(),
    from: Joi.string().custom(dateString).required(),
  }),
};

module.exports = {
  createEvent
};
