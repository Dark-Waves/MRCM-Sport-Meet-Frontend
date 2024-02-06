import React, { useEffect, useReducer } from "react";
import Manager from "./Manager/Manager";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import Types from "./Types/Types";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import Loader from "../../../Components/Loader/Loader";

interface Places {
  minimumMarks: number;
  place: number;
  _id: string;
}

interface Types {
  option: string;
  selection: string;
  _id: string;
}

interface EventTypesOptions {
  option: string;
  _id: string;
}
export interface EventTypes {
  _id: string;
  name: string;
  options: EventTypesOptions[] | null;
}

interface Event {
  _id: string;
  description: string;
  name: string;
  places: Places[];
  state: string;
  types: Types[];
  inputType: "MemberID" | "HouseName";
}

export interface State {
  status: string;
  eventData: Event[] | null;
  eventDataStatus: string;
  eventTypes: EventTypes[] | null;
  eventTypesStatus: string;
}

export type Action =
  | { type: "setStatus"; payload: string }
  | { type: "setEventData"; payload: Event[] }
  | { type: "setEventDataStatus"; payload: string }
  | { type: "setEventTypes"; payload: any } // Define the payload type for eventTypes
  | { type: "setEventTypesStatus"; payload: string }
  | { type: "deleteEvent"; payload: Event }
  | { type: "addEvent"; payload: Event }
  | { type: "editEvent"; payload: Event };

const initialValue: State = {
  status: "loading",
  eventData: null,
  eventDataStatus: "loading",
  eventTypes: null,
  eventTypesStatus: "loading",
};

const reducer = function (state: State, action: Action): State {
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
        eventData: state.eventData
          ? state.eventData?.filter((event) => event._id !== action.payload._id)
          : [],
      };
    }
    case "addEvent": {
      return {
        ...state,
        eventData: state.eventData
          ? [...state.eventData, action.payload]
          : [action.payload],
      };
    }
    case "editEvent": {
      return {
        ...state,
        eventData: state.eventData
          ? state.eventData.map((event) =>
              event._id === action.payload._id ? action.payload : event
            )
          : [],
      };
    }
    default:
      throw new Error("Method not found");
  }
};

const Events: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, eventData, eventDataStatus, eventTypes, eventTypesStatus } =
    state;

  useEffect(() => {
    if (!eventTypes) return;
    if (!eventData) return;
    dispatch({ type: "setStatus", payload: "ready" });
  }, [eventData, eventTypes]);

  useEffect(() => {
    const getData = async () => {
      if (eventDataStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v${config.Version}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch({ type: "setEventDataStatus", payload: "ready" });
        dispatch({ type: "setEventData", payload: data.events });
      } catch (error) {
        dispatch({ type: "setEventDataStatus", payload: "error" });
      }
    };
    getData();
  }, [eventDataStatus]);

  useEffect(() => {
    const getData = async () => {
      if (eventTypesStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${config.APIURI}/api/v${config.Version}/event-types`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch({ type: "setEventTypesStatus", payload: "ready" });
        dispatch({ type: "setEventTypes", payload: data.eventsTypes });
      } catch (error) {
        dispatch({ type: "setEventTypesStatus", payload: "error" });
      }
    };
    getData();
  }, [eventTypesStatus]);

  return (
    <div className="events main-content-holder position-relative h-full">
      {status === "loading" && <Loader />}
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
};

export default Events;
