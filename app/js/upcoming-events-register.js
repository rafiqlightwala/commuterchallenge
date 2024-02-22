import { fetchEventData, registerUser } from "./api.js";
import { getTeams } from "./api.js";

let firstFormData = {};

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
        // Normalize phone number and postal code before saving form data
        const phoneNumberInput = document.getElementById("phoneNumber");
        phoneNumberInput.value = normalizePhoneNumber(phoneNumberInput.value);

        const postalCodeInput = document.getElementById("postalCode");
        postalCodeInput.value = normalizePostalCode(postalCodeInput.value); // Normalize postal code

        // Collect form data after normalization
        firstFormData = collectFormData(
          "#firstForm .user-input-box input, #firstForm .user-input-box select"
        );

        // Only transition to the second form if the first form is valid
        document.getElementById("firstForm").style.display = "none";
        document.getElementById("secondForm").style.display = "block";
      } else {
        // Validation failed, handled inside validateFirstForm
      }
    });

  // Event listener for the "Register" button in the second form
  document
    .querySelector('#secondForm .form-submit-btn2 input[type="submit"]')
    .addEventListener("click",  async function (event) {
      event.preventDefault(); // Prevent default submission
      if (validateSecondForm()) {
        // Collect data from the second form
        const secondFormData = collectFormData(
          "#secondForm .user-input-box2 input"
        );

        // Combine first and second form data
        const combinedFormData = { ...firstFormData, ...secondFormData, eventId };

        // Console log combined form data
        //console.log("Final form submission data:", combinedFormData);

        let returnedData = await registerUser(combinedFormData);
        if (!returnedData.error) {
          //console.log(returnedData)
          localStorage.setItem('userDetails', JSON.stringify(returnedData.user));
          localStorage.setItem('tokens', JSON.stringify(returnedData.tokens));
          showModal("Registration Successful. Please wait..");
          setTimeout(() => {
            window.location.href = 'logged-in-daily-tracking.html'; // Redirect to the specified page
          }, 1500); // Adjust the time as needed
        } else {
          showModal(returnedData.message)
        }

        
      }
    });

  document
    .getElementById("yearOfBirth")
    .addEventListener("input", function (e) {
      // Remove any characters that are not digits
      e.target.value = e.target.value.replace(/\D/g, "");

      // Limit the value to 4 digits
      if (e.target.value.length > 4) {
        e.target.value = e.target.value.slice(0, 4);
      }
    });

  document
    .getElementById("phoneNumber")
    .addEventListener("input", function (e) {
      var x = e.target.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    });

  document.getElementById("postalCode").addEventListener("input", function (e) {
    let value = e.target.value.toUpperCase(); // Ensure uppercase for consistency
    let formatted = "";

    // Remove all characters that don't match the allowed pattern
    value = value.replace(/[^A-Z0-9 ]/gi, "").replace(/\s+/g, "");

    // Loop through each character to enforce the 'A1A 1A1' pattern
    for (let i = 0; i < value.length && i < 6; i++) {
      if (i === 3) {
        // Automatically add a space after the 3rd character
        formatted += " ";
      }
      if (i % 2 === 0) {
        // Even index: letter expected
        formatted += value[i].replace(/[^A-Z]/gi, "");
      } else {
        // Odd index: number expected
        formatted += value[i].replace(/[^0-9]/g, "");
      }
    }

    e.target.value = formatted;
  });
});

// AFTER LOAD FUNCTIONS
// AFTER LOAD FUNCTIONS
// AFTER LOAD FUNCTIONS
// AFTER LOAD FUNCTIONS
// AFTER LOAD FUNCTIONS

function collectFormData(selector) {
  const inputs = document.querySelectorAll(selector);
  let formData = {};
  inputs.forEach((input) => {
    formData[input.name] = input.value;
  });
  return formData;
}

function normalizePhoneNumber(phoneNumber) {
  return phoneNumber.replace(/\D/g, "");
}

function normalizePostalCode(postalCode) {
  return postalCode.replace(/\s+/g, ""); // Removes all spaces
}

function validateFirstForm() {
  // First, validate all form fields to ensure they are not empty
  const allFieldsValid = validateFormFields(
    "#firstForm .user-input-box input, #firstForm .user-input-box select"
  );

  if (!allFieldsValid) {
    showModal("Please fill all fields.");
    return false; // Stop validation if any field is empty
  }

  // Additional validation for the Year of Birth
  const yearOfBirthInput = document.getElementById("yearOfBirth");
  const yearOfBirth = parseInt(yearOfBirthInput.value, 10);
  const currentYear = new Date().getFullYear();
  if (isNaN(yearOfBirth) || yearOfBirth < 1900 || yearOfBirth > currentYear) {
    showModal(
      "Please enter a valid Year of Birth between 1900 and " + currentYear + "."
    );
    return false; // Year of Birth is not valid
  }

  // Phone number validation
  const phoneNumberInput = document.getElementById("phoneNumber");
  const phoneNumber = phoneNumberInput.value;
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
  if (!phoneRegex.test(phoneNumber)) {
    showModal(
      "Please enter a valid phone number in the format (123) 456-7890."
    );
    return false; // Phone number is not valid
  }

  // Canadian postal code validation
  const postalCodeInput = document.getElementById("postalCode");
  const postalCode = postalCodeInput.value.toUpperCase(); // Convert to uppercase to match the expected format
  const postalCodeRegex = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;
  if (!postalCodeRegex.test(postalCode)) {
    showModal(
      "Please enter a valid Canadian postal code in the format 'ANA NAN'."
    );
    return false; // Postal code is not valid
  }

  // If we reach this point, it means all validations passed
  return true;
}

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex pattern
  return emailRegex.test(email);
}

// Validates fields in the second form
function validateSecondForm() {
  // Validate all input fields for non-empty values
  const allFieldsValid = validateFormFields(
    "#secondForm .user-input-box2 input"
  );
  if (!allFieldsValid) {
    showModal("Please fill all fields.");
    return false; // Stop validation if any field is empty
  }

  // Email validation
  const emailInput = document.getElementById("email");
  const email = emailInput.value;
  if (!isValidEmail(email)) {
    showModal("Please enter a valid email address.");
    return false; // Email is not valid
  }

  // Password validation for minimum length
  const passwordInput = document.getElementById("password");
  const password = passwordInput.value;
  if (password.length < 8) {
    showModal("Password must be at least 8 characters long.");
    return false; // Password does not meet length requirement
  }

  // Check if confirm password matches password
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmPassword = confirmPasswordInput.value;
  if (password !== confirmPassword) {
    showModal("Confirm Password does not match the Password.");
    return false; // Confirm Password does not match
  }

  // If all validations pass
  return true;
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
async function populateEventData(eventData) {
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

  // New: Populate the team select dropdown
  const teams = await getTeams(); // Fetch teams using the provided function
  const teamSelect = document.getElementById("team");
  // Clear existing options except the first 'Unaffiliated' option
  teamSelect.innerHTML = '';
  teams.forEach((team) => {
    const option = document.createElement("option");
    option.value = team; // Assuming 'team' is a string. Adjust if 'team' is an object
    option.textContent = team;
    teamSelect.appendChild(option);
  });
}

function showModal(message) {
  const modal = document.getElementById("modal");
  const text = document.getElementById("modal-text");
  const closeButton = document.querySelector(".close-button");

  text.textContent = message;
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




// Make sure to assign any functions you need to call from HTML as properties of window
//window.validateAndShowStep = validateAndShowStep;
//window.showStep = showStep;
//window.finalSubmit = finalSubmit;

// document
//   .querySelector('.form-submit-btn input[type="submit"]')
//   .addEventListener("click", function (event) {
//     event.preventDefault(); // Prevent form submission to stay on the same page
//     document.getElementById("firstForm").style.display = "none"; // Hide first form
//     document.getElementById("secondForm").style.display = "block"; // Show second form
//   });
