import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import DashboardContext from "../../../Context/DashboardContext";

export default function Submits() {
  const [events, setEvents] = useState([]);
  const { socket } = useContext(DashboardContext);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Example of extracting a specific query parameter
    const getData = async function () {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data);
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      }
    };
    getData();

    // You can perform actions based on the eventId or other query parameters here
  }, []);

  const handlePoppup = (data) => {
    console.log(data);
    setSelectedEvent(data);
  };

  const handleSubmit = async (data) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v1/event/${data._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Event Submits</h1>
      <p>Submit Event</p>
      {events.map((data, index) => (
        <div
          className="event cursor-pointer p-4 bg-main"
          key={index}
          onClick={() => {
            handlePoppup(data);
          }}
        >
          {data.name}
          {data.description}
        </div>
      ))}
      {selectedEvent && (
        <form onSubmit={handleSubmit(data)}>
          {selectedEvent.places.map((data, index) => {
            <div className="score__submit flex-row" key={index}>
              <span>{data.place}</span>
              <input type="number" placeholder="Admision Number" />
              <input type="number" placeholder="House" />
            </div>;
          })}
        </form>
      )}
    </div>
  );
}
