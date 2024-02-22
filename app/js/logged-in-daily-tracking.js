
import { fetchEventData } from "./api.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Retrieve user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  // Update user name
  if (userDetails && userDetails.fullName) {
    document.querySelector('.user-name').textContent = userDetails.fullName;
  }

  // Update team name
  if (userDetails && userDetails.teamName) {
    document.querySelector('.user-organization').textContent = userDetails.teamName;
    document.querySelector('h2.track-commute-header').textContent = "Track your commute trips to " + userDetails.teamName;
  }

  // Update event name to the first one in the array
  if (userDetails && userDetails.eventNames && userDetails.eventNames.length > 0) {
    document.querySelector('h1.track-commute-header1').textContent = userDetails.eventNames[0];
  }

  // Setup logout functionality
  const logoutLink = document.querySelector('.logout-link');
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem('userDetails');
    localStorage.removeItem('tokens');
    // Redirect to home page or login page
    window.location.href = 'index.html';
  });

  const distanceInput = document.getElementById('distance');

  distanceInput.addEventListener('input', function(e) {
    // Regular expression to match the valid pattern
    const validPattern = /^\d*\.?\d{0,2}$/;
    
    // Check if current input value matches the valid pattern
    if (!validPattern.test(this.value)) {
      // If not, remove the last character entered
      this.value = this.value.slice(0, -1);
    }
  });

  const eventId = userDetails.events[0];
  if (eventId) {
    const eventData = await fetchEventData(eventId);
    if (eventData) {
      console.log(eventData)
      populateEventData(eventData);
    }
  }

});



// This function should already be receiving the eventData as an argument
function populateEventData(eventData) {
  // Select the day and mode dropdown elements
  const dayDropdown = document.getElementById('day-dropdown');
  const modeDropdown = document.getElementById('mode-dropdown');

  // Clear existing options in both dropdowns
  dayDropdown.innerHTML = '';
  modeDropdown.innerHTML = '';

  // Populate the day dropdown
  const startDate = new Date(eventData.startDate);
  const endDate = new Date(eventData.endDate);
  const totalDays = (endDate - startDate) / (1000 * 3600 * 24) + 1; // Calculate total days including both start and end

  for (let i = 0; i < totalDays; i++) {
    const dateOption = new Date(startDate.getTime() + i * (1000 * 3600 * 24)); // Increment day by day
    const option = document.createElement('option');
    option.value = dateOption.toISOString().split('T')[0]; // Use ISO string date format as value
    option.textContent = dateOption.toLocaleDateString(undefined, { // Format date to be more readable
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    dayDropdown.appendChild(option);
  }

  // Populate the mode dropdown
  eventData.commuterModes.forEach(mode => {
    const option = document.createElement('option');
    option.value = mode;
    option.textContent = mode;
    modeDropdown.appendChild(option);
  });
}

