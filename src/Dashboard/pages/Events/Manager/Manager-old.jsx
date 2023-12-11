import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./Manager.css";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../utils/config";
import PopUp from "../../../UI/PopUp/PopUp";
import Button from "../../../UI/Button/Button";
import Input from "../../../UI/Input/Input";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function Manager({ allEvents, setAllEvents }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    type: "",
    places: [],
  });
  const [submitErrors, setSubmitErrors] = useState({});
  const [eventTypes, setEventTypes] = useState([]);
  useEffect(() => {
    const getEventTypes = async () => {
      try {
        let responce = await axios.get(`${config.APIURI}/api/v1/event-types`, {
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        });
        if (responce.data) {
          console.log(responce.data);
          setEventTypes(responce.data.eventsTypes);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getEventTypes();
  }, []);

  const openEditPopup = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
    setEventData(event); // Set the event data to populate the form fields
    setSubmitErrors({});
  };

  const closePopup = () => {
    setSelectedEvent(null);
    setShowPopup(false);
    setEventData({
      name: "",
      description: "",
      type: "",
      places: [],
    });
    setSubmitErrors({});
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowPopup(true);
    setEventData({
      name: "",
      description: "",
      type: "",
      places: [],
    });
    setSubmitErrors({});
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
          (event) => event._id !== eventToDelete._id
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
    console.log(eventData);
    const errors = [];

    if (!eventData.name) {
      errors.push({
        message: "Please Enter a name to the event.",
        type: "name",
      });
    }
    if (!(eventData.places && eventData.places.length > 0)) {
      errors.push({
        message: "Please Enter places to the event.",
        type: "places",
      });
    } else {
      for (const place of eventData.places) {
        console.log(place);
        if (!place.place || !place.minimumMarks) {
          errors.push({
            message: "Please fill all place details.",
            type: `place - ${place.place}`,
          });
          break; // Break the loop if any place detail is missing
        }
      }
    }

    if (errors.length > 0) {
      const errorDetails = {};
      errors.forEach((error) => {
        errorDetails[error.type] = error.message;
      });
      setSubmitErrors(errorDetails);
      console.log(submitErrors);
      return; // Prevent API call if there are validation errors
    }

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
      setSubmitErrors({});
      closePopup();
    } catch (error) {
      console.error("Error saving event:", error);
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

  const getOrdinal = (number) => {
    if (number >= 11 && number <= 13) {
      return number + "th";
    }

    const lastDigit = number % 10;

    switch (lastDigit) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  };
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div className="event-manager">
      <div className="content_top w-full m-b-4">
        <Button
          className="create-event-button"
          variant="outlined"
          onClick={handleCreateEvent}
        >
          Create New Event
        </Button>
      </div>
      <div className="content-grid-one flex-col g-4 w-full">
        {allEvents &&
          allEvents.map((event, index) => (
            <div className="grid-common" key={index}>
              <div className="flex-col-center g-4 m-t-4">
                {event.name && (
                  <div className="event-name font-weight-500 font-md">
                    <span className="font-weight-600">{event.name}</span>
                  </div>
                )}
                {event.type && (
                  <div className="event-des m-b-4 font-weight-500 font-md">
                    <span className="font-weight-600">{event.type}</span>
                  </div>
                )}
                {event.description && (
                  <div className="event-des m-b-4 font-weight-500 font-md">
                    <span className="font-weight-600">{event.description}</span>
                  </div>
                )}
              </div>
              <div className="g-4 flex-row-center">
                <Button
                  variant="contained"
                  onClick={() => openEditPopup(event)}
                >
                  Edit
                </Button>
                <Button
                  btnType="error"
                  variant="outlined"
                  onClick={() => handleDeleteEvent(event)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
      {showPopup && (
        <PopUp closePopup={closePopup}>
          <h2>{selectedEvent ? "Edit Event" : "Create New Event"}</h2>
          <form
            onSubmit={handleSaveEvent}
            className="m-t-5 m-b-4 flex-col-center g-4"
          >
            <TextField
              type="text"
              style={{ width: "100%" }}
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              label="Enter Event Name"
              error={submitErrors.name}
            />
            {/* {eventTypes.length > 0 && (
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="eventTypes"
                  value={eventData.type ? eventData.type._id : ""}
                  label="Type"
                  onChange={(e) => {
                    const selectedType = eventTypes.find(
                      (type) => type._id === e.target.value
                    );
                    setEventData({ ...eventData, type: selectedType });
                  }}
                >
                  {eventTypes.map((type, index) => (
                    <MenuItem key={index} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )} */}

            <FormControl fullWidth>
              <Select
                itemID="House"
                labelId="House-select-label"
                // value={member.House || ""}
                id="House"
                label="House"
                // onChange={(e) => handleInputChanges(e, index, "House")}
              >
                <MenuItem value="">Select House</MenuItem>{" "}
                {/* Add a default empty option */}
                {eventTypes.map((House, index) => (
                  <MenuItem key={index} value={House.Name}>
                    {House.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* This is not working */}

            <TextField
              minRows={4}
              maxRows={4}
              className="m-b-4"
              style={{ width: "100%" }}
              label="Description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              error={submitErrors.description}
            />

            <div className="places-section">
              {/* {submitErrors.places && (
                <span className="error_container text-scarlet font-md font-weight-600">
                  {submitErrors.places}
                </span>
              )}
              {submitErrors.place && (
                <span className="error_container text-scarlet font-md font-weight-600">
                  {submitErrors.place}
                </span>
              )} */}
              {eventData.places.length > 0 && (
                <>
                  <h3>Places</h3>
                  {eventData.places.map((place, index) => (
                    <div
                      key={index}
                      className="flex-row-bet m-3 text-center position-relative"
                    >
                      <TextField
                        label={getOrdinal(place.place)}
                        type="number"
                        style={{ width: "100%" }}
                        placeholder="Score"
                        value={place.minimumMarks}
                        onChange={(e) =>
                          handlePlaceChange(
                            index,
                            "minimumMarks",
                            e.target.value
                          )
                        }
                        error={submitErrors[`place - ${place.place}`]}
                        className="w-85"
                      />
                      {/* <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" /> */}
                    </div>
                  ))}
                </>
              )}
              <Button
                type="button"
                className="m-t-4"
                btnType={submitErrors.places ? "error" : "primary"}
                startIcon={
                  submitErrors.places ? (
                    <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
                  ) : (
                    ""
                  )
                }
                onClick={handleAddPlace}
              >
                Add Place
              </Button>
            </div>
            <Button variant="contained" type="submit" className="m-t-3">
              {selectedEvent ? "Save Changes" : "Create Event"}
            </Button>
          </form>
          {/* {submitErrors && (
            <span className="error_container text-scarlet font-md font-weight-600">
              {submitErrors.message}
            </span>
          )} */}
        </PopUp>
      )}
    </div>
  );
}