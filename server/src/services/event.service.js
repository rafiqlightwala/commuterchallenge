const httpStatus = require("http-status");
const { Event, City, CommuterMode, Province } = require("../models"); // Ensure CommuterMode is imported
const ApiError = require("../utils/ApiError");

/**
 * Create an event
 * @param {Object} eventBody
 * @returns {Promise<Event>}
 */
const createEvent = async (eventBody) => {
  // Handle city names
  const cityNames = eventBody.cities || [];
  const uniqueCityNames = [...new Set(cityNames)];

  const cityDocuments = await Promise.all(
    uniqueCityNames.map(async (name) => {
      return City.findOne({ name: new RegExp("^" + name + "$", "i") });
    })
  );

  const validCityDocuments = cityDocuments.filter((doc) => doc != null);
  if (validCityDocuments.length !== uniqueCityNames.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more City names are invalid"
    );
  }
  const cityIds = validCityDocuments.map((city) => city._id);

  const escapeRegExp = (string) => {
    // Escaping special characters for use in a regular expression
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  };
  // Handle commuter mode names
  const commuterModeNames = eventBody.commuterModes || [];
  console.log(commuterModeNames);
  const uniqueCommuterModeNames = [...new Set(commuterModeNames)];

  const commuterModeDocuments = await Promise.all(
    uniqueCommuterModeNames.map(async (name) => {
      const escapedName = escapeRegExp(name); // Escape special characters for regex
      return CommuterMode.findOne({
        name: new RegExp("^" + escapedName + "$", "i"),
      });
    })
  );

  const validCommuterModeDocuments = commuterModeDocuments.filter(
    (doc) => doc != null
  );
  if (validCommuterModeDocuments.length !== uniqueCommuterModeNames.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more Commuter Modes are invalid"
    );
  }
  const commuterModeIds = validCommuterModeDocuments.map((mode) => mode._id);

  // Create the event with city and commuter mode IDs
  return Event.create({
    ...eventBody,
    cities: cityIds,
    commuterModes: commuterModeIds,
    eventLogoUrl: eventBody.eventLogoUrl, // Ensure your Event model supports this field
  });
};

const updateEvent = async (eventId, eventBody) => {
  // Handle city names
  const cityNames = eventBody.cities || [];
  const uniqueCityNames = [...new Set(cityNames)];

  const cityDocuments = await Promise.all(
    uniqueCityNames.map(async (name) => {
      return City.findOne({ name: new RegExp("^" + name + "$", "i") });
    })
  );

  const validCityDocuments = cityDocuments.filter((doc) => doc != null);
  if (validCityDocuments.length !== uniqueCityNames.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more City names are invalid"
    );
  }
  const cityIds = validCityDocuments.map((city) => city._id);

  const escapeRegExp = (string) => {
    // Escaping special characters for use in a regular expression
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  };
  // Handle commuter mode names
  const commuterModeNames = eventBody.commuterModes || [];
  console.log(commuterModeNames);
  const uniqueCommuterModeNames = [...new Set(commuterModeNames)];

  const commuterModeDocuments = await Promise.all(
    uniqueCommuterModeNames.map(async (name) => {
      const escapedName = escapeRegExp(name); // Escape special characters for regex
      return CommuterMode.findOne({
        name: new RegExp("^" + escapedName + "$", "i"),
      });
    })
  );

  const validCommuterModeDocuments = commuterModeDocuments.filter(
    (doc) => doc != null
  );
  if (validCommuterModeDocuments.length !== uniqueCommuterModeNames.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more Commuter Modes are invalid"
    );
  }
  const commuterModeIds = validCommuterModeDocuments.map((mode) => mode._id);

  // After preparing cityIds and commuterModeIds, update the event
  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      ...eventBody,
      cities: cityIds,
      commuterModes: commuterModeIds,
      eventLogoUrl: eventBody.eventLogoUrl,
    },
    { new: true } // Return the updated document
  );

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  return event;
};


const getEventDetailsById = async (eventId) => {
  // Fetch the event and populate cities with their provinces and commuter modes
  const event = await Event.findById(eventId)
    .populate({
      path: 'cities',
      select: 'name province',
      populate: {
        path: 'province',
        model: 'Province',
        select: 'name'
      }
    })
    .populate({
      path: 'commuterModes',
      select: 'name' // Only populate name for commuter modes
    })
    .exec();

  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
  }

  // Format cities under their provinces
  const citiesHierarchy = event.cities.reduce((acc, city) => {
    const provinceName = city.province.name;
    if (!acc[provinceName]) {
      acc[provinceName] = [];
    }
    acc[provinceName].push(city.name);
    return acc;
  }, {});

  // Convert commuter modes to an array of names
  const commuterModeNames = event.commuterModes.map(mode => mode.name);

  // Create a response object that includes the cities hierarchy and commuter mode names
  const responseObject = event.toObject(); // Convert Mongoose document to plain JavaScript object
  responseObject.cities = citiesHierarchy; // Replace cities array with the hierarchy
  responseObject.commuterModes = commuterModeNames; // Replace commuterModeIds with names
  responseObject.startToEnd = formatDateRange(event.startDate, event.endDate);


  return responseObject;
};


function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th'; // for numbers like 11th, 12th, 13th
  switch (day % 10) {
    case 1:  return 'st';
    case 2:  return 'nd';
    case 3:  return 'rd';
    default: return 'th';
  }
}

function formatDateRange(startDate, endDate) {
  // Parse the dates as UTC
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure the date is treated as UTC by setting the UTC hours to zero.
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(0, 0, 0, 0);

  // Convert to UTC time string and then to Date object to avoid timezone issues
  const startUTC = new Date(start.toUTCString());
  const endUTC = new Date(end.toUTCString());

  // Format the dates
  const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
  const startFormatted = startUTC.toLocaleDateString('en-CA', options);
  const endFormatted = endUTC.toLocaleDateString('en-CA', options);

  // Extract the day, month, and year
  const [startMonth, startDayNum, startYear] = startFormatted.replace(',', '').split(' ');
  const [endMonth, endDayNum, endYear] = endFormatted.replace(',', '').split(' ');

  // Add the day suffix
  const startDayWithSuffix = `${parseInt(startDayNum)}${getDaySuffix(parseInt(startDayNum))}`;
  const endDayWithSuffix = `${parseInt(endDayNum)}${getDaySuffix(parseInt(endDayNum))}`;

  // Construct the date range string
  if (startYear === endYear) {
    if (startMonth === endMonth) {
      return `${startMonth} ${startDayWithSuffix} - ${endDayWithSuffix}, ${startYear}`;
    } else {
      return `${startMonth} ${startDayWithSuffix} - ${endMonth} ${endDayWithSuffix}, ${startYear}`;
    }
  } else {
    return `${startMonth} ${startDayWithSuffix}, ${startYear} - ${endMonth} ${endDayWithSuffix}, ${endYear}`;
  }
}



module.exports = {
  createEvent,
  updateEvent,
  getEventDetailsById,
};