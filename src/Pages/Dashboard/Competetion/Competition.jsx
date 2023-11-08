import "./Competition.css";

import { Routes, Route, Navigate } from "react-router-dom";
import All from "./components/All";
import Live from "./components/Live";
import Associated from "./components/Associated";
import { useContext, useEffect, useReducer } from "react";
import DashboardContext from "../Context/DashboardContext";
import { config } from "../../../config";
import axios from "axios";
const initialValue = {
  status: "loading",
  eventsData: [],
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setEventsData": {
      return { ...state, eventsData: action.payload };
    }
    case "modifyEventData": {
      return {
        ...state,
        eventsData: [
          state.eventsData.filter((val) => val._id !== action.payload._id),
          action.payload,
        ],
      };
    }
    case "removeEventData": {
      return {
        ...state,
        eventsData: state.eventsData.filter(
          (val) => val._id !== action.payload
        ),
      };
    }
    default:
      return new Error("method not found");
  }
};

export default function Competition() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { socket, defaultLogo } = useContext(DashboardContext);
  const { status } = state;
  /**Event Handler */
  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function ({ type, payload }) {
        switch (type) {
          case "competitionUpdate": {
            const { eventData, event, id } = payload;
            if (event === "edit")
              dispatch({ type: "modifyEventData", payload: eventData });
            if (event === "remove")
              dispatch({ type: "removeEventData", payload: id });
            return;
          }
        }
      };
      socket.on("server-message", handleSocket);
      return function () {
        socket.removeEventListener("server-message", handleSocket);
      };
    },
    [socket]
  );

  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchEventData = async function () {
        if (status !== "loading") return;
        try {
          const { data = null } = await axios.post(
            `/api/competitions/getEvents`,
            {},
            {
              signal,
              withCredentials: true,
            }
          );
          if (data.eventsData)
            dispatch({ type: "setEventsData", payload: data.eventsData });
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
    [status]
  );

  return (
    <section className="content competitions active" id="competitions">
      <Routes>
        <Route
          path="all"
          element={<All {...state} defaultLogo={defaultLogo} />}
        />
        <Route
          path="live"
          element={<Live {...state} defaultLogo={defaultLogo} />}
        />
        <Route
          path="associated"
          element={<Associated {...state} defaultLogo={defaultLogo} />}
        />
        <Route
          path="*"
          element={<Navigate to={"all"} defaultLogo={defaultLogo} />}
        />
      </Routes>
    </section>
  );
}
