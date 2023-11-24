import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import DashboardContext from "../../../Context/DashboardContext";

export default function Submits() {
  const [events, setEvents] = useState([]);
  const { socket } = useContext(DashboardContext);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isPopUp, setIsPopUp] = useState(false);
  const [admissionNumbers, setAdmissionNumbers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handlePopup = (data) => {
    setSelectedEvent(data);
    setIsPopUp(true);
    setAdmissionNumbers(
      Array(data.places.length).fill({ inputSubmission: 0, place: "" })
    );
  };

  const closePopup = () => {
    setIsPopUp(false);
    setSelectedEvent({});
    setAdmissionNumbers([]);
  };

  const handleInputChange = (index, value, place) => {
    setAdmissionNumbers((prevAdmissions) => {
      const updatedAdmissions = [...prevAdmissions];
      updatedAdmissions[index] = {
        ...updatedAdmissions[index],
        inputSubmission: parseInt(value), // Ensure the input is parsed as a number
        place: place,
      };
      return updatedAdmissions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v1/event/${selectedEvent._id}`,
        {
          submitdata: { places: admissionNumbers },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setAdmissionNumbers([]);
      setIsPopUp(false);
      setSelectedEvent({});
      // Add logic to handle the response if needed
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheck = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v1/event/${selectedEvent._id}/check`,
        {
          inputMarks: selectedEvent.inputMarks, // Add other data as needed
          inputSubmission: admissionNumbers,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      // Add logic to handle the response if needed
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
            handlePopup(data);
          }}
        >
          {data.name}
          {data.description}
        </div>
      ))}
      {isPopUp && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            <h2>Submit Event {selectedEvent.name}</h2>
            <form onSubmit={handleSubmit}>
              {selectedEvent.places &&
                selectedEvent.places.map((place, index) => (
                  <div className="score__submit flex-row-aro" key={index}>
                    <span>{place.place} Place</span>
                    <input
                      type="number"
                      placeholder="Admission Number"
                      value={admissionNumbers[index]?.inputSubmission || ""}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value, place.place)
                      }
                    />
                  </div>
                ))}

              <div className="buttons flex-row-eve g-3">
                <button type="button" onClick={handleCheck}>
                  Check
                </button>
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
