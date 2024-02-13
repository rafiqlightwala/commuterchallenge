import { fetchEventData } from "./api.js";


document.addEventListener("DOMContentLoaded", async () => {

  const eventId = getEventIdFromQueryString();
  if (eventId) {
    const eventData = await fetchEventData(eventId);
    if (eventData) {
      populateEventData(eventData);
    }
  }


  function validateAndShowStep(currentStepId, nextStepId) {
    var inputs = document.querySelectorAll(
      `#${currentStepId} input, #${currentStepId} select`
    );
    var allValid = true;
    inputs.forEach(function (input) {
      if (!input.value) {
        alert("Please fill all the fields.");
        allValid = false;
        return;
      }
    });

    if (allValid) {
      showStep(nextStepId);
    }
  }

  function showStep(stepId) {
    var steps = document.querySelectorAll("div[id^='step']");
    steps.forEach(function (step) {
      step.style.display = "none";
    });

    document.getElementById(stepId).style.display = "block";
  }

  function finalSubmit() {
    console.log("Final form submission goes here.");
    alert("Registration complete!");
    // Implement actual submission logic here
  }

  function getEventIdFromQueryString() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Assuming the query parameter is 'id'
  }

  function populateEventData(eventData) {
    // Populate the event name and date range
    document.querySelector('.form-title').textContent = 'REGISTRATION - ' + eventData.name;
    const eventDaysText = eventData.eventDays ? ` (${eventData.eventDays} days)` : '';
    document.querySelector('.form-date').textContent = `${eventData.startToEnd}${eventDaysText}`;  
    document.querySelector('.event-logo').src = eventData.eventLogoUrl;
  
    // Populate provinces in the province select box (if applicable)
    const provinceSelect = document.getElementById('province');
    provinceSelect.innerHTML = ''; // Clear existing options first
    Object.keys(eventData.cities).forEach(province => {
      const option = document.createElement('option');
      option.value = province;
      option.textContent = province;
      provinceSelect.appendChild(option);
    });
  
    // Update cities based on the selected province
    provinceSelect.addEventListener('change', function() {
      const selectedProvince = this.value;
      const citiesSelect = document.getElementById('city');
      citiesSelect.innerHTML = ''; // Clear existing options
      eventData.cities[selectedProvince].forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citiesSelect.appendChild(option);
      });
    });
  
    // Trigger change event to populate cities for the initially selected province
    provinceSelect.dispatchEvent(new Event('change'));
  
    // Populate commuter modes in the mode select box
    const modeSelect = document.getElementById('mode');
    modeSelect.innerHTML = ''; // Clear existing options first
    eventData.commuterModes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode;
      option.textContent = mode;
      modeSelect.appendChild(option);
    });
  }
  

  // Make sure to assign any functions you need to call from HTML as properties of window
  window.validateAndShowStep = validateAndShowStep;
  window.showStep = showStep;
  window.finalSubmit = finalSubmit;
});

document.querySelector('.form-submit-btn input[type="submit"]').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent form submission to stay on the same page
  document.getElementById('firstForm').style.display = 'none'; // Hide first form
  document.getElementById('secondForm').style.display = 'block'; // Show second form
});

