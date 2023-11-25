import { useContext, useEffect, useState } from "react";
import DashboardContext from "../../../Context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../../config";

export default function Approves() {
  const { socket } = useContext(DashboardContext);
  const [incomingSubmits, setIncomingSubmits] = useState([]);
  const [approved, setApproved] = useState([]);
  useEffect(() => {
    const handleSocketMessage = (message) => {
      if (message.type === "eventSubmits") {
        // Check if the incoming submit isn't already present
        const isNotDuplicate = !incomingSubmits.some(
          (submit) => submit._id === message.payload._id
        );
        if (isNotDuplicate) {
          setIncomingSubmits((prev) => [{ ...message.payload }, ...prev]);
        }
      } else if (message.type === "eventApproves") {
        // Similar logic for approved events
        if (message.payload.type === "approved") {
          const approvedEvent = { ...message.payload.event }; // Copy the approved event

          const isNotDuplicate = !approved.some(
            (approve) => approve._id === message.payload._id
          );
          if (isNotDuplicate) {
            setApproved((prev) => [{ ...message.payload.event }, ...prev]);
          }
          setIncomingSubmits((prev) =>
            prev.filter((submit) => submit._id !== approvedEvent._id)
          );
        }
        if (message.payload.type === "reject") {
          setIncomingSubmits((prev) =>
            prev.filter((submit) => submit._id !== message.payload.event)
          );
        }
      }
    };

    socket.on("server-message", handleSocketMessage);

    return () => {
      socket.off("server-message", handleSocketMessage);
    };
  }, [socket, incomingSubmits, approved]);

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

  useEffect(function () {
    const getData = async function () {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v1/events/approved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.events);
        setApproved(response.data.events);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const approveEvent = async function (eventId) {
    try {
      const token = Cookies.get("token");
      console.log(token);
      const response = await axios.post(
        `${config.APIURI}/api/v1/event/approve/${eventId}`,
        {
          token: token,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const rejectEvent = async function (eventId) {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v1/event/reject/${eventId}`,
        {
          token: token,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="approve__submits">
      {incomingSubmits ? (
        <div className="incoming_submits">
          <h1 className="font-weight-600 font-lg">Incoming Submits</h1>
          <div className="incoming_submits__container">
            {incomingSubmits.map((data, index) => (
              <div key={index} className="incoming_submit grid-common p-4 m-3">
                <div className="event_name text-center font-weight-600 font-md">
                  {data.name}
                </div>
                <div className="event_places table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <th>Place</th>
                        <th>Winner Name</th>
                        <th>Admision No</th>
                        <th>Winner House</th>
                      </tr>
                      {data.places && data.places.map((place, placeIndex) => (
                        <tr key={placeIndex} className="submitted__places">
                          <td>{place.place}</td>
                          <td>{place.name}</td>
                          <td>{place.inputAdmission}</td>
                          <td>{place.house}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="buttons flex-row-center g-4">
                  <button
                    onClick={() => {
                      approveEvent(data._id);
                    }}
                    className="submit p-t-3 p-b-3 p-l-4 p-r-4 bg-main rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectEvent(data._id);
                    }}
                    className="reject p-t-3 p-b-3 p-l-4 p-r-4 bg-scarlet-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        "You Don't have any incoming submits."
      )}
      {approved ? (
        <div className="approved">
          <h1 className="font-weight-600 font-lg">Approved</h1>
          <div className="incoming_submits__container">
            {approved.map((data, index) => (
              <div key={index} className="incoming_submit grid-common p-4 m-3">
                <div className="event_name text-center font-weight-600 font-md">
                  {data.name}
                </div>
                <div className="event_places table-responsive">
                  <table>
                    <tbody>
                      <tr>
                        <th>Place</th>
                        <th>Winner Name</th>
                        <th>Admision No</th>
                        <th>Winner House</th>
                      </tr>
                      {data.places.map((place, placeIndex) => (
                        <tr key={placeIndex} className="submitted__places">
                          <td>{place.place}</td>
                          <td>{place.name}</td>
                          <td>{place.inputAdmission}</td>
                          <td>{place.house}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        "You Don't have any Approved submits."
      )}
    </div>
  );
}