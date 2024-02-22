import { getCommuterModes, getLocations, addEvent, updateEvent } from "./api.js";

let isFormSubmitted = false;
let newEventId = ""

document.addEventListener("DOMContentLoaded", async function () {
  // DOM elements
  // const createEventButton = document.getElementById("createEventButton");
  const eventForm = document.getElementById("eventForm");
  const eventNameInput = document.getElementById("eventName");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const eventLogoInput = document.getElementById("eventLogo"); // Logo input
  const dateErrorMessage = document.getElementById("dateErrorMessage");
  const confirmationMessage = document.getElementById("confirmationMessage");

  // Toggle the display of the event form and smooth scroll
  //  createEventButton.addEventListener("click", function () {
  //   eventForm.style.display = "block";
  //   createEventButton.style.display = "none";
  //   document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
  // });

  // function openEventCreationForm() {
  //   eventForm.style.display = "block"; // Show the form
  //   createEventButton.style.display = "none"; // Optional: hide the button

  //   // Scroll to the form section
  //   document.querySelector('.form-section').scrollIntoView({
  //     behavior: 'smooth'
  //   });
  // }

  let countriesArr = [];
  let provincesArr = {};
  let citiesArr = {};

  try {
    const locationData = await getLocations();
    console.log(locationData);
    countriesArr = locationData.countriesArr;
    provincesArr = locationData.provincesArr;
    citiesArr = locationData.citiesArr;
    populateCountries(countriesArr); // Call this function to populate countries dropdown
  } catch (error) {
    console.error("Error fetching locations:", error);
  }

  // Populate countries
  function populateCountries(countries) {
    console.log(countries);
    const countryDropdown = document.getElementById("countryDropdown");
    countries.forEach((country) => {
      const div = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = country;
      checkbox.addEventListener("change", function () {
        toggleProvincesDisplay(this.value, this.checked);
      });
      const label = document.createElement("label");
      label.textContent = country;
      div.appendChild(checkbox);
      div.appendChild(label);
      countryDropdown.appendChild(div);
    });
  }

  function toggleProvincesDisplay(country, isVisible) {
    const provinceDropdown = document.getElementById("provinceDropdown");
    if (isVisible) {
      provinceDropdown.style.display = "block";
      populateProvinces(country); // Call this to populate provinces when a country is selected
    } else {
      provinceDropdown.style.display = "none";
    }
  }

  function populateProvinces(country) {
    const provinceDropdown = document.getElementById("provinceDropdown");
    provinceDropdown.innerHTML = ""; // Clear existing options
    provinceDropdown.style.display = "block"; // Show the dropdown

    // Add 'Select All' option
    addSelectAllOption(
      provinceDropdown,
      "selectAllProvinces",
      "Select All Provinces"
    );

    if (provincesArr[country]) {
      // Ensure the country has provinces
      provincesArr[country].forEach((province) => {
        const div = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = province;
        checkbox.addEventListener("change", filterCitiesBySelectedProvinces); // Added event listener
        const label = document.createElement("label");
        label.textContent = province;
        div.appendChild(checkbox);
        div.appendChild(label);
        provinceDropdown.appendChild(div);
      });
    }

    setupSelectAllFunctionality("selectAllProvinces", "provinceDropdown"); // Setup select all functionality
  }

  // Function to filter cities based on selected provinces
  function filterCitiesBySelectedProvinces() {
    const selectedProvinces = getSelectedCheckboxValues("provinceDropdown");
    const cityDropdown = document.getElementById("cityDropdown");
    const anyProvinceSelected = selectedProvinces.length > 0;

    cityDropdown.innerHTML = ""; // Clear the cities dropdown only once here
    if (anyProvinceSelected) {
      // Add 'Select All' option if any province is selected, only once here
      addSelectAllOption(cityDropdown, "selectAllCities", "Select All Cities");

      selectedProvinces.forEach((province) => {
        populateCities(province); // Call this to populate cities when a province is selected
      });

      setupSelectAllFunctionality("selectAllCities", "cityDropdown"); // Setup select all functionality for cities
    } else {
      //cityDropdown.style.display = "none"; // Hide the dropdown if no province is selected
    }
  }

  // Populate cities
  function populateCities(province) {
    const cityDropdown = document.getElementById("cityDropdown");

    if (citiesArr[province]) {
      // Ensure the province has cities
      citiesArr[province].forEach((city) => {
        const div = document.createElement("div");
        div.classList.add("City");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = city;
        const label = document.createElement("label");
        label.textContent = city;
        div.appendChild(checkbox);
        div.appendChild(label);
        cityDropdown.appendChild(div);
      });
    }
  }

  // Function to add Select All option
  function addSelectAllOption(dropdown, selectAllId, labelContent) {
    const selectAllDiv = document.createElement("div");
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.id = selectAllId;
    selectAllCheckbox.value = "selectAll"; // Set a value for 'Select All'
    const selectAllLabel = document.createElement("label");
    selectAllLabel.textContent = labelContent;
    selectAllDiv.appendChild(selectAllCheckbox);
    selectAllDiv.appendChild(selectAllLabel);
    dropdown.appendChild(selectAllDiv);
  }

  //populateCountries();
  //populateProvinces();
  //populateCities();
  //filterCitiesBySelectedProvinces();

  try {
    const commuterModesArray = await getCommuterModes();
    populateCommuterModes(commuterModesArray);
  } catch (error) {
    console.error("Error fetching commuter modes:", error);
  }

  // Function to setup select all functionality
  function setupSelectAllFunctionality(selectAllId, dropdownId) {
    const selectAllCheckbox = document.getElementById(selectAllId);

    // Attach the event listener to the 'Select All' checkbox only
    selectAllCheckbox.addEventListener("change", function () {
      // Check if the 'Select All' checkbox is the one that fired the event
      if (selectAllCheckbox.checked) {
        const checkboxes = document.querySelectorAll(
          `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
        );
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
      } else {
        const checkboxes = document.querySelectorAll(
          `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
        );
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }

      if (dropdownId === "provinceDropdown") {
        filterCitiesBySelectedProvinces();
      }
    });

    // Set up individual checkboxes to update 'Select All' checkbox state
    const checkboxes = document.querySelectorAll(
      `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
    );
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", function () {
        const allCheckboxes = document.querySelectorAll(
          `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
        );
        const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
        const anyChecked = Array.from(allCheckboxes).some((cb) => cb.checked);

        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = anyChecked && !allChecked;
      })
    );
  }

  function getSelectedCheckboxValues(dropdownContentId) {
    const checkboxes = document.querySelectorAll(
      `#${dropdownContentId} input[type="checkbox"]:checked`
    );
    // Filter out the 'Select All' value
    return Array.from(checkboxes)
      .filter((checkbox) => checkbox.value !== "selectAll")
      .map((checkbox) => checkbox.value);
  }

  // Function to validate date inputs
  function validateDates(startDate, endDate) {
    return new Date(startDate) <= new Date(endDate);
  }

  // Function to check date validity and display error
  function checkDateValidity() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (startDate && endDate && !validateDates(startDate, endDate)) {
      dateErrorMessage.textContent =
        "End date cannot be before the start date.";
    } else {
      dateErrorMessage.textContent = "";
    }
  }

  // Attach event listeners to date inputs for immediate validation
  startDateInput.addEventListener("change", checkDateValidity);
  endDateInput.addEventListener("change", checkDateValidity);

  // Handling form submission
  eventForm.addEventListener('submit', async function (event) {
    event.preventDefault();
  
    document.getElementById('loadingIndicator').style.display = 'flex';
    // Create a FormData object and append data
    const formData = new FormData();
    formData.append("name", eventNameInput.value);
    formData.append("startDate", startDateInput.value);
    formData.append("endDate", endDateInput.value);
    formData.append("eventLogo", eventLogoInput.files[0]); // Append the file
  
    // Get selected cities and commuter modes as arrays
    const selectedCities = getSelectedCheckboxValues("cityDropdown");
    const selectedModes = getSelectedCheckboxValues("modeDropdown");
  
    // Append arrays to FormData
    selectedCities.forEach((city) => formData.append("cities[]", city)); // Modified to handle array of values
    selectedModes.forEach((mode) => formData.append("commuterModes[]", mode)); // Modified to handle array of values
  
    if (!validateDates(startDateInput.value, endDateInput.value)) {
      dateErrorMessage.textContent = "End date cannot be before the start date.";
      return;
    }
  
    let returnedData;
    if (!isFormSubmitted) {
      returnedData = await addEvent(formData);
      if (!returnedData.error) {
        newEventId = returnedData.id
        document.querySelector('#eventForm button[type="submit"]').textContent = 'UPDATE EVENT';
      }
    } else {
      returnedData = await updateEvent(newEventId, formData);
    }
  
    if (returnedData.error) {
      confirmationMessage.textContent = returnedData.message;
      confirmationMessage.style.color = "red";
    } else {
      const actionVerb = isFormSubmitted ? 'Updated' : 'Created'; 
      isFormSubmitted = true;
      confirmationMessage.innerHTML = `
        <strong>📅 Event ${actionVerb} Successfully!</strong><br>
        <strong>Event Name:</strong> ${returnedData.name}<br>
        <strong>Start Date:</strong> ${startDateInput.value}<br>
        <strong>End Date:</strong> ${endDateInput.value}<br>
        <strong>Total Days:</strong> ${returnedData.eventDays}<br>
        <strong>Cities:</strong> ${selectedCities.join(', ')}<br> <!-- Ensure arrays are joined into a string -->
        <strong>Modes:</strong> ${selectedModes.join(', ')}<br> <!-- Ensure arrays are joined into a string -->
        <strong>Image Link:</strong> <a href="${returnedData.eventLogoUrl}" target="_blank">Click to View Image</a>
      `;
      confirmationMessage.style.color = "green";
    }
    document.getElementById('loadingIndicator').style.display = 'none';
    //clearForm(); // Uncomment if you want to clear the form after submission
  });
  

  // Function to clear all inputs and checkboxes in the form
  function clearForm() {
    eventNameInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    document
      .querySelectorAll('#eventForm input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = false;
      });
    filterCitiesBySelectedProvinces(); // Reset city filter
  }

  function populateCommuterModes(modes) {
    const modeDropdown = document.getElementById("modeDropdown"); // Ensure you have this element in your HTML

    modes.forEach((mode) => {
      const div = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = mode;
      const label = document.createElement("label");
      label.textContent = mode;
      div.appendChild(checkbox);
      div.appendChild(label);
      modeDropdown.appendChild(div);
    });
  }
  

});

document.addEventListener('DOMContentLoaded', function () {
  const provincesSelect = document.getElementById('provinces');
  const provinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];
  
  provinces.forEach(province => {
      const option = document.createElement('option');
      option.value = province;
      option.textContent = province;
      provincesSelect.appendChild(option);
  });
});

