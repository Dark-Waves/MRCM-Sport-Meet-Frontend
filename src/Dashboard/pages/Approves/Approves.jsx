import React, { useContext, useEffect, useState } from "react";
import DashboardContext from "../../../Context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../../config";

export default function Approves() {
  const { socket } = useContext(DashboardContext);
  const [incomingSubmits, setIncomingSubmits] = useState([]);
  useEffect(
    function () {
      socket.on("server-message", (message) => {
        if (message.type === "eventSubmits") {
          console.log(message);
          setIncomingSubmits((prev) => [{ ...message.payload }, ...prev]);
        }
      });
    },
    [socket]
  );
  useEffect(function () {
    const getData = async function () {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v1/events/submitted`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.events);
        setIncomingSubmits(response.data.events);
        // Add logic to handle the response if needed
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <div className="approve__submits">
      {incomingSubmits ? (
        <div className="incoming_submits">
          <h1 className="font-weight-600 font-lg">Incoming Submits</h1>
          <div className="incoming_submits__container">
            {incomingSubmits.map((data, index) => (
              <div key={index} className="incoming_submit">
                <div className="event_name">{data.name}</div>
                <div className="event_places">
                  {data.places.map((data, index) => (
                    <div className="submitted__places flex-row-aro" key={index}>
                      <span>{data.place}</span>
                      <span>
                        {data.name} - {data.inputAdmission}
                      </span>
                      <span>{data.house}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        "You Don't have any incoming submits."
      )}
    </div>
  );
}
