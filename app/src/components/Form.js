import React, { useState, useEffect } from "react";
import "./Form.css";

function Form() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventData, setEventData] = useState(null);
  const [eventErrorData, setEventErrorData] = useState(null);

  // To show
  const [countriesArray, setCountriesArray] = useState([]);
  const [provincesArray, setProvincesArray] = useState({});
  const [citiesArray, setCitiesArray] = useState({});
  const [commuterModesArray, setCommuterModesArray] = useState([]);

  // Selected
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedCommuterModes, setSelectedCommuterModes] = useState([]);

  // Dropdown open/close state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);

  const getLocations = async () => {
    const response = await fetch("http://localhost:4000/v1/utility/locations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const returnedData = await response.json();

    const { countriesArr, provincesArr, citiesArr } =
      transformLocationData(returnedData);

    // Update the state variables
    setCountriesArray(countriesArr);
    setProvincesArray(provincesArr);
    setCitiesArray(citiesArr);
  };

  const getCommuterModes = async () => {
    const response = await fetch(
      "http://localhost:4000/v1/utility/commutermodes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const returnedData = await response.json();

    // Update the state variables
    setCommuterModesArray(returnedData.commuterModes);
  };

  const addEvent = async (
    eventName,
    startingDate,
    endingDate,
    selectedCities,
    selectedCommuterModes
  ) => {
    const response = await fetch("http://localhost:4000/v1/events", {
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
      setEventErrorData(returnedData);
      console.log(returnedData.message);
    } else {
      setEventData(returnedData);
    }

    // Reset form fields
    setEventName("");
    setStartDate("");
    setEndDate("");
    setSelectedCountry([]);
    setSelectedProvince([]);
    setSelectedCity([]);
    setSelectedCommuterModes([]);
    // Close dropdowns
    setIsCountryDropdownOpen(false);
    setIsProvinceDropdownOpen(false);
    setIsCityDropdownOpen(false);
    setIsModeDropdownOpen(false);
  };

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

  useEffect(() => {
    getLocations();
    getCommuterModes();
  }, []);

  const handleCreateEventClick = () => {
    setShowForm(true);
  };

  const clearUserMessages = () => {
    setEventData(null);
    setEventErrorData(null);
  };

  const handleCheckboxChange = (value, stateSetter) => {
    stateSetter((prevValues) =>
      prevValues.includes(value)
        ? prevValues.filter((prevValue) => prevValue !== value)
        : [...prevValues, value]
    );
  };

  const handleDropdownToggle = (dropdownState, setDropdownState) => {
    setDropdownState((prevState) => !prevState);
  };

  const handleDropdownClose = (setDropdownState) => {
    setDropdownState(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearUserMessages();
    addEvent(
      eventName,
      startDate,
      endDate,
      selectedCity,
      selectedCommuterModes
    );
  };

  return (
    <div className="Form">
      {!showForm ? (
        <button className="CreateEventButton" onClick={handleCreateEventClick}>
          Create Your Event
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
            <div className="DropdownContainer">
              <div
                className="DropdownHeader"
                onClick={() =>
                  handleDropdownToggle(
                    isCountryDropdownOpen,
                    setIsCountryDropdownOpen
                  )
                }
              >
                {selectedCountry.length > 0
                  ? `Selected (${selectedCountry.length})`
                  : "Select Country"}
              </div>
              {isCountryDropdownOpen && (
                <div className="DropdownContent">
                  {countriesArray.map((country, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        value={country}
                        checked={selectedCountry.includes(country)}
                        onChange={() =>
                          handleCheckboxChange(
                            country,
                            setSelectedCountry,
                            () => handleDropdownClose(setIsCountryDropdownOpen)
                          )
                        }
                      />
                      <label>{country}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
          <br />
          {selectedCountry.length > 0 && (
            <>
              <label>
                Province:
                <div className="DropdownContainer">
                  <div
                    className="DropdownHeader"
                    onClick={() =>
                      handleDropdownToggle(
                        isProvinceDropdownOpen,
                        setIsProvinceDropdownOpen
                      )
                    }
                  >
                    {selectedProvince.length > 0
                      ? `Selected (${selectedProvince.length})`
                      : "Select Province"}
                  </div>
                  {isProvinceDropdownOpen && (
                    <div className="DropdownContent">
                      {selectedCountry.map((country, index) => (
                        <div key={index}>
                          {provincesArray[country] &&
                            provincesArray[country].map((province, idx) => (
                              <div key={idx}>
                                <input
                                  type="checkbox"
                                  value={province}
                                  checked={selectedProvince.includes(province)}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      province,
                                      setSelectedProvince,
                                      () =>
                                        handleDropdownClose(
                                          setIsProvinceDropdownOpen
                                        )
                                    )
                                  }
                                />
                                <label>{province}</label>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <br />
              <label>
                City:
                <div className="DropdownContainer">
                  <div
                    className="DropdownHeader"
                    onClick={() =>
                      handleDropdownToggle(
                        isCityDropdownOpen,
                        setIsCityDropdownOpen
                      )
                    }
                  >
                    {selectedCity.length > 0
                      ? `Selected (${selectedCity.length})`
                      : "Select City"}
                  </div>
                  {isCityDropdownOpen && (
                    <div className="DropdownContent">
                      {selectedProvince.map((province, index) => (
                        <div key={index}>
                          {citiesArray[province] &&
                            citiesArray[province].map((city, idx) => (
                              <div key={idx}>
                                <input
                                  type="checkbox"
                                  value={city}
                                  checked={selectedCity.includes(city)}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      city,
                                      setSelectedCity,
                                      () =>
                                        handleDropdownClose(
                                          setIsCityDropdownOpen
                                        )
                                    )
                                  }
                                />
                                <label>{city}</label>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <br />
            </>
          )}
          <label>
            Mode:
            <div className="DropdownContainer">
              <div
                className="DropdownHeader"
                onClick={() =>
                  handleDropdownToggle(
                    isModeDropdownOpen,
                    setIsModeDropdownOpen
                  )
                }
              >
                {selectedCommuterModes.length > 0
                  ? `Selected (${selectedCommuterModes.length})`
                  : "Select Mode"}
              </div>
              {isModeDropdownOpen && (
                <div className="DropdownContent">
                  {commuterModesArray.map((mode, index) => (
                    <div key={index}>
                      <input
                        type="checkbox"
                        value={mode}
                        checked={selectedCommuterModes.includes(mode)}
                        onChange={() =>
                          handleCheckboxChange(
                            mode,
                            setSelectedCommuterModes,
                            () => handleDropdownClose(setIsModeDropdownOpen)
                          )
                        }
                      />
                      <label>{mode}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}

      {eventData && (
        <p>Your event with {eventData.eventDays} days has been created</p>
      )}
      {eventErrorData && <p>{eventErrorData.message}</p>}
    </div>
  );
}

export default Form;
