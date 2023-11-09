import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { events } from "../../../data/data";
import "./Manager.css"

export default function Manager() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setShowPopup(false);
  };

  const handleDeleteEvent = (eventToDelete) => {
    // Implement delete functionality here
    console.log('Delete event' + eventToDelete.title)
  };

  const handleSaveEvent = (eventData) => {
    // Implement save or update functionality here
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowPopup(true);
  };

  return (
    <div className="event-manager">
      <div className="grid-common">

        <div className="grid-content flex-col">

          <div className="grid-card-container">
            {events.map((event) => (
              <div className="grid-card flex-col-bet" key={event.id}>
                <div className="grid-card-image">
                  <img src={event.pic} alt={event.title} />
                </div>
                <div className="grid-card-content">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="grid-card-actions">
                  <button onClick={() => openEditPopup(event)}>Edit</button>
                  <button onClick={() => handleDeleteEvent(event)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <button className="create-event-button" onClick={handleCreateEvent}>
            Create New Event
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>
            {/* Add your form for editing/creating events here */}
            <button onClick={handleSaveEvent}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
