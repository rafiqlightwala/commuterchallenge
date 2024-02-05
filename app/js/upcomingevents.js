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
  // Here you would validate the final step's input and then submit the form
  // For demonstration, we'll just log to the console and alert the user
  console.log("Final form submission goes here.");
  alert("Registration complete!");
}
