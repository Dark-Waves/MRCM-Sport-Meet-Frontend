import { useEffect, useReducer } from "react";
import Manager from "./Manager/Manager";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import Types from "./Types/Types";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import Loader from "../../../Components/Loader/Loader";

const initialValue = {
  status: "loading",
  eventData: null,
  eventDataStatus: "loading",
  eventTypes: null,
  eventTypesStatus: "loading",
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setEventData": {
      return { ...state, eventData: action.payload };
    }
    case "setEventDataStatus": {
      return { ...state, eventDataStatus: action.payload };
    }
    case "setEventTypes": {
      return { ...state, eventTypes: action.payload };
    }
    case "setEventTypesStatus": {
      return { ...state, eventTypesStatus: action.payload };
    }
    case "deleteEvent": {
      return {
        ...state,
        eventData: state.eventData.filter(
          (event) => event._id !== action.payload._id
        ),
      };
    }
    case "addEvent": {
      return {
        ...state,
        eventData: [...state.eventData, action.payload],
      };
    }
    case "editEvent": {
      return {
        ...state,
        eventData: state.eventData.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
      };
    }
    default:
      return new Error("method not found");
  }
};

export default function Events() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, eventData, eventDataStatus, eventTypes, eventTypesStatus } =
    state;

  useEffect(
    function () {
      if (!eventTypes) return;
      if (!eventData) return;
      dispatch({ type: "setStatus", payload: "ready" });
    },
    [eventData, eventTypes]
  );

  useEffect(
    function () {
      const getData = async function () {
        if (eventDataStatus !== "loading") return;
        try {
          const token = Cookies.get("token");
          const { data } = await axios.get(`${config.APIURI}/api/v1/events`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch({ type: "setEventDataStatus", payload: "ready" });
          dispatch({ type: "setEventData", payload: data.events });
        } catch (error) {
          dispatch({ type: "setEventDataStatus", payload: "error" });
        }
      };
      getData();
    },
    [eventDataStatus]
  );

  useEffect(
    function () {
      const getData = async function () {
        if (eventTypesStatus !== "loading") return;
        try {
          const token = Cookies.get("token");
          const { data } = await axios.get(
            `${config.APIURI}/api/v1/event-types`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          dispatch({ type: "setEventTypesStatus", payload: "ready" });
          dispatch({
            type: "setEventTypes",
            payload: data.eventsTypes,
          });
        } catch (error) {
          dispatch({ type: "setEventTypesStatus", payload: "error" });
        }
      };
      getData();
    },
    [eventTypesStatus]
  );

  return (
    <div className="events main-content-holder">
      {status === "loading" && <Loader />}{" "}
      {status === "ready" && (
        <div>
          <Routes>
            <Route
              path="/"
              index
              element={<Overview {...state} dispatch={dispatch} />}
            />
            <Route
              path="/Manager"
              element={<Manager {...state} dispatch={dispatch} />}
            />
            <Route
              path="/Types"
              element={<Types {...state} dispatch={dispatch} />}
            />
          </Routes>
        </div>
      )}
    </div>
  );
}
