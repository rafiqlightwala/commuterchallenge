import React, { useState, useEffect } from "react";
import "./Form.css";

function Form() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventData, setEventData] = useState(null);
  const [eventErrorData, setEventErrorData] = useState(null);

  //To show
  const [countriesArray, setCountriesArray] = useState([]);
  const [provincesArray, setProvincesArray] = useState({});
  const [citiesArray, setCitiesArray] = useState({});

  //Selected
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  // const countriesArray = ["Canada"]
  // const provincesArray = {
  //   Canada: ["Ontario", "Quebec", "Alberta", "British Columbia"]
  //   "United States": ["Florida", "Georgia"]
  // } // Add more provinces
  // const citiesArray = {
  //   Ontario: ["Toronto", "Ottawa", "Hamilton"],
  //   Alberta: ["Calgary", "Edmonton", "Red Deer"],
  //   Quebec: ["Montreal", "Quebec City", "Sherbrooke"],
  //   "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
  // }; // Add more cities for each province

  const modesOptions = [
    "Drive Alone",
    "Work from home",
    "Walk or Run",
    "Carpool (2 people)",
    "Carpool (3 or more people)",
    "Transit Bus or Train",
    "Scooter",
    "Motorcycle",
    "Car Share",
    "Electric Vehicle",
    "Ski",
    "Skate",
    "Snowshoe",
    "Bike",
    "Dog sled",
    "Other",
  ];

  const getLocations = async () => {
    const response = await fetch("http://localhost:4000/v1/utility/locations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("Response status code:", response.status);
    const returnedData = await response.json();

    console.log(returnedData);
    const { countriesArr, provincesArr, citiesArr } =
      transformLocationData(returnedData);

    // Update the state variables
    setCountriesArray(countriesArr);
    setProvincesArray(provincesArr);
    setCitiesArray(citiesArr);
  };

  const addEvent = async (
    eventName,
    startingDate,
    endingDate,
    selectedCities,
    selectedMode
  ) => {
    const response = await fetch("http://localhost:4000/v1/events", {
      method: "POST",
      body: JSON.stringify({
        name: eventName,
        startDate: startingDate,
        endDate: endingDate,
        cities: selectedCities,
        mode: selectedMode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("Response status code:", response.status);
    const returnedData = await response.json();

    if (response.status !== 201) {
      // Handle non-201 status
      setEventErrorData(returnedData);
      console.log(returnedData.message);
      // Optionally, you can throw an error or return early
      //throw new Error(`Request failed with status ${response.status}`);
    } else {
      setEventData(returnedData);
    }

    setEventName(""); // Reset eventName to an empty string
    setStartDate(""); // Reset startDate to an empty string
    setEndDate("");
    setSelectedCountry(""); // Reset selectedCountry to an empty string
    setSelectedProvince(""); // Reset selectedProvince to an empty string
    setSelectedCity(""); // Reset selectedCity to an empty string
    setSelectedMode("");

    //console.log(returnedData);
  };

  const transformLocationData = (locationData) => {
    const countriesArr = [];
    const provincesArr = {};
    const citiesArr = {};

    locationData.countries.forEach((country) => {
      // Add country name to countriesArray
      countriesArr.push(country.name);

      // Initialize provincesArray entry for this country
      provincesArr[country.name] = [];

      // Iterate over provinces of the country
      country.provinces.forEach((province) => {
        // Add province name to provincesArray under the country
        provincesArr[country.name].push(province.name);

        // Initialize citiesArray entry for this province
        citiesArr[province.name] = [];

        // Iterate over cities of the province
        province.cities.forEach((city) => {
          console.log(city);
          // Add city name to citiesArray under the province
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

  useEffect(() => {
    getLocations(); // Step 2: Call getLocations on component mount
  }, []);

  const handleCreateEventClick = () => {
    setShowForm(true);
  };

  const clearUserMessages = () => {
    setEventData(null);
    setEventErrorData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearUserMessages();
    const selectedCities = [selectedCity];
    addEvent(eventName, startDate, endDate, selectedCities, selectedMode);
    // Perform event submission logic here (you can add more validation if needed)
    // For this example, we'll just set the event as created
  };

  return (
    <div className="App">
      {!showForm ? (
        <button className="CreateEventButton" onClick={handleCreateEventClick}>
          Create an Event
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Event Name:
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Country:
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              required
            >
              <option value="">Select Country</option>
              {countriesArray &&
                countriesArray.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              {/* Add more countries if needed */}
            </select>
          </label>
          <br />
          {selectedCountry !== "" && (
            <>
              <label>
                Province:
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                >
                  <option value="">Select Province</option>
                  {selectedCountry &&
                    provincesArray[selectedCountry].map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                </select>
              </label>
              <br />
              <label>
                City:
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                >
                  <option value="">Select City</option>
                  {selectedProvince &&
                    citiesArray[selectedProvince].map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </label>
              <br />
              <label>
                Mode:
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  required
                >
                  <option value="">Select Mode</option>
                  {modesOptions.map((mode, index) => (
                    <option key={index} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
              <br />
            </>
          )}
          <button type="submit">Submit</button>
        </form>
      )}

      {eventData && (
        <p> Your event with {eventData.eventDays} days has been created</p>
      )}
      {eventErrorData && <p>{eventErrorData.message}</p>}
    </div>
  );
}

export default Form;
