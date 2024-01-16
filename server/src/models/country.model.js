const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');


const countrySchema = new mongoose.Schema({
    name: String,
    // other properties...
});

countrySchema.plugin(toJSON);


module.exports = mongoose.model('Country', countrySchema);
