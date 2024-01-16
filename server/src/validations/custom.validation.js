const dateString = (value, helpers) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return helpers.message('Date must be in YYYY-MM-DD format.');
  }
  // Additional validation can be added here, e.g., to check if the date is valid
  return value;
};

module.exports = {
  dateString,
};
