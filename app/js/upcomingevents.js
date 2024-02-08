document.addEventListener("DOMContentLoaded", function () {
  const canadaProvinces = ["Ontario", "Quebec", "Alberta", "British Columbia"];
  const canadaCities = {
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    Alberta: ["Calgary", "Edmonton", "Red Deer"],
    Quebec: ["Montreal", "Quebec City", "Laval"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
  };

  // Populate countries
  function populateCountries() {
    const countrySelect = document.getElementById("country");
    // Assuming Canada is the only option for now, directly add it
    const option = document.createElement("option");
    option.value = "Canada";
    option.textContent = "Canada";
    countrySelect.appendChild(option);

    populateProvinces("Canada"); // Automatically populate provinces for Canada
  }

  // Populate provinces based on the country selected
  function populateProvinces(country) {
    const provincesSelect = document.getElementById("province");
    provincesSelect.innerHTML = ""; // Clear current options

    canadaProvinces.forEach((province) => {
      const option = document.createElement("option");
      option.value = province;
      option.textContent = province;
      provincesSelect.appendChild(option);
    });

    // Automatically populate cities for the first province in the list
    populateCities(canadaProvinces[0]);
  }

  // Populate cities based on the province selected
  function populateCities(province) {
    const citiesSelect = document.getElementById("city");
    citiesSelect.innerHTML = ""; // Clear current options

    if (canadaCities[province]) {
      canadaCities[province].forEach((city) => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citiesSelect.appendChild(option);
      });
    }
  }

  // Event listeners for when selections change
  document.getElementById("country").addEventListener("change", function () {
    populateProvinces(this.value);
  });

  document.getElementById("province").addEventListener("change", function () {
    populateCities(this.value);
  });

  // Initialize the dropdowns on page load
  populateCountries();
});
