import React, { useState } from "react";
import "./App.css"; // Import the CSS file

const CommuterChallenge = () => {
  const [selectedCountry, setSelectedCountry] = useState("Canada");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantName, setParticipantName] = useState("");
  const [participantCompany, setParticipantCompany] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const countries = [
    {
      name: "Canada",
      provinces: [
        {
          name: "Alberta",
          cities: [
            "Calgary",
            "Edmonton",
            "Red Deer" /* Add more Alberta cities here */,
          ],
        },
        // ... (other provinces and cities in Canada)
      ],
    },
    // Add more countries and their provinces/cities as needed
  ];

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedProvince("");
    setSelectedCity("");
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleAddParticipant = () => {
    if (participantName.trim() !== "" && participantCompany.trim() !== "") {
      const newParticipant = {
        name: participantName,
        company: participantCompany,
      };
      setParticipants([...participants, newParticipant]);
      setParticipantName("");
      setParticipantCompany("");
    }
  };

  const provincesOptions = countries
    .find((country) => country.name === selectedCountry)
    ?.provinces.map((province) => (
      <option key={province.name} value={province.name}>
        {province.name}
      </option>
    ));

  const citiesOptions = countries
    .find((country) => country.name === selectedCountry)
    ?.provinces.find((province) => province.name === selectedProvince)
    ?.cities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ));

  return (
    <div className="container">
      <h1>Commuter Challenge</h1>
      <p>
        Join us at the commuter challenge by providing event details and
        selecting your country, province, city, and adding participants
        representing their companies!
      </p>

      <div className="event-details">
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Event Name"
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          placeholder="Event Date"
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          placeholder="Event Date"
        />
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          placeholder="Event Time"
        />
        <input
          type="text"
          value={pointOfContact}
          onChange={(e) => setPointOfContact(e.target.value)}
          placeholder="Point of Contact"
        />
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address of the Company"
        />
      </div>

      <div className="country-dropdown">
        <label htmlFor="countrySelect">Select your country:</label>
        <select
          id="countrySelect"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="Canada">Canada</option>
          {/* Add more countries here */}
        </select>
      </div>

      {selectedCountry === "Canada" && (
        <div className="province-dropdown">
          <label htmlFor="provinceSelect">Select your province:</label>
          <select
            id="provinceSelect"
            value={selectedProvince}
            onChange={handleProvinceChange}
          >
            <option value="">Select Province</option>
            {provincesOptions}
          </select>
        </div>
      )}

      {selectedProvince && (
        <div className="city-dropdown">
          <label htmlFor="citySelect">Select your city:</label>
          <select
            id="citySelect"
            value={selectedCity}
            onChange={handleCityChange}
          >
            <option value="">Select City</option>
            {citiesOptions}
          </select>
        </div>
      )}

      <div className="participants-section">
        <h2>Participants</h2>
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              {participant.name} - {participant.company}
            </li>
          ))}
        </ul>

        <div className="add-participant">
          <input
            type="text"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Participant's Name"
          />
          <input
            type="text"
            value={participantCompany}
            onChange={(e) => setParticipantCompany(e.target.value)}
            placeholder="Participant's Company"
          />
          <button onClick={handleAddParticipant}>Add Participant</button>
        </div>
      </div>
    </div>
  );
};

export default CommuterChallenge;
