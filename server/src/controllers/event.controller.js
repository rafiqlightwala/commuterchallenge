const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { eventService } = require('../services');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const config = require('../config/config')

cloudinary.config(config.cloudinaryconfig);

//console.log(cloudinary.config());

const createEvent = catchAsync(async (req, res) => {

  if (req.file) {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Add image URL to event body
    req.body.eventLogoUrl = result.secure_url;

    // Delete the image from local storage
    fs.unlinkSync(req.file.path);
  }

  const event = await eventService.createEvent(req.body);
  console.log(event)
  res.status(httpStatus.CREATED).send(event);
});

module.exports = {
  createEvent,
};
