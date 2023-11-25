import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import DashboardContext from "../../../Context/DashboardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function Submits() {
  const [events, setEvents] = useState([]);
  const { socket } = useContext(DashboardContext);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [submitedEvent, setSubmitedEvent] = useState({});
  const [isPopUp, setIsPopUp] = useState(false);
  const [admissionNumbers, setAdmissionNumbers] = useState([]);
  const [error, setError] = useState([]);

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
      Array(data.places.length).fill({ inputAdmission: 0, place: "" })
    );
  };

  const closePopup = () => {
    setIsPopUp(false);
    setSelectedEvent({});
    setAdmissionNumbers([]);
    setSubmitedEvent({});
  };

  const handleInputChange = (index, value, place) => {
    setAdmissionNumbers((prevAdmissions) => {
      const updatedAdmissions = [...prevAdmissions];
      updatedAdmissions[index] = {
        ...updatedAdmissions[index],
        inputAdmission: parseInt(value), // Ensure the input is parsed as a number
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
      if (response.data.error) {
        return setError(response.data.data);
      }
      setSelectedEvent(null);
      setSubmitedEvent(response.data.submitedEvent);
      setAdmissionNumbers([]);

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
            {selectedEvent ? (
              <>
                <h2>Submit Event {selectedEvent.name}</h2>
                <form onSubmit={handleSubmit}>
                  {selectedEvent.places &&
                    selectedEvent.places.map((place, index) => (
                      <div
                        className="score__submit flex-row-aro position-relative"
                        key={index}
                      >
                        <span>{place.place} Place</span>
                        <input
                          type="number"
                          placeholder="Admission Number"
                          value={admissionNumbers[index]?.inputAdmission || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              e.target.value,
                              place.place
                            )
                          }
                        />

                        {error.find((err) => err.place === place.place) ? (
                          <span
                            title={
                              error.find((err) => err.place === place.place)
                                .message
                            }
                            className="position-absolute"
                            style={{ right: 0 }}
                          >
                            <FontAwesomeIcon icon={faCircleExclamation} />
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}

                  <div className="buttons flex-row-eve g-3">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </>
            ) : submitedEvent ? (
              <>
                <h2>{submitedEvent.name}</h2>
                <div className="submitted_content">
                  {submitedEvent.places.map((data, index) => (
                    <span className="flex-row-bet" key={index}>
                      <span className="place">{data.place}</span>
                      <span className="place__score">{data.minimumMarks}</span>
                      <span className="place__name">
                        {data.name} - {data.inputAdmission}
                      </span>
                      <span className="place__house">{data.house}</span>
                    </span>
                  ))}
                  <span>
                    If you are not satisfied with these data? contact admin.
                  </span>
                  <div className="buttons flex-row-eve g-3">
                    <button onClick={closePopup}>Ok</button>
                  </div>
                </div>
              </>
            ) : (
              "Undefined..."
            )}
          </div>
        </div>
      )}
    </div>
  );
}
