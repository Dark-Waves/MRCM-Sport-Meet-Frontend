import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer } from "react";
import "./Manager.css";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../utils/config";
import PopUp from "../../../UI/PopUp/PopUp";
import Button from "../../../UI/Button/Button";
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
  tempeventData: null,
  selectedEvent: null,
  saveStatus: "none",
  saveResponse: null,
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
  const { popUpModal, tempeventData, selectedEvent, saveStatus, saveResponse } =
    state;
  const handleSubmit = async function () {
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
  };
  const closePopUp = async function () {
    dispatch({ type: "reset" });
  };

  useEffect(
    function () {
      const submitData = async function () {
        if (saveStatus !== "loading") return;
        if (!popUpModal) return;
        // deleting event
        if (!tempeventData && selectedEvent) {
          try {
            
            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
        // editing event
        if (tempeventData && selectedEvent) {
          try {
            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
        // creating event
        if (tempeventData && !selectedEvent) {
          try {
            closePopUp();
          } catch (error) {
            dispatch({ type: "setSaveStatus", payload: "error" });
            dispatch({ type: "setSaveResponse", payload: error });
          }
        }
      };
      submitData();
    },
    [saveStatus, popUpModal, selectedEvent, tempeventData]
  );
  return <div></div>;
}
