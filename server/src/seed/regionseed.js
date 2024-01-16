const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config/config');
const Country = require('../models/country.model');
const Province = require('../models/province.model');
const City = require('../models/city.model');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const countriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'countriesData.json'), 'utf-8'));

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function seedDatabase() {
  try {
    // Dropping the collections
    await Country.deleteMany({});
    await Province.deleteMany({});
    await City.deleteMany({});

    console.log('Dropped existing collections');
    
    for (const countryData of countriesData) {
      const country = await new Country({ name: countryData.name }).save();

      for (const provinceData of countryData.provinces) {
        const province = await new Province({ name: provinceData.name, country: country._id }).save();

        for (const cityName of provinceData.cities) {
          await new City({ name: cityName, province: province._id }).save();
        }
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}