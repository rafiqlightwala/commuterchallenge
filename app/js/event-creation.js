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

  const countries = [
    "Canada",
    "United States"
  ]
  // Country, provinces, and cities data
  const canadaProvinces = [
    "Alberta",
    "Manitoba",
    //... other provinces
  ];
  const CanadaCities = {
    Alberta: ["Calgary", "Edmonton"],
    Manitoba: ["Winnipeg", "Brandon"]
    //... other cities for each province
  };

  // Populate countries
  function populateCountries() {
    const countryDropdown = document.getElementById("countryDropdown");
    countries.forEach((country) => {
      const div = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = country;
      checkbox.addEventListener("change", function() {
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
    if (country === "Canada") {
      provinceDropdown.style.display = isVisible ? "block" : "none";
    }
    // Add similar conditions if you have other countries with provinces.
  }
  

  // Populate provinces
  function populateProvinces() {
    const provinceDropdown = document.getElementById("provinceDropdown");
    provinceDropdown.style.display = "none"; 
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
      checkbox.addEventListener("change", filterCitiesBySelectedProvinces); // Added event listener
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
  filterCitiesBySelectedProvinces();

  // Function to setup select all functionality
  function setupSelectAllFunctionality(selectAllId, dropdownId) {
    const selectAllCheckbox = document.getElementById(selectAllId);
    selectAllCheckbox.addEventListener("click", function (event) {
      if (event.target !== this) return;

      const checkboxes = document.querySelectorAll(
        `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
      );
      checkboxes.forEach((checkbox) => (checkbox.checked = this.checked));

      if (dropdownId === "provinceDropdown") {
        filterCitiesBySelectedProvinces();
      }
    });

    const checkboxes = document.querySelectorAll(
      `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
    );
    checkboxes.forEach((checkbox) =>
      checkbox.addEventListener("change", updateSelectAllCheckbox)
    );

    function updateSelectAllCheckbox() {
      const allCheckboxes = document.querySelectorAll(
        `#${dropdownId} input[type="checkbox"]:not(#${selectAllId})`
      );
      const allChecked = Array.from(allCheckboxes).every((cb) => cb.checked);
      const selectAll = document.getElementById(selectAllId);
      selectAll.checked = allChecked;
    }
  }

  setupSelectAllFunctionality("selectAllProvinces", "provinceDropdown");
  setupSelectAllFunctionality("selectAllCities", "cityDropdown");

  // Function to filter cities based on selected provinces
function filterCitiesBySelectedProvinces() {
  const selectedProvinces = getSelectedCheckboxValues("provinceDropdown");
  const cityDropdown = document.getElementById("cityDropdown");
  const anyProvinceSelected = selectedProvinces.length > 0;
  
  // Show or hide the city dropdown based on whether any province is selected
  cityDropdown.style.display = anyProvinceSelected ? "block" : "none";

  document.querySelectorAll(".City").forEach((cityElement) => {
    let isCityDisplayed = false;
    selectedProvinces.forEach((province) => {
      if (cityElement.classList.contains(province)) {
        isCityDisplayed = true;
      }
    });
    cityElement.style.display = isCityDisplayed ? "block" : "none";
  });
}
  

  function getSelectedCheckboxValues(dropdownContentId) {
    const checkboxes = document.querySelectorAll(
      `#${dropdownContentId} input[type="checkbox"]:checked`
    );
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
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
    console.log(selectedCities)
    // Additional form data processing can be added here

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
