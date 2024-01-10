import React, { useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventCreated, setEventCreated] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCreateEventClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform event submission logic here (you can add more validation if needed)
    // For this example, we'll just set the event as created
    setEventCreated(true);
    setEventName(""); // Reset eventName to an empty string
    setStartDate(""); // Reset startDate to an empty string
    setEndDate(""); // Reset endDate to an empty string
    setSelectedCountry(""); // Reset selectedCountry to an empty string
    setSelectedProvince(""); // Reset selectedProvince to an empty string
    setSelectedCity(""); // Reset selectedCity to an empty string
  };

  const canadaProvinces = ["Ontario", "Quebec", "Alberta", "British Columbia"]; // Add more provinces
  const canadaCities = {
    Ontario: ["Toronto", "Ottawa", "Hamilton"],
    Alberta: ["Calgary", "Edmonton", "Red Deer"],
    Quebec: ["Montreal", "Quebec City", "Sherbrooke"],
    "British Columbia": ["Vancouver", "Victoria", "Kelowna"],
  }; // Add more cities for each province

  return (
    <div className="App">
      {!showForm ? (
        <button onClick={handleCreateEventClick}>Create an Event</button>
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
              <option value="Canada">Canada</option>
              {/* Add more countries if needed */}
            </select>
          </label>
          <br />
          {selectedCountry === "Canada" && (
            <>
              <label>
                Province:
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  required
                >
                  <option value="">Select Province</option>
                  {canadaProvinces.map((province, index) => (
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
                    canadaCities[selectedProvince].map((city, index) => (
                      <option key={index} value={city}>
                        {city}
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
      {eventCreated && <p>Thank you, Your Event has been Created</p>}
    </div>
  );
}

export default App;
