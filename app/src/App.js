import React, { useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventCreated, setEventCreated] = useState(false);

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
    setEndDate("");
  };

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
          <button type="submit">Submit</button>
        </form>
      )}
      {eventCreated && <p>Thank you, Your Event has been Created</p>}
    </div>
  );
}

export default App;
