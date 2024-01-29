document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const createEventButton = document.getElementById("createEventButton");
  const eventForm = document.getElementById("eventForm");
  const eventNameInput = document.getElementById("eventName");
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const dateErrorMessage = document.getElementById("dateErrorMessage");
  const confirmationMessage = document.getElementById("confirmationMessage");

  // Toggle the display of the event form
  createEventButton.addEventListener("click", function () {
    eventForm.style.display = "block";
    createEventButton.style.display = "none";
  });

  // Country, provinces, and cities data
  const canadaProvinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];
  const CanadaCities = {
    Alberta: ["Calgary", "Edmonton", "Red Deer"],
    // ... add other provinces and cities here ...
  };

  // Populate countries
  function populateCountries() {
    const countryDropdown = document.getElementById("countryDropdown");
    const countries = ["Canada"]; // Add more countries if needed
    countries.forEach((country) => {
      const div = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = country;
      const label = document.createElement("label");
      label.textContent = country;
      div.appendChild(checkbox);
      div.appendChild(label);
      countryDropdown.appendChild(div);
    });
  }

  // Populate provinces
  function populateProvinces() {
    const provinceDropdown = document.getElementById("provinceDropdown");
    addSelectAllOption(
      provinceDropdown,
      "selectAllProvinces",
      "Select All Provinces"
    );

    canadaProvinces.forEach((province) => {
      const div = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = province;
      const label = document.createElement("label");
      label.textContent = province;
      div.appendChild(checkbox);
      div.appendChild(label);
      provinceDropdown.appendChild(div);
    });
  }

  // Populate cities
  function populateCities() {
    const cityDropdown = document.getElementById("cityDropdown");
    addSelectAllOption(cityDropdown, "selectAllCities", "Select All Cities");

    Object.keys(CanadaCities).forEach((province) => {
      CanadaCities[province].forEach((city) => {
        const div = document.createElement("div");
        div.classList.add("City", province);
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = city;
        const label = document.createElement("label");
        label.textContent = city;
        div.appendChild(checkbox);
        div.appendChild(label);
        cityDropdown.appendChild(div);
      });
    });
  }

  // Function to add Select All option
  function addSelectAllOption(dropdown, selectAllId, labelContent) {
    const selectAllDiv = document.createElement("div");
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.id = selectAllId;
    const selectAllLabel = document.createElement("label");
    selectAllLabel.textContent = labelContent;
    selectAllDiv.appendChild(selectAllCheckbox);
    selectAllDiv.appendChild(selectAllLabel);
    dropdown.appendChild(selectAllDiv);
  }

  populateCountries();
  populateProvinces();
  populateCities();

  // Attach event listeners to the select all checkboxes
  setupSelectAllFunctionality("selectAllProvinces", "provinceDropdown");
  setupSelectAllFunctionality("selectAllCities", "cityDropdown");

  // Function to setup select all functionality
  function setupSelectAllFunctionality(selectAllId, dropdownId) {
    const selectAllCheckbox = document.getElementById(selectAllId);
    selectAllCheckbox.addEventListener("change", function (event) {
      if (event.target === selectAllCheckbox) {
        const checkboxes = document.querySelectorAll(
          `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
        );
        checkboxes.forEach(
          (checkbox) => (checkbox.checked = selectAllCheckbox.checked)
        );
        if (dropdownId === "provinceDropdown") {
          filterCitiesBySelectedProvinces();
        }
      }
    });

    const checkboxes = document.querySelectorAll(
      `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        selectAllCheckbox.checked = areAllCheckboxesChecked(checkboxes);
        if (dropdownId === "provinceDropdown") {
          filterCitiesBySelectedProvinces();
        }
      });
    });
  }

  function areAllCheckboxesChecked(checkboxes) {
    return Array.from(checkboxes).every((cb) => cb.checked);
  }

  // Function to filter cities based on selected provinces
  function filterCitiesBySelectedProvinces() {
    const selectedProvinces = getSelectedCheckboxValues("provinceDropdown");
    document.querySelectorAll(".City").forEach((cityElement) => {
      const cityProvince = cityElement.className.split(" ")[1];
      cityElement.style.display = selectedProvinces.includes(cityProvince)
        ? "block"
        : "none";
    });
  }

  function attachProvinceCheckboxListeners() {
    document
      .querySelectorAll(
        '#provinceDropdown input[type="checkbox"]:not(#selectAllProvinces)'
      )
      .forEach((checkbox) => {
        checkbox.addEventListener("change", filterCitiesBySelectedProvinces);
      });
  }

  attachProvinceCheckboxListeners();

  // Function to collect all selected checkboxes' values in a dropdown
  function getSelectedCheckboxValues(dropdownContentId) {
    const checkboxes = document.querySelectorAll(
      `#${dropdownContentId} input[type="checkbox"]:checked`
    );
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
  }

  // Function to toggle dropdowns
  function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  }

  // Attach event listeners to dropdown headers
  document.querySelectorAll(".DropdownHeader").forEach((header) => {
    header.addEventListener("click", function () {
      const dropdownId = header.getAttribute("data-target");
      toggleDropdown(dropdownId);
    });
  });

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
  eventForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventName = eventNameInput.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!validateDates(startDate, endDate)) {
      dateErrorMessage.textContent =
        "End date cannot be before the start date.";
      return;
    }

    const selectedCountries = getSelectedCheckboxValues("countryDropdown");
    const selectedProvinces = getSelectedCheckboxValues("provinceDropdown");
    const selectedCities = getSelectedCheckboxValues("cityDropdown");
    const selectedModes = getSelectedCheckboxValues("modeDropdown");

    console.log("Event Name:", eventName);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Selected Countries:", selectedCountries);
    console.log("Selected Provinces:", selectedProvinces);
    console.log("Selected Cities:", selectedCities);
    console.log("Selected Modes:", selectedModes);

    confirmationMessage.textContent = `Your event '${eventName}' scheduled from ${startDate} to ${endDate} has been registered.`;
    confirmationMessage.style.color = "black";

    clearForm();
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
});
