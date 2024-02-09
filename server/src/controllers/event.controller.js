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
    // Convert buffer to a readable stream, as Cloudinary requires a stream for uploads
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "commuter_events" }, // Optional: specify a folder in your Cloudinary account
      async (error, result) => {
        if (error) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error uploading file to Cloudinary');
        }

        // Add image URL to event body
        req.body.eventLogoUrl = result.secure_url;

        // Create the event in your database
        const event = await eventService.createEvent(req.body);
        console.log(event);
        res.status(httpStatus.CREATED).send(event);
      }
    );

    // Create a Readable stream from the buffer and pipe it to the Cloudinary upload stream
    const readableStream = require('stream').Readable.from(req.file.buffer);
    readableStream.pipe(uploadStream);
  } else {
    // Handle case where there's no file uploaded
    const event = await eventService.createEvent(req.body);
    console.log(event);
    res.status(httpStatus.CREATED).send(event);
  }
});


const updateEvent = catchAsync(async (req, res) => {
  const eventId = req.params.eventId; // Get the event ID from the URL parameters
  
  // The rest of the code is quite similar to createEvent
  if (req.file) {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "commuter_events" },
      async (error, result) => {
        if (error) {
          throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error uploading file to Cloudinary');
        }
        req.body.eventLogoUrl = result.secure_url;
        const event = await eventService.updateEvent(eventId, req.body);
        res.status(httpStatus.OK).send(event);
      }
    );
    const readableStream = require('stream').Readable.from(req.file.buffer);
    readableStream.pipe(uploadStream);
  } else {
    const event = await eventService.updateEvent(eventId, req.body);
    res.status(httpStatus.OK).send(event);
  }
});

const getEvent = catchAsync(async (req, res) => {
  const eventId = req.params.eventId;
  const eventWithCities = await eventService.getEventDetailsById(eventId);

  res.send(eventWithCities);
});


module.exports = {
  createEvent,
  updateEvent,
  getEvent
};
