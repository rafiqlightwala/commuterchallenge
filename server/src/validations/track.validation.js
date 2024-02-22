const Joi = require('joi');
const { objectId } = require('./custom.validation'); 

const createTrack = {
  body: Joi.object().keys({
    eventId: Joi.string().custom(objectId).required(),
    day: Joi.date().required(),
    mode: Joi.string().required(),
    distance: Joi.number().min(0).required(),
  }),
};


module.exports = {
  createTrack
};