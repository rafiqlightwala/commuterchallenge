import React, { useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventData, setEventData] = useState(null);
  const [eventErrorData, setEventErrorData] = useState(null);


  const addEvent = async (eventName, startingDate, endingDate) => {

      const response = await fetch('http://localhost:4000/v1/events', {
        method: 'POST',
        body: JSON.stringify({
          name: eventName,
          startDate: startingDate,
          endDate: endingDate,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
  
      //console.log('Response status code:', response.status); 
      const returnedData = await response.json();

      if (response.status !== 201) {
        // Handle non-201 status
        setEventErrorData(returnedData);
        console.log(returnedData.message)
        // Optionally, you can throw an error or return early
        //throw new Error(`Request failed with status ${response.status}`);
      } else {
        setEventData(returnedData);
        setEventName(""); // Reset eventName to an empty string
        setStartDate(""); // Reset startDate to an empty string
        setEndDate("");
      }

      //console.log(returnedData);
  };
  

  const handleCreateEventClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform event submission logic here (you can add more validation if needed)
    // For this example, we'll just set the event as created
    addEvent(eventName, startDate, endDate)
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

      {eventData && <p> Your event with {eventData.eventDays} days has been created</p>}
      {eventErrorData && <p>{eventErrorData.message}</p>}
        

    </div>
  );
}

export default App;
