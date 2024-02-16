import { fetchEventData } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const eventId = getEventIdFromQueryString();
  if (eventId) {
    const eventData = await fetchEventData(eventId);
    if (eventData) {
      populateEventData(eventData);
    }
  }

  // Event listener for the "Continue" button in the first form
  document
    .querySelector('#firstForm .form-submit-btn input[type="submit"]')
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default submission
      if (validateFirstForm()) {
        // Only transition to the second form if the first form is valid
        document.getElementById("firstForm").style.display = "none";
        document.getElementById("secondForm").style.display = "block";
      } else {
        // Alert user if the first form is not valid
        alert("Please fill all fields before continuing.");
      }
    });

  // Event listener for the "Register" button in the second form
  document
    .querySelector('#secondForm .form-submit-btn2 input[type="submit"]')
    .addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default submission
      if (validateSecondForm()) {
        // Proceed with form submission if the second form is valid
        alert("Registration complete!");
        console.log("Final form submission goes here.");
      } else {
        // Alert user if the second form is not valid
        alert("Please fill all fields before registering.");
      }
    });
});

// Validates fields in the first form
function validateFirstForm() {
  return validateFormFields(
    "#firstForm .user-input-box input, #firstForm .user-input-box select"
  );
}

// Validates fields in the second form
function validateSecondForm() {
  return validateFormFields("#secondForm .user-input-box2 input");
}

// Generic function to validate form fields
function validateFormFields(selector) {
  const inputs = document.querySelectorAll(selector);
  let allValid = true;
  inputs.forEach((input) => {
    if (!input.value.trim()) {
      allValid = false; // Mark as invalid if any field is empty
    }
  });
  return allValid;
}

// Placeholder function to get event ID from URL query string
function getEventIdFromQueryString() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Placeholder function to populate event data into the form
function populateEventData(eventData) {
  // Populate the event name and date range
  document.querySelector(".form-title").textContent =
    "REGISTRATION - " + eventData.name;
  const eventDaysText = eventData.eventDays
    ? ` (${eventData.eventDays} days)`
    : "";
  document.querySelector(
    ".form-date"
  ).textContent = `${eventData.startToEnd}${eventDaysText}`;
  document.querySelector(".event-logo").src = eventData.eventLogoUrl;

  // Populate provinces in the province select box (if applicable)
  const provinceSelect = document.getElementById("province");
  provinceSelect.innerHTML = ""; // Clear existing options first
  Object.keys(eventData.cities).forEach((province) => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });

  // Update cities based on the selected province
  provinceSelect.addEventListener("change", function () {
    const selectedProvince = this.value;
    const citiesSelect = document.getElementById("city");
    citiesSelect.innerHTML = ""; // Clear existing options
    eventData.cities[selectedProvince].forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citiesSelect.appendChild(option);
    });
  });

  // Trigger change event to populate cities for the initially selected province
  provinceSelect.dispatchEvent(new Event("change"));

  // Populate commuter modes in the mode select box
  const modeSelect = document.getElementById("mode");
  modeSelect.innerHTML = ""; // Clear existing options first
  eventData.commuterModes.forEach((mode) => {
    const option = document.createElement("option");
    option.value = mode;
    option.textContent = mode;
    modeSelect.appendChild(option);
  });
}

// Make sure to assign any functions you need to call from HTML as properties of window
window.validateAndShowStep = validateAndShowStep;
window.showStep = showStep;
window.finalSubmit = finalSubmit;

document
  .querySelector('.form-submit-btn input[type="submit"]')
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission to stay on the same page
    document.getElementById("firstForm").style.display = "none"; // Hide first form
    document.getElementById("secondForm").style.display = "block"; // Show second form
  });
