const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const citySchema = new mongoose.Schema({
    name: String,
    province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' }
    // other properties...
});

citySchema.plugin(toJSON);


module.exports = mongoose.model('City', citySchema);
