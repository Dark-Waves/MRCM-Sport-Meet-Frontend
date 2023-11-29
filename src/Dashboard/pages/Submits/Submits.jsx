import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Submits.css";
import { config } from "../../utils/config";
import DashboardContext from "../../../context/DashboardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faCircleCheck,
  faCircleExclamation,
  faCircleXmark,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../UI/Button/Button";
import {
  Input,
  InputBase,
  TextField,
  styled,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Checkbox,
} from "@mui/material";
import { useSnackbar } from "notistack";
import PopUp from "../../UI/PopUp/PopUp";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Submits() {
  const [events, setEvents] = useState([]);
  const { socket } = useContext(DashboardContext);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [submitedEvent, setSubmitedEvent] = useState({});
  const [isPopUp, setIsPopUp] = useState(false);
  const [admissionNumbers, setAdmissionNumbers] = useState([]);
  const [error, setError] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const allStates = [...new Set(events.map((event) => event.state))];
  const [selectedStates, setSelectedStates] = useState([]);

  useEffect(() => {
    const handleSocketMessage = (message) => {
      if (message.type === "eventApproves") {
        // Assuming event ID is sent in payload
        if (message.payload.type === "approved") {
          const eventId = message.payload.event._id;
          enqueueSnackbar(`event ${message.payload.event.name} approved`, {
            variant: "success",
          });
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === eventId ? { ...event, state: "approved" } : event
            )
          );
        } else if (message.payload.type === "reject") {
          const eventId = message.payload.event;
          const event = events.find((data) => data._id === eventId);
          const eventName = event ? event.name : "";
          enqueueSnackbar(`event ${eventName} rejected`, {
            variant: "error",
          });
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === eventId ? { ...event, state: "rejected" } : event
            )
          );
        }
      }
      if (message.type === "eventSubmits") {
        const eventId = message.payload._id; // Assuming event ID is sent in payload
        enqueueSnackbar(`event ${message.payload.name} currently pending`, {
          variant: "info",
        });
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, state: "pending" } : event
          )
        );
      }
    };

    socket.on("server-message", handleSocketMessage);

    return () => {
      socket.off("server-message", handleSocketMessage);
    };
  }, [socket, enqueueSnackbar, events]);

  console.log(events);
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
        console.log(response.data.data);
        for (const message of response.data.data) {
          enqueueSnackbar(`${message.message} - place ${message.place}`, {
            variant: "error",
          });
        }
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

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
    // selectedStates.includes(event.state)
  );

  return (
    <div className="event-submits">
      <div className="top-content flex-row-bet">
        <h1 className="font-lg font-weight-600">Event Submits</h1>
        <div className="searchbar flex-row g-3">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={allStates}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by State"
                placeholder="Select States"
              />
            )}
          />
        </div>
      </div>
      <div className="events-to-submit flex-col g-5 m-t-4 content-grid-one">
        {filteredEvents.map((data, index) => (
          <div className={`event grid-common bg-main`} key={index}>
            <div className="event-submit-content p-4 flex-col-center g-3">
              {data.name && (
                <div className="event-name font-weight-500 font-md">
                  Event Name:{" "}
                  <span className="font-weight-600">{data.name}</span>
                </div>
              )}
              {data.description && (
                <div className="event-des m-b-4 font-weight-500 font-md">
                  Event Descriptions:{" "}
                  <span className="font-weight-600">{data.description}</span>
                </div>
              )}
              {/* {data.state === "approved" ? (
              <FontAwesomeIcon title={data.state} icon={faCircleCheck} />
            ) : data.state === "rejected" ? (
              <FontAwesomeIcon title={data.state} icon={faCircleXmark} />
            ) : data.state === "pending" ? (
              <FontAwesomeIcon title={data.state} icon={faCircle} />
            ) : (
              <FontAwesomeIcon title={data.state} icon={faHourglass} />
            )} */}
              <div className="button-container">
                <Button
                  variant="contained"
                  disabled={
                    data.state === "pending" || data.state === "approved"
                  }
                  onClick={
                    data.state === "rejected" || data.state === "notSubmitted"
                      ? () => handlePopup(data)
                      : undefined
                  }
                >
                  {data.state === "approved"
                    ? "Approved"
                    : data.state === "rejected"
                    ? "Try again"
                    : data.state === "pending"
                    ? "Submitted"
                    : "Enter Event Winners Data"}
                </Button>
              </div>
            </div>{" "}
          </div>
        ))}
      </div>
      {isPopUp && (
        <PopUp closePopup={closePopup}>
          {selectedEvent ? (
            <>
              <h2>{selectedEvent.name}</h2>
              <form onSubmit={handleSubmit} className="p-t-3">
                {selectedEvent.places &&
                  selectedEvent.places.map((place, index) => (
                    <div
                      className="m-t-4 score__submit flex-row-aro position-relative"
                      key={index}
                    >
                      <TextField
                        type="number"
                        label={`${place.place} Place`}
                        placeholder="Admission Number"
                        value={admissionNumbers[index]?.inputAdmission || ""}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value, place.place)
                        }
                        error={error.find((err) => err.place === place.place)}
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

                <div className="buttons flex-row-eve g-3 m-4">
                  <Button type="submit" btnType="info" variant="contained">
                    submit
                  </Button>
                </div>
              </form>
            </>
          ) : submitedEvent ? (
            <>
              <div className="submitted_content">
                <h2 className="m-b-4">{submitedEvent.name}</h2>
                <table>
                  <tbody>
                    <tr>
                      <th>Place</th>
                      <th>Score</th>
                      <th>Winner Name</th>
                      <th>Admision No</th>
                      <th>Winner House</th>
                    </tr>
                    {submitedEvent.places &&
                      submitedEvent.places.map((place, placeIndex) => (
                        <tr key={placeIndex} className="submitted__places">
                          <td>{place.place}</td>
                          <td>{place.minimumMarks}</td>
                          <td>{place.name}</td>
                          <td>{place.inputAdmission}</td>
                          <td>{place.house}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <span>
                  If you are not satisfied with these data? contact admin.
                </span>
                <div className="buttons flex-row-eve g-3 m-t-4">
                  <Button variant="contained" onClick={closePopup}>
                    Ok
                  </Button>
                </div>
              </div>
            </>
          ) : (
            "Undefined..."
          )}
        </PopUp>
      )}
    </div>
  );
}
