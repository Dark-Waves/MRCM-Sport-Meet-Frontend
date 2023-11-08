import { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Association from "./components/Association/Association";
import "./Event.css";
import Upload from "./components/Upload/Upload";
import Data from "./components/Data/Data";
import InnerUpdatesLoader from "../components/Loaders/InnerUpdatesLoader"; // Corrected import
import DashboardContext from "../Context/DashboardContext";
import ErrorPage from "../Error/Error";
import Uploads from "./components/Uploads/Upload";
import { config } from "../../../config";

const initialValue = {
  status: "loading",
  eventData: null,
  uploads: null,
  appealStatus: null,
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
    case "setUploads": {
      return { ...state, uploads: action.payload };
    }
    case "setAppealStatus": {
      return { ...state, appealStatus: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Event() {
  const { eventId } = useParams();
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { socket, defaultLogo } = useContext(DashboardContext);
  const { status, eventData, uploads, appealStatus } = state;

  /**Event Handler */

  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function ({ type, payload }) {
        switch (type) {
          case "eventUpdate": {
            const { eventData, event, appealStatus, uploads, id } = payload;
            if (id !== eventId) return;
            if (event === "remove")
              dispatch({ type: "setStatus", payload: "error" });
            if (event === "edit") {
              if (eventData)
                dispatch({ type: "setEventData", payload: eventData });
              dispatch({ type: "setAppealStatus", payload: appealStatus });
              if (uploads) dispatch({ type: "setUploads", payload: uploads });
            }
            return;
          }
        }
      };
      socket.on("server-message", handleSocket);
      return function () {
        socket.removeEventListener("server-message", handleSocket);
      };
    },
    [socket, eventId]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchEventData = async function () {
        if (status !== "loading") return;
        try {
          const { data: { data } = null } = await axios.post(
            `/api/event/getevent`,
            {
              eventId,
            },
            { signal }
          );
          if (data.appealStatus)
            dispatch({ type: "setAppealStatus", payload: data.appealStatus });
          if (data.uploads)
            dispatch({ type: "setUploads", payload: data.uploads });
          if (data.appealStatus)
            dispatch({ type: "setAppealStatus", payload: data.appealStatus });
          if (data.eventData)
            dispatch({ type: "setEventData", payload: data.eventData });
        } catch (error) {
          if (error.name === "CanceledError") return;
          dispatch({ type: "setStatus", payload: "error" });
        } finally {
          if (signal.aborted) return;
          dispatch({ type: "setStatus", payload: "ready" });
        }
      };
      fetchEventData();
      return function () {
        controller.abort();
      };
    },
    [eventId, status]
  );

  const refreshEvent = () => {
    dispatch({ type: "setStatus", payload: "loading" });
  };
  return (
    <div className="content event-content active" id="event">
      {status === "loading" && <InnerUpdatesLoader />}
      {status === "error" && <ErrorPage code={401} />}
      {status === "ready" && eventData && (
        <div>
          <Data {...state} defaultLogo={defaultLogo} socket={socket} />
          {appealStatus && <Association {...state} socket={socket} />}
          {!appealStatus && (
            <>
              {eventData.started && <Upload {...state} socket={socket} />}
              <Uploads {...state} socket={socket} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
