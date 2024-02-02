const httpStatus = require("http-status");
const { Event, City, CommuterMode } = require("../models"); // Ensure CommuterMode is imported
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

module.exports = {
  createEvent,
  updateEvent,
};

// /**
//  * Query for users
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryUsers = async (filter, options) => {
//   const users = await User.paginate(filter, options);
//   return users;
// };

// /**
//  * Get user by id
//  * @param {ObjectId} id
//  * @returns {Promise<User>}
//  */
// const getUserById = async (id) => {
//   return User.findById(id);
// };

// /**
//  * Get user by email
//  * @param {string} email
//  * @returns {Promise<User>}
//  */
// const getUserByEmail = async (email) => {
//   return User.findOne({ email });
// };

// /**
//  * Update user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserById = async (userId, updateBody) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

// /**
//  * Delete user by id
//  * @param {ObjectId} userId
//  * @returns {Promise<User>}
//  */
// const deleteUserById = async (userId) => {
//   const user = await getUserById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   await user.remove();
//   return user;
// };
