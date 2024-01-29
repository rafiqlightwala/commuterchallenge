// api.js
// Add Event
export async function addEvent(
    eventName,
    startingDate,
    endingDate,
    selectedCities,
    selectedCommuterModes
  ) {
    const apiEndpoint = "http://localhost:4000/v1/events";
  
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: JSON.stringify({
          name: eventName,
          startDate: startingDate,
          endDate: endingDate,
          cities: selectedCities,
          commuterModes: selectedCommuterModes,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const returnedData = await response.json();
  
      if (response.status !== 201) {
        // Handle non-201 status
        console.log(returnedData.message);
        return { error: returnedData };
      } else {
        return returnedData;
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }


export async function getCommuterModes() {
  const apiEndpoint = "http://localhost:4000/v1/utility/commutermodes";

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const returnedData = await response.json();
    return returnedData.commuterModes; // Assuming 'commuterModes' is the relevant part of the returned data
  } catch (error) {
    console.error("Fetch error:", error);
    //throw error; // Rethrow the error if you want to handle it outside
  }
}

// api.js

// Fetch Locations
export async function getLocations() {
  const apiEndpoint = "http://localhost:4000/v1/utility/locations";

  try {
    const response = await fetch(apiEndpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const returnedData = await response.json();
    return transformLocationData(returnedData); // Use the transform function to structure the data
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

const transformLocationData = (locationData) => {
  const countriesArr = [];
  const provincesArr = {};
  const citiesArr = {};

  locationData.countries.forEach((country) => {
    countriesArr.push(country.name);
    provincesArr[country.name] = [];

    country.provinces.forEach((province) => {
      provincesArr[country.name].push(province.name);
      citiesArr[province.name] = [];

      province.cities.forEach((city) => {
        citiesArr[province.name].push(city);
      });
    });
  });

  return {
    countriesArr,
    provincesArr,
    citiesArr,
  };
};
