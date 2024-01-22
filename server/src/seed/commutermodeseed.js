const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config/config');
const CommuterMode = require('../models/commuterMode.model'); // Ensure this path is correct

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const commuterModesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'commuterModesData.json'), 'utf-8'));

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function seedDatabase() {
  try {
    // Dropping the collection
    await CommuterMode.deleteMany({});
    console.log('Dropped existing commuterModes collection');

    // Seeding the commuter modes
    for (const modeName of commuterModesData) {
      await new CommuterMode({ name: modeName }).save();
    }

    console.log('Commuter modes seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
}
