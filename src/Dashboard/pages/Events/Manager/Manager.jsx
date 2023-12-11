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
import { Autocomplete, InputLabel, TextField } from "@mui/material";
import { async } from "parse/lib/browser/Storage";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const initialValue = {
  popUpModal: false,
  tempeventData: { name: "", description: "", places: [], types: [] },
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
  console.log(tempeventData);
  const handleSubmit = async function (force) {
    if (!force) {
      const errors = [];
      if (!tempeventData.name) {
        errors.push({
          message: "Please Enter a name to the event.",
          type: "name",
        });
      }
      if (!(tempeventData.types && tempeventData.types.length)) {
        errors.push({
          message: "Please Select a types to the event.",
          type: "types",
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
      console.log(errors);
      if (errors.length > 0) {
        const errorDetails = {};
        errors.forEach((error) => {
          errorDetails[error.type] = error.message;
        });
        dispatch({ type: "setSubmitErrors", payload: errorDetails });
        return;
      }
    }
    console.log(tempeventData);
    dispatch({ type: "setSaveStatus", payload: "loading" });
    dispatch({ type: "setSaveResponse", payload: null });
  };
  const handleCreate = async function () {
    dispatch({ type: "setPopUp", payload: true });
  };
  const handleEdit = async function (eventId) {
    const event = eventData.find((val) => val._id === eventId);
    if (!event) return;
    console.log(event);
    dispatch({ type: "setPopUp", payload: true });
    dispatch({ type: "setSelectedEvent", payload: event });
    dispatch({ type: "setEventData", payload: event });
  };
  const handleDelete = async function (eventId) {
    const event = eventData.find((val) => val._id === eventId);
    if (!event) return;
    dispatch({ type: "setSelectedEvent", payload: event });
    dispatch({
      type: "setEventData",
      payload: { name: "", description: "", places: [], types: [] },
    });
    handleSubmit(true);
  };
  const closePopUp = async function () {
    dispatch({ type: "reset" });
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
    console.log(updatedPlaces);
    dispatch({
      type: "setEventData",
      payload: {
        ...tempeventData,
        places: updatedPlaces,
      },
    });
  };
  const handlePlaces = async function (e, place, index) {
    e.preventDefault();
    console.log(e.target.value);
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
                  <span className="font-weight-600">{event.type.name}</span>
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
            <div className="event_types_selection">
              {eventTypes.map((eventType, index) => (
                <FormControl fullWidth key={index}>
                  <InputLabel id="event-type-select-label">
                    {eventType.name}
                  </InputLabel>
                  <Select
                    labelId="event-type-select-label"
                    id="event-type-select"
                    value={
                      tempeventData.types?.find(
                        (type) => type._id === eventType._id
                      )?.option ||
                      selectedEvent?.types?.find(
                        (type) => type._id === eventType._id
                      )?.option ||
                      ""
                    }
                    label="Type"
                    onChange={(e) => {
                      const selectedOptionId = e.target.value;
                      const selectedEventType = eventTypes.find((eventType) =>
                        eventType.options.some(
                          (option) => option._id === selectedOptionId
                        )
                      );
                      const updatedTypes = [
                        ...(tempeventData.types || []).filter(
                          (type) => type._id !== selectedEventType._id
                        ),
                        {
                          _id: selectedEventType._id,
                          option: selectedOptionId,
                        },
                      ];

                      dispatch({
                        type: "setEventData",
                        payload: {
                          ...tempeventData,
                          types: updatedTypes,
                        },
                      });
                    }}
                    error={submitErrors.type}
                  >
                    {eventType.options.map((data, index) => (
                      <MenuItem key={index} value={data._id}>
                        {data.option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </div>

            <div className="places-section">
              {tempeventData.places && tempeventData.places.length > 0 && (
                <>
                  <h3>Places</h3>
                  {tempeventData.places.map((place, index) => (
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
                        onChange={(e) => handlePlaces(e, place, index)}
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
                onClick={handleAddPlaces}
              >
                Add Place
              </Button>
            </div>

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
