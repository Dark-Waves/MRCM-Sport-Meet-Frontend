import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./Manager.css";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../utils/config";

export default function Manager({ allEvents, setAllEvents }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    places: [],
    // Add other fields as needed
  });

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
    setEventData(event); // Set the event data to populate the form fields
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setShowPopup(false);
    setEventData({
      name: "",
      description: "",
      places: [],
    });
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowPopup(true);
    setEventData({
      name: "",
      description: "",
      places: [],
    });
  };

  const handleDeleteEvent = async (eventToDelete) => {
    console.log(eventToDelete);
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/events/${eventToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === "ok") {
        const updatedEvents = allEvents.filter(
          (event) => event.id !== eventToDelete.id
        );
        setAllEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      // Handle error scenarios
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const apiUrl = `${config.APIURI}/api/v1/events`;

    try {
      if (selectedEvent) {
        // Edit existing event
        await axios.patch(
          `${apiUrl}/${selectedEvent._id}`,
          { updatedData: eventData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedAllEvents = allEvents.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        );
        setAllEvents(updatedAllEvents);
      } else {
        // Create new event
        await axios.put(
          apiUrl,
          { eventData: eventData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const newEvent = { ...eventData, id: Date.now() }; // Generate a temporary ID for the new event (replace it with the actual ID received from the API)
        setAllEvents([...allEvents, newEvent]);
      }
      closePopup();
    } catch (error) {
      console.error("Error saving event:", error);
      // Handle error scenarios
    }
  };

  const handleAddPlace = () => {
    let updatedPlaces = [];
    if (!eventData.places || eventData.places.length === 0) {
      const newPlace = {
        place: 1,
        minimumMarks: 0,
        // Other place properties
      };
      updatedPlaces = [newPlace];
    } else {
      const nextPlace = eventData.places.length + 1;
      const newPlace = {
        place: nextPlace,
        minimumMarks: 0,
        // Other place properties
      };
      updatedPlaces = [...eventData.places, newPlace];
    }
    setEventData({
      ...eventData,
      places: updatedPlaces,
    });
  };

  const handlePlaceChange = (index, field, value) => {
    const updatedPlaces = [...eventData.places];
    updatedPlaces[index][field] = value;
    setEventData({
      ...eventData,
      places: updatedPlaces,
    });
  };
  return (
    <div className="event-manager">
      <div className="grid-common">
        <div className="grid-content flex-col">
          <div className="grid-card-container">
            {allEvents &&
              allEvents.map((event, index) => (
                <div className="grid-card flex-col-bet" key={index}>
                  <div className="grid-card-content">
                    <h3>{event.name}</h3>
                    <p>{event.description}</p>
                  </div>
                  <div className="grid-card-actions">
                    <button onClick={() => openEditPopup(event)}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event)}>
                      Delete
                    </button>
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
            <form onSubmit={handleSaveEvent}>
              <input
                type="text"
                placeholder="Name"
                value={eventData.name}
                onChange={(e) =>
                  setEventData({ ...eventData, name: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                value={eventData.description}
                onChange={(e) =>
                  setEventData({ ...eventData, description: e.target.value })
                }
              ></textarea>
              <div className="places-section">
                <h3>Places</h3>
                {eventData.places &&
                  eventData.places.map((place, index) => (
                    <div key={index}>
                      <input
                        type="number"
                        value={place.place}
                        onChange={(e) =>
                          handlePlaceChange(index, "place", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        value={place.minimumMarks}
                        onChange={(e) =>
                          handlePlaceChange(
                            index,
                            "minimumMarks",
                            e.target.value
                          )
                        }
                      />
                      {/* Add other fields for place */}
                    </div>
                  ))}
                <button type="button" onClick={handleAddPlace}>
                  Add Place
                </button>
              </div>
              <button type="submit">
                {selectedEvent ? "Save Changes" : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
