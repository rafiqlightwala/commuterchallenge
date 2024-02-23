import {
  getCommuterModes,
  getLocations,
  addEvent,
  updateEvent,
} from "./api.js";

let isFormSubmitted = false;
let newEventId = "";

document.addEventListener("DOMContentLoaded", async function () {
  // DOM elements
  // const createEventButton = document.getElementById("createEventButton");
  const eventForm = document.getElementById("eventForm");
  const eventNameInput = document.getElementById("name");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const eventLogoInput = document.getElementById("eventLogo"); // Logo input
  //const confirmationMessage = document.getElementById("confirmationMessage");

  let provincesArr = [];
  let citiesArr = {};

  try {
    const locationData = await getLocations();
    console.log(locationData);
    provincesArr = locationData.provincesArr["Canada"];
    console.log(provincesArr);
    citiesArr = locationData.citiesArr;
    populateProvinces(provincesArr);
    populateCities(citiesArr, provincesArr);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }

  function populateProvinces(provinces) {
    const provincesSelect = document.getElementById("provinces");
    provincesSelect.innerHTML = ""; // Clear existing options

    // Optionally, add a 'Select All' option
    const selectAllOption = document.createElement("option");
    selectAllOption.value = "all";
    selectAllOption.textContent = "Select All";
    provincesSelect.appendChild(selectAllOption);

    provinces.forEach((province) => {
      const option = document.createElement("option");
      option.value = province; // Use province name as value, or an ID if you have one
      option.textContent = province; // Use province name as text
      provincesSelect.appendChild(option);
    });
  }

  function populateCities(citiesArr, selectedProvinces = []) {
    const citiesSelect = document.getElementById("cities");
    citiesSelect.innerHTML = ""; // Clear existing options

    const selectAllOption = document.createElement("option");
    selectAllOption.value = "all";
    selectAllOption.textContent = "Select All";
    citiesSelect.appendChild(selectAllOption);

    Object.entries(citiesArr).forEach(([province, cities]) => {
      // Check if selectedProvinces includes all or the specific province
      if (
        selectedProvinces.includes("all") ||
        selectedProvinces.includes(province)
      ) {
        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city; // Display city name
          citiesSelect.appendChild(option);
        });
      }
    });
  }

  const provincesSelect = document.getElementById("provinces");

  provincesSelect.addEventListener("change", () => {
    const selectedOptions = Array.from(provincesSelect.selectedOptions);
    const selectedProvinces = selectedOptions.map((option) => option.value);

    // Handle 'Select All' option
    if (selectedOptions.includes("all")) {
      populateCities(citiesArr); // Pass all cities if 'Select All' is selected
    } else {
      populateCities(citiesArr, selectedProvinces);
    }
  });

  // Fetch and populate commuter modes
  try {
    const commuterModesArray = await getCommuterModes();
    populateCommuterModes(commuterModesArray);
  } catch (error) {
    console.error("Error fetching commuter modes:", error);
  }

  function populateCommuterModes(modes) {
    const modesSelect = document.getElementById("commuterModes");
    modesSelect.innerHTML = ""; // Clear existing options

    // Optionally, add a 'Select All' option for modes
    const selectAllOption = document.createElement("option");
    selectAllOption.value = "all";
    selectAllOption.textContent = "Select All";
    modesSelect.appendChild(selectAllOption);

    modes.forEach((mode) => {
      const option = document.createElement("option");
      option.value = mode; // Assuming mode is a string that can be used as value
      option.textContent = mode; // The text to display for this mode
      modesSelect.appendChild(option);
    });
  }

  eventForm.addEventListener("submit", async function (event) {
    event.preventDefault();
  
    // Start the loading indicator
    document.getElementById("loadingIndicator").style.display = "flex";
  
    // Validate dates before proceeding
    if (!validateDates()) {
      showModal("Event end date cannot be before the start date.");
      document.getElementById("loadingIndicator").style.display = "none";
      return; // Stop form submission
    }
  
    const formData = new FormData(eventForm);
    formData.delete("provinces"); // Remove provinces from formData
    formData.append("eventLogo", eventLogoInput.files[0]);
  
    // Temporary arrays for cities and modes
    let tempCities = [];
    let tempModes = [];
  
    // Handle 'all' for cities
    const citiesSelect = document.getElementById("cities");
    if (Array.from(citiesSelect.selectedOptions).some(option => option.value === "all")) {
      formData.delete("cities"); // Remove current cities
      Array.from(citiesSelect.options).forEach(option => {
        if (option.value !== "all") {
          formData.append("cities[]", option.value); // Re-add each city
          tempCities.push(option.text); // Use option.text or option.value as needed
        }
      });
    } else {
      tempCities = Array.from(citiesSelect.selectedOptions).map(option => option.text); // Use option.text or option.value as needed
    }
  
    // Handle 'all' for commuterModes
    const modesSelect = document.getElementById("commuterModes");
    if (Array.from(modesSelect.selectedOptions).some(option => option.value === "all")) {
      formData.delete("commuterModes"); // Remove current modes
      Array.from(modesSelect.options).forEach(option => {
        if (option.value !== "all") {
          formData.append("commuterModes[]", option.value); // Re-add each mode
          tempModes.push(option.text); // Use option.text or option.value as needed
        }
      });
    } else {
      tempModes = Array.from(modesSelect.selectedOptions).map(option => option.text); // Use option.text or option.value as needed
    }
  
    let response;
    let actionVerb;
  
    try {
      if (!isFormSubmitted) {
        // Add the new event
        response = await addEvent(formData);
        actionVerb = 'Created';
        if (!response.error) {
          newEventId = response.id;
          document.querySelector('#eventForm button[type="submit"]').textContent = 'UPDATE EVENT';
          isFormSubmitted = true; // Set the flag to true since the event is now created
        }
      } else {
        // Update the existing event
        response = await updateEvent(newEventId, formData);
        actionVerb = 'Updated';
      }
  
      if (response.error) {
        showModal(response.message);
      } else {
        let successMessage = `
          <strong>📅 Event ${actionVerb} Successfully!</strong><br>
          <strong>Event Name:</strong> ${response.name}<br>
          <strong>Start Date:</strong> ${startDateInput.value}<br>
          <strong>End Date:</strong> ${endDateInput.value}<br>
          <strong>Total Days:</strong> ${response.eventDays}<br>
          <strong>Cities:</strong> ${tempCities.join(', ')}<br>
          <strong>Modes:</strong> ${tempModes.join(', ')}<br>
          <strong>Image Link:</strong> <a href="${response.eventLogoUrl}" target="_blank">Click to View Image</a>
        `;
        showModal(successMessage);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showModal("An error occurred during form submission.");
    } finally {
      document.getElementById("loadingIndicator").style.display = "none";
    }
  });
  

  // Validate start and end dates
  function validateDates() {
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    // Check if end date is before start date
    return endDate >= startDate;
  }

  // Example clearForm function to reset form after submission
  function clearForm() {
    eventForm.reset(); // Reset form fields to their default values
  }
});

function showModal(message) {
  const modal = document.getElementById("modal");
  const text = document.getElementById("modal-text");
  const closeButton = document.querySelector(".close-button");

  // Use innerHTML instead of textContent to render HTML tags properly
  text.innerHTML = message;
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