const mongoose = require('mongoose');

const commuterModeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const CommuterMode = mongoose.model('CommuterMode', commuterModeSchema);

module.exports = CommuterMode;
