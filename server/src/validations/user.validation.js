const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


// const createUser = {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().custom(password),
//     fullName: Joi.string().required(),
//     phoneNumber: Joi.string().required(),
//     mode: Joi.string().required(),
//     yearOfBirth: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
//     city: Joi.string().required(),
//     postalCode: Joi.string().required(), 
//     eventId: Joi.string().required().custom(objectId)
//   }),
// };

const createUser = {
  body: Joi.object().keys({
    fullName: Joi.string().required().trim(),
    email: Joi.string().required().email().lowercase().trim(),
    password: Joi.string().required().custom(password).trim(),
    role: Joi.string().valid('user', 'admin'),
    phoneNumber: Joi.string().trim().required(), 
    yearOfBirth: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    city: Joi.string().required(), 
    postalCode: Joi.string().trim().required(),
    mode: Joi.string().required(),
    events: Joi.array().items(Joi.string().custom(objectId)).single().required(), // To allow array of events or a single event
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
