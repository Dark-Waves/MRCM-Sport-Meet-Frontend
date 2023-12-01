import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import "./Manager.css";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../utils/config";
import PopUp from "../../../UI/PopUp/PopUp";
import Button from "../../../UI/Button/Button";
import { useAutocomplete } from "@mui/base/useAutocomplete";
import { styled } from "@mui/system";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { async } from "parse/lib/browser/Storage";
const initialValue = {
  popUpModal: false,
  tempeventData: {},
  selectedEvent: {},
  saveStatus: "none",
  saveResponse: null,
  submitErrors: {},
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setPopUp": {
      return { ...state, popUpModal: action.payload };
    }
    case "setSelectedEvent": {
      return { ...state, selectedEvent: action.payload };
    }
    case "setEventData": {
      return { ...state, tempeventData: action.payload };
    }
    case "setSaveStatus": {
      return { ...state, saveStatus: action.payload };
    }
    case "setSubmitErrors": {
      return { ...state, submitErrors: action.payload };
    }
    case "setSaveResponse": {
      return { ...state, saveResponse: action.payload };
    }
    case "reset": {
      return { ...initialValue };
    }
    default:
      return new Error("method not found");
  }
};
export default function Manager({
  eventTypes,
  eventData,
  dispatch: dispatchEvent,
}) {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const {
    popUpModal,
    tempeventData,
    selectedEvent,
    saveStatus,
    saveResponse,
    submitErrors,
  } = state;

  const handleSubmit = async function (force) {
    if (!force) {
      const errors = [];
      if (!tempeventData.name) {
        errors.push({
          message: "Please Enter a name to the event.",
          type: "name",
        });
      }
      if (!(tempeventData.places && tempeventData.places.length > 0)) {
        errors.push({
          message: "Please Enter places to the event.",
          type: "places",
        });
      } else {
        for (const place of tempeventData.places) {
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
        dispatch({ type: "setSubmitErrors", payload: errorDetails });
        return;
      }
    }

    dispatch({ type: "setSaveStatus", payload: "loading" });
    dispatch({ type: "setSaveResponse", payload: null });
  };
  const handleCreate = async function () {
    dispatch({ type: "setPopUp", payload: true });
  };
  const handleEdit = async function (eventId) {
    const event = eventData.find((val) => val._id === eventId);
    if (!event) return;
    dispatch({ type: "setPopUp", payload: true });
    dispatch({ type: "setSelectedEvent", payload: event });
    dispatch({ type: "setEventData", payload: event });
  };
  const handleDelete = async function (eventId) {
    const event = eventData.find((val) => val._id === eventId);
    if (!event) return;
    dispatch({ type: "setSelectedEvent", payload: event });
    dispatch({ type: "setEventData", payload: {} });
    handleSubmit(true);
  };
  const closePopUp = async function () {
    dispatch({ type: "reset" });
  };
  const getOrdinal = async function (number) {
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

  const handleAddPlaces = async function () {
    let updatedPlaces = [];

    if (!tempeventData.places || tempeventData.places.length === 0) {
      const newPlace = {
        place: 1,
        minimumMarks: 0,
        // Other place properties
      };
      updatedPlaces = [newPlace];
    } else {
      const nextPlace = tempeventData.places.length + 1;
      const newPlace = {
        place: nextPlace,
        minimumMarks: 0,
        // Other place properties
      };
      updatedPlaces = [...tempeventData.places, newPlace];
    }
    dispatch({
      type: "setEventData",
      payload: {
        ...tempeventData,
        places: updatedPlaces,
      },
    });
  };
  const handlePlaces = async function (e, place, index) {
    const updatedPlaces = [...tempeventData.places];
    updatedPlaces[index].minimumMarks = e.target.value;
    dispatch({
      type: "setEventData",
      payload: {
        ...tempeventData,
        places: updatedPlaces,
      },
    });
  };

  useEffect(
    function () {
      const submitData = async function () {
        if (saveStatus !== "loading") return;
        const token = Cookies.get("token");
        const apiUrl = `${config.APIURI}/api/v1/events`;
        // deleting event
        if (
          !Object.keys(tempeventData).length &&
          Object.keys(selectedEvent).length
        ) {
          try {
            await axios.delete(`${apiUrl}/${selectedEvent._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            dispatchEvent({
              type: "deleteEvent",
              payload: selectedEvent,
            });
            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
        // editing event
        if (
          Object.keys(tempeventData).length &&
          Object.keys(selectedEvent).length
        ) {
          try {
            const { data } = await axios.patch(
              `${apiUrl}/${selectedEvent._id}`,
              { updatedData: tempeventData },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            dispatchEvent({
              type: "editEvent",
              payload: data.eventSchema,
            });

            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
        // creating event
        if (
          Object.keys(tempeventData).length &&
          !Object.keys(selectedEvent).length
        ) {
          try {
            const { data } = await axios.put(
              apiUrl,
              { eventData: tempeventData },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            dispatchEvent({
              type: "addEvent",
              payload: data.eventSchema,
            });
            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
      };
      submitData();
    },
    [saveStatus, selectedEvent, tempeventData, dispatchEvent]
  );

  return (
    <div className="event-manager">
      <div className="content_top w-full m-b-4">
        <Button
          className="create-event-button"
          variant="outlined"
          onClick={handleCreate}
        >
          Create New Event
        </Button>
      </div>
      <div className="content-grid-one flex-col g-4 w-full">
        {eventData.map((event, index) => (
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
              <Button variant="contained" onClick={() => handleEdit(event._id)}>
                Edit
              </Button>
              <Button
                btnType="error"
                variant="outlined"
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      {popUpModal && (
        <PopUp closePopup={closePopUp}>
          <h2>
            {Object.keys(selectedEvent).length
              ? "Edit Event"
              : "Create New Event"}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="m-t-5 m-b-4 flex-col-center g-4"
          >
            <TextField
              type="text"
              style={{ width: "100%" }}
              value={tempeventData?.name ? tempeventData?.name : ""}
              onChange={(e) => {
                dispatch({
                  type: "setEventData",
                  payload: { ...tempeventData, name: e.target.value },
                });
              }}
              label="Enter Event Name"
              error={submitErrors.name}
            />
            <TextField
              minRows={4}
              maxRows={4}
              className="m-b-4"
              style={{ width: "100%" }}
              label="Description"
              value={
                tempeventData?.description ? tempeventData?.description : ""
              }
              onChange={(e) => {
                dispatch({
                  type: "setEventData",
                  payload: { ...tempeventData, description: e.target.value },
                });
              }}
              error={submitErrors.description}
            />
           
            <Button variant="contained" type="submit" className="m-t-3">
              {Object.keys(selectedEvent).length
                ? "Save Changes"
                : "Create Event"}
            </Button>
          </form>
        </PopUp>
      )}
    </div>
  );
}
