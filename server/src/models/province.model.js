const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');


const provinceSchema = new mongoose.Schema({
    name: String,
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' }

    // other properties...
});

provinceSchema.plugin(toJSON);


module.exports = mongoose.model('Province', provinceSchema);
