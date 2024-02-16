export async function addEvent(formData) {
  const apiEndpoint = "http://localhost:4000/v1/events";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      body: formData,  // Directly use formData here, no JSON.stringify
      // Do not set Content-Type header when sending FormData
      // headers will be set automatically, including the correct 'boundary'
    });
    const returnedData = await response.json();

    if (response.status !== 201) {
      // Handle non-201 status
      returnedData.error = true;
      return returnedData;
    } else {
      returnedData.error = false;
      return returnedData;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    const returnedData = {error: true, message: "Some weird error happened"}
    return returnedData
  }
}

export async function updateEvent(eventId, formData) {
  const apiEndpoint = `http://localhost:4000/v1/events/${eventId}`;

  try {
    const response = await fetch(apiEndpoint, {
      method: "PUT", // or "PATCH" if you are partially updating the resource
      body: formData
    });
    const returnedData = await response.json();

    if (response.status !== 200) { // Typically, 200 is the success status for an update operation
      // Handle non-200 status
      returnedData.error = true;
      return returnedData;
    } else {
      returnedData.error = false;
      return returnedData;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    const returnedData = {error: true, message: "Some weird error happened"}
    return returnedData;
  }
}

export async function registerUser(userData) {
  const apiEndpoint = "http://localhost:4000/v1/auth/register";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set Content-Type header for JSON
      },
      body: JSON.stringify(userData), // Convert userData object to JSON string
    });
    const returnedData = await response.json();

    if (response.status !== 201) {
      // Handle non-201 status
      returnedData.error = true;
      return returnedData;
    } else {
      returnedData.error = false;
      return returnedData;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: true, message: "Some weird error happened" };
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

export async function getTeams() {
  const apiEndpoint = "http://localhost:4000/v1/utility/teams";

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
    return returnedData.teams; 
  } catch (error) {
    console.error("Fetch error:", error);
    //throw error; // Rethrow the error if you want to handle it outside
  }
}

export async function fetchEventData(eventId) {
  try {
    const response = await fetch(`http://localhost:4000/v1/events/${eventId}`);
    if (!response.ok) {
      throw new Error('Event not found');
    }
    const eventData = await response.json();
    return eventData;
  } catch (error) {
    console.error('Failed to fetch event data:', error);
    //alert('Failed to load event details.');
  }
}

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
