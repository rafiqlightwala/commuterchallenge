document.addEventListener("DOMContentLoaded", function () {
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

  // Function to collect all selected checkboxes' values in a dropdown
  function getSelectedCheckboxValues(dropdownContentId) {
    const checkboxes = document.querySelectorAll(
      `#${dropdownContentId} input[type="checkbox"]:checked`
    );
    return Array.from(checkboxes).map((checkbox) => checkbox.value);
  }

  // Function to toggle all checkboxes in a dropdown
  function toggleAllCheckboxes(containerId, check) {
    const checkboxes = document.querySelectorAll(
      `#${containerId} input[type="checkbox"]:not([id^='selectAll'])`
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = check;
    });
  }

  // Event listeners for 'Select All' checkboxes
  document
    .getElementById("selectAllProvinces")
    .addEventListener("change", function () {
      toggleAllCheckboxes("provinceDropdown", this.checked);
    });

  document
    .getElementById("selectAllCities")
    .addEventListener("change", function () {
      toggleAllCheckboxes("cityDropdown", this.checked);
    });

  document
    .getElementById("selectAllModes")
    .addEventListener("change", function () {
      toggleAllCheckboxes("modeDropdown", this.checked);
    });

  // Function to filter cities based on selected provinces
  function filterCitiesBySelectedProvinces() {
    const selectedProvinces = getSelectedCheckboxValues("provinceDropdown");
    document.querySelectorAll(".City").forEach((cityElement) => {
      const cityProvince =
        cityElement.className.split(" ")[1] +
        (cityElement.className.split(" ")[2]
          ? " " + cityElement.className.split(" ")[2]
          : "");
      cityElement.style.display = selectedProvinces.includes(cityProvince)
        ? "block"
        : "none";
    });
  }

  // Attach change event listeners to province checkboxes to filter cities
  document
    .querySelectorAll('#provinceDropdown input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", filterCitiesBySelectedProvinces);
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
