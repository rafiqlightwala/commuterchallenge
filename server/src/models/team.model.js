const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

teamSchema.plugin(toJSON);

module.exports = mongoose.model('Team', teamSchema);;