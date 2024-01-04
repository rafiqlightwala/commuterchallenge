const dateString = (value, helpers) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = {
  dateString,
};
