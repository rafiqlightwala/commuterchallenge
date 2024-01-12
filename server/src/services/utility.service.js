const Country = require('../models/country.model');
const Province = require('../models/province.model');
const City = require('../models/city.model');

const getLocations = async () => {
  const countries = await Country.find();
  const formattedCountries = await Promise.all(countries.map(async (country) => {
    const provinces = await Province.find({ country: country._id });
    const formattedProvinces = await Promise.all(provinces.map(async (province) => {
      const cityDocuments = await City.find({ province: province._id }, 'name');
      const cities = cityDocuments.map(city => city.name);
      return { name: province.name, cities };
    }));
    return { 
      name: country.name, 
      provinces: formattedProvinces
    };
  }));

  return { countries: formattedCountries }; // Wrap the result in an object with a "countries" key
};

module.exports = {
  getLocations,
};
