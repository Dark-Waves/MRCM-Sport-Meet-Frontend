// EventAssociation.js
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./Association.css";
import dayjs from "dayjs";
import { config } from "../../../../../config";

const initialValue = {
  status: "none",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return {
        ...state,
        status: action.payload,
      };
    }

    default:
      throw new Error("Method not found");
  }
};
export default function Association({ eventData, socket }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status } = state;

  const handleApeal = async function () {
    if (status === "loading") return;
    dispatch({ type: "setStatus", payload: "loading" });
  };
  useEffect(
    function () {
      const sendData = async function () {
        if (status !== "loading") return;
        try {
          // Send a POST request to the backend API
          await axios.post(`/api/event/associateevent`, {
            eventId: eventData._id, // Replace with the actual event ID
          });
          dispatch({ type: "setStatus", payload: "none" });
        } catch (error) {
          dispatch({ type: "setStatus", payload: "error" });
        }
      };

      sendData();
    },
    [status, eventData]
  );
  useEffect(
    function () {
      const sendError = async function () {
        if (status !== "error") return;
        socket &&
          socket.emit("server-message", {
            type: "notificationUpdate",
            payload: {
              success: true,
              save: false,
              message: {
                timestamp: dayjs().valueOf(),
                message: `An Unexpected Error accoured when trying to appeal to the event`,
                path: `/dashboard/event/${eventData._id.toString()}`,
              },
            },
          });
      };

      sendError();
    },
    [status, socket, eventData]
  );
  return (
    <div className="apeal-section">
      <div className="wrapper">
        <div className="msg">
          <span>You Are Not Associated To This Event</span>
          <span>You Can Apeal To It And Get Acess</span>
        </div>
        <div onClick={handleApeal}>
          <button className="btn" type="submit">
            Apeal
          </button>
        </div>
        <div className="img">
          <svg
            id="sw-js-blob-svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sw-gradient" x1={0} x2={1} y1={1} y2={0}>
                <stop
                  id="stop1"
                  stopColor="rgba(52.466, 61.582, 185.629, 1)"
                  offset="0%"
                />
                <stop
                  id="stop2"
                  stopColor="rgba(89.601, 161.145, 240.236, 1)"
                  offset="100%"
                />
              </linearGradient>
            </defs>
            <path
              fill="url(#sw-gradient)"
              d="M20.9,-32.3C26.8,-28.7,31.1,-22.4,35.6,-15.4C40.1,-8.4,44.7,-0.7,44.2,6.7C43.6,14,37.8,20.9,31.8,27.2C25.8,33.6,19.5,39.4,12.1,41.8C4.7,44.1,-3.8,43.1,-11.4,40.2C-19.1,37.4,-25.9,32.8,-31.7,27C-37.5,21.1,-42.4,14,-42.7,6.6C-43.1,-0.8,-39,-8.3,-34.7,-15.1C-30.4,-21.8,-26,-27.7,-20.2,-31.3C-14.4,-35,-7.2,-36.3,0.1,-36.6C7.5,-36.8,15,-35.8,20.9,-32.3Z"
              width="100%"
              height="100%"
              transform="translate(50 50)"
              strokeWidth={0}
              style={{ transition: "all 0.3s ease 0s" }}
              stroke="url(#sw-gradient)"
            />
          </svg>
        </div>
      </div>

      {status === "loading" && <div className="loader">Loading...</div>}
    </div>
  );
}
