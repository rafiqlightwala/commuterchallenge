document.addEventListener("DOMContentLoaded", (event) => {
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

  // Make sure to assign any functions you need to call from HTML as properties of window
  window.validateAndShowStep = validateAndShowStep;
  window.showStep = showStep;
  window.finalSubmit = finalSubmit;
});
