const dateString = (value, helpers) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return helpers.message('Date must be in YYYY-MM-DD format.');
  }
  // Additional validation can be added here, e.g., to check if the date is valid
  return value;
};

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
  //   return helpers.message('password must contain at least 1 letter and 1 number');
  // }
  return value;
};


module.exports = {
  dateString,
  objectId,
  password
};
