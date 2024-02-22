const httpStatus = require('http-status');
const Track = require('../models/track.model');
const ApiError = require('../utils/ApiError');

const createTrack = async (trackBody) => {
  const track = await Track.create(trackBody);
  return track;
};

const getTracksByUserAndEvent = async (userId, eventId) => {
  const tracks = await Track.find({ userId: userId, eventId: eventId })
    .sort('day'); // Sort by date in ascending order
  if (!tracks) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No tracks found for this user and event');
  }
  return tracks;
};

// Function to calculate the impact based on the mode and distance
const calculateModeImpact = (mode, distance) => {
  const { calories, fuel, co2 } = IMPACT_FACTORS[mode] || IMPACT_FACTORS["Drive Alone"];
  return {
    caloriesBurned: distance * calories,
    fuelSaved: distance * fuel, // Absolute fuel savings compared to driving alone
    co2Avoided: distance * co2, // Absolute CO2 savings compared to driving alone
  };
};

const calculateTotalImpact = async (userId, eventId) => {
  const tracks = await Track.find({ userId: userId, eventId: eventId });

  let totalKilometers = 0;
  let totalCaloriesBurned = 0;
  let totalFuelSaved = 0;
  let totalCo2Avoided = 0;

  tracks.forEach(track => {
    const { caloriesBurned, fuelSaved, co2Avoided } = calculateModeImpact(track.mode, track.distance);
    totalKilometers += track.distance;
    totalCaloriesBurned += caloriesBurned;
    totalFuelSaved += fuelSaved;
    totalCo2Avoided += co2Avoided;
  });

  // Round fuel saved and CO2 avoided to 2 decimal places
  totalFuelSaved = +totalFuelSaved.toFixed(2);
  totalCo2Avoided = +totalCo2Avoided.toFixed(2);

  return { 
    totalKilometers, 
    caloriesBurned: totalCaloriesBurned, 
    fuelSaved: totalFuelSaved, 
    co2Avoided: totalCo2Avoided 
  };
};



const IMPACT_FACTORS = {
  "Drive Alone": {
    calories: 0,  // No calories burned
    fuel: 0,      // No fuel saved
    co2: 0,       // No CO2 saved
  },
  "Work from home": {
    calories: 100, // Estimated calories burned due to minor activities at home
    fuel: 1 / 8,   // Assuming 1 liter per 8 km saved by not driving
    co2: 0.2 / 8,  // Assuming 0.2 kg CO2 per 8 km saved by not driving
  },
  "Walk or Run": {
    calories: 50,  // 50 calories burned per km
    fuel: 1 / 8,   // 1 liter per 8 km saved
    co2: 0.2 / 8,  // 0.2 kg CO2 per 8 km saved
  },
  "Carpool (2 people)": {
    calories: 0,   // No significant calorie burn
    fuel: 1 / 16,  // Assumes fuel savings due to shared rides
    co2: 0.2 / 16, // Assumes CO2 savings due to shared rides
  },
  "Carpool (3 or more people)": {
    calories: 0,   // No significant calorie burn
    fuel: 1 / 24,  // Greater fuel savings due to more passengers
    co2: 0.2 / 24, // Greater CO2 savings due to more passengers
  },
  "Transit Bus or Train": {
    calories: 10,  // Minimal calorie burn due to walking to stops/stations
    fuel: 0.5 / 8, // Half the fuel savings compared to driving alone
    co2: 0.1 / 8,  // Half the CO2 savings compared to driving alone
  },
  "Scooter": {
    calories: 30,  // Moderate calorie burn
    fuel: 1 / 8,   // Assuming equivalent fuel savings to walking
    co2: 0.2 / 8,  // Assuming equivalent CO2 savings to walking
  },
  "Motorcycle": {
    calories: 0,   // No significant calorie burn
    fuel: 1 / 10,  // Slight fuel savings due to better fuel economy
    co2: 0.2 / 10, // Slight CO2 savings due to better fuel economy
  },
  "Car Share": {
    calories: 0,   // No significant calorie burn
    fuel: 1 / 12,  // Assumes some fuel savings due to shared use
    co2: 0.2 / 12, // Assumes some CO2 savings due to shared use
  },
  "Electric Vehicle": {
    calories: 0,   // No significant calorie burn
    fuel: 1 / 8,   // Equivalent fuel savings to not driving a gas vehicle
    co2: 0,        // Assumes zero emissions for electric
  },
  "Ski": {
    calories: 60,  // High calorie burn
    fuel: 1 / 8,   // Assuming equivalent fuel savings to walking
    co2: 0.2 / 8,  // Assuming equivalent CO2 savings to walking
  },
  "Skate": {
    calories: 40,  // Moderate calorie burn
    fuel: 1 / 8,   // Assuming equivalent fuel savings to walking
    co2: 0.2 / 8,  // Assuming equivalent CO2 savings to walking
  },
  "Snowshoe": {
    calories: 45,  // Moderate calorie burn
    fuel: 1 / 8,   // Assuming equivalent fuel savings to walking
    co2: 0.2 / 8,  // Assuming equivalent CO2 savings to walking
  },
  "Bike": {
    calories: 40,  // Moderate calorie burn
    fuel: 1 / 8,   // Significant fuel savings
    co2: 0.2 / 8,  // Significant CO2 savings
  },
  "Dog sled": {
    calories: 50,  // Significant calorie burn due to managing the sled
    fuel: 1 / 8,   // Assuming equivalent fuel savings to walking
    co2: 0.2 / 8,  // Assuming equivalent CO2 savings to walking
  },
  "Other": {
    calories: 10,  // Slight calorie burn on average
    fuel: 0.5 / 8,   // Assuming half fuel savings to walking
    co2: 0.1 / 8,  // Assuming half CO2 savings to walking
  },
}


module.exports = {
  createTrack,
  getTracksByUserAndEvent,
  calculateTotalImpact
};
