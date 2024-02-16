const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

// const register = {
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().custom(password),
//     name: Joi.string().required(),
//   }),
// };

const register = {
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
    eventId: Joi.string().required().custom(objectId),
    team: Joi.string().trim().required(),
  }).unknown(true),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
