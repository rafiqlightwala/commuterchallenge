import {
  fetchEventData,
  addTrack,
  getTracksForEvent,
  getTotalImpact,
} from "./api.js";

const dayDropdown = document.getElementById("day-dropdown");
const modeDropdown = document.getElementById("mode-dropdown");
const distanceInput = document.getElementById("distance");
const logButton = document.getElementById("log-button");

document.addEventListener("DOMContentLoaded", async () => {
  // Retrieve user details from localStorage
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const userTokens = JSON.parse(localStorage.getItem("tokens"));

  // Update user name
  if (userDetails && userDetails.fullName) {
    document.querySelector(".user-name").textContent = userDetails.fullName;
  }

  // Update team name
  if (userDetails && userDetails.teamName) {
    document.querySelector(".user-organization").textContent =
      userDetails.teamName;
    // Check if the team name is 'Unaffiliated'
    if (userDetails.teamName === "Unaffiliated") {
      document.querySelector("h2.track-commute-header").textContent =
        "Track your daily commute trips";
    } else {
      document.querySelector("h2.track-commute-header").textContent =
        "Track your commute trips to " + userDetails.teamName;
    }
  }

  // Update event name to the first one in the array
  if (
    userDetails &&
    userDetails.eventNames &&
    userDetails.eventNames.length > 0
  ) {
    document.querySelector("h1.track-commute-header1").textContent =
      userDetails.eventNames[0];
  }

  // Setup logout functionality
  const logoutLink = document.querySelector(".logout-link");
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear localStorage
    localStorage.removeItem("userDetails");
    localStorage.removeItem("tokens");
    // Redirect to home page or login page
    window.location.href = "index.html";
  });

  const distanceInput = document.getElementById("distance");

  distanceInput.addEventListener("input", function (e) {
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
      populateEventData(eventData);
    }
    // Fetch and display the activity logs for the event
  }

  // Fetch and display the total impact for the event
  const totalImpactData = await getTotalImpact(
    eventId,
    userTokens.access.token
  );
  console.log(totalImpactData);
  if (totalImpactData && !totalImpactData.error) {
    updateTotalImpactAnimated(totalImpactData);
  } else {
    console.error(totalImpactData.message);
    // Handle the error, maybe show a message to the user
  }

  const tracksData = await getTracksForEvent(eventId, userTokens.access.token);
  if (tracksData && !tracksData.error) {
    populateActivityLog(tracksData);
  } else {
    console.error(tracksData.message);
    // Handle the error, maybe show a message to the user
  }
});

logButton.addEventListener("click", async () => {
  const distance = parseFloat(distanceInput.value);
  if (isNaN(distance) || distance <= 0) {
    showModal("Distance (km) input cannot be empty or zero");
    return;
  }

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const day = dayDropdown.value;
  const mode = modeDropdown.value;
  const trackData = {
    eventId: userDetails.events[0],
    day: day,
    mode: mode,
    distance: distance,
  };

  // Retrieve tokens from localStorage
  const tokens = JSON.parse(localStorage.getItem("tokens"));

  // Call addTrack function from your API module
  const response = await addTrack(trackData, tokens.access.token);
  if (!response.error) {
    // If track is added successfully
    console.log("Track added successfully:", response);

    // Format the date nicely using toLocaleDateString
    const formattedDate = new Date(day).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Determine the success message based on the mode
    let successMessage = `You did ${distance} km of ${mode} on ${formattedDate}<br>`;
    if (mode.toLowerCase() === "drive alone") {
      successMessage += `Try a more eco-friendly and healthier mode of transport next! 🚴🌱🏃‍♀️`;
    } else {
      successMessage += `Keep up the great work! 💪`;
    }

    showModal(successMessage);

    addTrackToActivityLog({
      day: day,
      mode: mode,
      distance: distance,
    });

    const updatedTotalImpactData = await getTotalImpact(
      userDetails.events[0],
      tokens.access.token
    );
    if (updatedTotalImpactData && !updatedTotalImpactData.error) {
      updateTotalImpactAnimated(updatedTotalImpactData);
    } else {
      console.error(updatedTotalImpactData.message);
      // Handle the error, maybe show a message to the user
    }

    // Optionally, clear the input fields or update the UI as needed
    distanceInput.value = "";
  } else {
    // If there is an error adding the track
    showModal(response.message);
  }
});

// This function should already be receiving the eventData as an argument
function populateEventData(eventData) {
  // Select the day and mode dropdown elements
  const dayDropdown = document.getElementById("day-dropdown");
  const modeDropdown = document.getElementById("mode-dropdown");

  // Clear existing options in both dropdowns
  dayDropdown.innerHTML = "";
  modeDropdown.innerHTML = "";

  // Populate the day dropdown
  const startDate = new Date(eventData.startDate);
  const endDate = new Date(eventData.endDate);
  const totalDays = (endDate - startDate) / (1000 * 3600 * 24) + 1; // Calculate total days including both start and end

  for (let i = 0; i < totalDays; i++) {
    const dateOption = new Date(startDate.getTime() + i * (1000 * 3600 * 24)); // Increment day by day
    const option = document.createElement("option");
    option.value = dateOption.toISOString().split("T")[0]; // Use ISO string date format as value
    option.textContent = dateOption.toLocaleDateString(undefined, {
      // Format date to be more readable
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    dayDropdown.appendChild(option);
  }

  // Populate the mode dropdown
  eventData.commuterModes.forEach((mode) => {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    modeDropdown.appendChild(option);
  });
}

function showModal(message) {
  const modal = document.getElementById("modal");
  const text = document.getElementById("modal-text");
  const closeButton = document.querySelector(".close-button");

  text.innerHTML = message; // Using innerHTML to set message allows you to use HTML tags within the message
  modal.style.display = "block";

  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//Function to populate the activity log on the page
function populateActivityLog(tracksData) {
  const activityLogContainer = document.querySelector(".activity-log-items");
  activityLogContainer.innerHTML = ""; // Clear any existing log entries

  tracksData.forEach((track) => {
    const logItem = document.createElement("div");
    logItem.className = "activity-log-item";
    logItem.innerHTML = `
      <div>${new Date(track.day).toLocaleDateString()}</div>
      <div>${track.mode}</div>
      <div>${track.distance}</div>
    `;
    activityLogContainer.appendChild(logItem);
  });
}

function addTrackToActivityLog(track) {
  const activityLogContainer = document.querySelector(".activity-log-items");
  const logItem = document.createElement("div");
  logItem.className = "activity-log-item";
  logItem.innerHTML = `
    <div>${new Date(track.day).toLocaleDateString()}</div>
    <div>${track.mode}</div>
    <div>${track.distance}</div>
  `;
  activityLogContainer.appendChild(logItem); // Append the new log item to the container
}

// function updateTotalImpact(totalImpact) {
//   // Assuming you have one .impact-item for each category and they are in order.
//   const impactItems = document.querySelectorAll(".impact-item .impact-value");
//   if (impactItems.length >= 4) {
//     impactItems[0].textContent = totalImpact.totalKilometers;
//     impactItems[1].textContent = totalImpact.caloriesBurned;
//     impactItems[2].textContent = totalImpact.fuelSaved;
//     impactItems[3].textContent = totalImpact.co2Avoided;
//   }
// }

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;

  const easeOutQuad = (t) => t * (2 - t); // Easing function for a nice effect

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easedProgress = easeOutQuad(progress); // Apply easing function to progress
    const value = easedProgress * (end - start) + start;

    obj.textContent = value.toFixed(1); // Update text content with eased value

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end.toFixed(1); // Ensure it ends on the exact value
    }
  };
  window.requestAnimationFrame(step);
}

function updateTotalImpactAnimated(totalImpact) {
  const impactItems = document.querySelectorAll(".impact-item .impact-value");
  if (impactItems.length >= 4) {
    // Set a duration between 1000 and 2000 milliseconds for the animation
    animateValue(impactItems[0], 0, totalImpact.totalKilometers, 1500);
    animateValue(impactItems[1], 0, totalImpact.caloriesBurned, 1500);
    animateValue(impactItems[2], 0, totalImpact.fuelSaved, 1500);
    animateValue(impactItems[3], 0, totalImpact.co2Avoided, 1500);
  }
}
