const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const config = require('../config/config');
const Team = require('../models/team.model'); // Adjust the path as necessary

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const workplacesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'teamsData.json'), 'utf-8'));

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function seedDatabase() {
  try {
    // Optionally, drop the Team collection to start fresh
    await Team.deleteMany({});
    console.log('Dropped existing Team collection');

    // Inserting new Teams from the workplacesData
    for (const teamName of workplacesData) {
      await new Team({ name: teamName }).save();
    }

    console.log('Teams seeded successfully');
  } catch (error) {
    console.error('Error seeding teams:', error);
  } finally {
    mongoose.disconnect();
  }
}
