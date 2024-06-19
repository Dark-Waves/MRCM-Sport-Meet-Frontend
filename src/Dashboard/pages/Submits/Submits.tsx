import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./Submits.css";
import { config } from "../../utils/config";
import DashboardContext from "../../../context/DashboardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Button from "../../UI/Button/Button";
import {
  InputBase,
  TextField,
  styled,
  alpha,
  Autocomplete,
  Checkbox,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useSnackbar } from "notistack";
import PopUp from "../../UI/PopUp/PopUp";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Loader from "../../../Components/Loader/Loader";
import { decrypt } from "../../../utils/aes";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
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

interface Place {
  place: number;
  minimumMarks: number;
  inputMarks: number;
  inputID: string;
  house: string;
  name: string;
}

interface EventOptions {
  option: string;
  selection: string;
  _id: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  types: EventOptions[];
  places: Place[];
  state: string;
  inputType?: string;
}

interface AdmissionNumbers {
  inputID: number | string;
  inputType: string;
  place: number;
}

interface Errors {
  message: string;
  place: number;
}

interface House {
  Name: string;
  _id: string;
  // Define other house properties
}

const Submits: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { socket }: { socket: any | null } = useContext(DashboardContext);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [submitedEvent, setSubmitedEvent] = useState<Event | null>(null);
  const [isPopUp, setIsPopUp] = useState<boolean>(false);
  const [admissionNumbers, setAdmissionNumbers] = useState<AdmissionNumbers[]>(
    []
  );
  const [error, setError] = useState<Errors[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<boolean>(false);
  const [houses, setHouses] = useState<House[]>([]);
  console.log(houses);
  // const allStates = [...new Set(events.map((event) => event.state))];
  const allStates = [
    ...new Set(events.map((event) => event.state)),
    ...events.reduce((acc: string[], curr) => {
      // Explicitly specify the type of acc as string[]
      curr.types.forEach((type) => {
        if (!acc.includes(type.selection)) {
          acc.push(type.selection);
        }
      });
      return acc;
    }, []),
  ];

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
      if (message.type === "eventCreated") {
        setEvents((prev) => [...prev, message.payload]);
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
        const { data } = await axios.get(
          `${config.APIURI}/api/v${config.Version}/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/houses`
        );
        if (response.data && response.data.HouseData) {
          setHouses(decrypt(response.data.HouseData));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchHouses(); // Fetch data when Autocomplete is opened
  }, []);

  const handlePopup = (data) => {
    setSelectedEvent(data);
    setIsPopUp(true);
    setAdmissionNumbers(
      Array(data.places.length).fill({ inputID: 0, place: "" })
    );
  };

  const closePopup = () => {
    setIsPopUp(false);
    setSelectedEvent(null);
    setAdmissionNumbers([]);
    setSubmitedEvent(null);
  };

  const handleInputChange = (
    index: number,
    value: string,
    place: number,
    inputType: string | undefined
  ) => {
    setAdmissionNumbers((prevAdmissions) => {
      const updatedAdmissions = [...prevAdmissions];
      if (inputType === "MemberID") {
        // Use house.memberId
        updatedAdmissions[index] = {
          ...updatedAdmissions[index],
          inputID: parseInt(value), // Ensure the input is parsed as a number
          place: place,
          inputType: inputType,
        };
      } else if (inputType === "HouseName") {
        // Use house._id
        updatedAdmissions[index] = {
          ...updatedAdmissions[index],
          inputID: value, // Assuming value is already a string
          place: place,
          inputType: inputType,
        };
      }
      return updatedAdmissions;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Errors[] = [];
    for (const place of admissionNumbers) {
      if (!place.inputID) {
        errors.push({ message: "Fill the input fields", place: place.place });
      }
      continue;
    }
    if (errors.length > 0) {
      console.log(errors);
      return setError(errors);
    }
    try {
      setProgress(true);
      if (!selectedEvent) return;
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/event/${selectedEvent._id}`,
        {
          submitdata: { places: admissionNumbers },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.error) {
        setProgress(false);
        console.log(response.data.data);
        for (const message of response.data.data) {
          enqueueSnackbar(`${message.message} - place ${message.place}`, {
            variant: "error",
          });
        }
        return setError(response.data.data);
      }
      enqueueSnackbar(`Event Submitted successful.`, {
        variant: "success",
      });
      setSelectedEvent(null);
      setSubmitedEvent(response.data.submitedEvent);
      setAdmissionNumbers([]);

      // Add logic to handle the response if needed
    } catch (error) {
      enqueueSnackbar(`Event Submit Error`, {
        variant: "error",
      });
      setProgress(false);
      console.log(error);
    } finally {
      setProgress(false);
    }
  };

  const searchFilteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const filteredEvents =
  //   selectedStates.length > 0
  //     ? searchFilteredEvents.filter(
  //         (event) =>
  //           selectedStates.includes(event.state) ||
  //           event.types.some((type) => selectedStates.includes(type.selection))
  //       )
  //     : searchFilteredEvents;

  const filteredEvents =
    selectedStates.length > 0
      ? searchFilteredEvents.filter((event) =>
        selectedStates.every(
          (state) =>
            event.state === state ||
            event.types.some((type) => type.selection === state)
        )
      )
      : searchFilteredEvents;

  return (
    <div className="event-submits position-relative h-full">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="top-content flex-row-bet">
            <h1 className="font-lg font-weight-600">Event Submits</h1>
            <div className="searchbar flex-row-bet g-3">
              <div className="searc">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    color="primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </div>
              <div className="filter w-50">
                <Autocomplete
                  style={{ minWidth: "200px", width: "100%" }}
                  multiple
                  id="checkboxes-tags-demo"
                  options={allStates}
                  disableCloseOnSelect
                  value={selectedStates}
                  onChange={(event, newValue) => setSelectedStates(newValue)}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter by State"
                      placeholder="Select States"
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  )}
                />
              </div>
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
                      <span className="font-weight-600">
                        {data.description}
                      </span>
                    </div>
                  )}

                  {data.types && (
                    <div className="event-types m-b-4 font-weight-500 font-md">
                      Event Types:{" "}
                      {data.types.map((type, index) => (
                        <span className="font-weight-600 p-3">
                          {type.selection}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="button-container">
                    <Button
                      variant="contained"
                      disabled={
                        data.state === "pending" || data.state === "approved"
                      }
                      onClick={
                        data.state === "rejected" ||
                          data.state === "notSubmitted"
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
                </div>
              </div>
            ))}
          </div>
          {isPopUp && (
            <PopUp closePopup={closePopup}>
              {selectedEvent ? (
                <>
                  <h2>{selectedEvent.name}</h2>
                  <form onSubmit={handleSubmit} className="p-t-3">
                    {selectedEvent.inputType === "MemberID"
                      ? selectedEvent.places &&
                      selectedEvent.places.map((place, index) => (
                        <div
                          className="m-t-4 score__submit flex-row-aro position-relative"
                          key={index}
                        >
                          <TextField
                            type="number"
                            label={`${place.place} Place`}
                            placeholder="House Member ID"
                            value={admissionNumbers[index]?.inputID || ""}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                e.target.value,
                                place.place,
                                selectedEvent.inputType
                              )
                            }
                            error={
                              error.find((err) => err.place === place.place)
                                ? true
                                : false
                            }
                          />

                          {error &&
                            error.find((err) => err.place === place.place) ? (
                            <span
                              title={
                                error &&
                                error.find((err) => err.place === place.place)
                                  ?.message // Added '?'
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
                      ))
                      : selectedEvent.inputType === "HouseName"
                        ? selectedEvent.places &&
                        selectedEvent.places.map((place, index) => (
                          <div
                            className="m-t-4 score__submit flex-row-aro position-relative"
                            key={index}
                          >
                            {/* <TextField
                              type="number"
                              label={`${place.place} Place`}
                              placeholder="House Name"
                              value={
                                admissionNumbers[index]?.inputID || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  e.target.value,
                                  place.place
                                )
                              }
                              error={
                                error.find((err) => err.place === place.place)
                                  ? true
                                  : false
                              }
                            /> */}
                            <FormControl fullWidth>
                              <InputLabel id="event-type-select-label">
                                Submit Input Type
                              </InputLabel>
                              <Select
                                required
                                labelId="event-type-select-label"
                                id="event-type-select"
                                value={admissionNumbers[index]?.inputID || ""}
                                label="Submit Input Type"
                                onChange={(e) => {
                                  handleInputChange(
                                    index,
                                    String(e.target.value), // Convert to string explicitly
                                    place.place,
                                    selectedEvent.inputType
                                  );
                                }}
                                error={
                                  error.find((err) => err.place === place.place)
                                    ? true
                                    : false
                                }
                              >
                                {houses.map((data, index) => (
                                  <MenuItem key={index} value={data._id}>
                                    {data.Name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {error &&
                              error.find((err) => err.place === place.place) ? (
                              <span
                                title={
                                  error &&
                                  error.find((err) => err.place === place.place)
                                    ?.message // Added '?'
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
                        ))
                        : "Submit Type Not Found"}

                    <div className="buttons flex-row-eve g-3 m-4">
                      <Button
                        loading={progress}
                        type="submit"
                        color="info"
                        variant="contained"
                      >
                        submit
                      </Button>
                    </div>
                  </form>
                </>
              ) : submitedEvent ? (
                <>
                  <div className="submitted_content">
                    <h2 className="m-b-4">{submitedEvent.description}</h2>
                    <table>
                      <tbody>
                        <tr>
                          <th>Place</th>
                          <th>Score</th>
                          {submitedEvent.inputType === "MemberID" ? (
                            <>
                              <th>Winner Name</th>
                              <th>Admision No</th>
                            </>
                          ) : (
                            ""
                          )}
                          <th>Winner House</th>
                        </tr>
                        {submitedEvent.places &&
                          submitedEvent.places.map((place, placeIndex) => (
                            <tr key={placeIndex} className="submitted__places">
                              <td>{place.place}</td>
                              <td>{place.minimumMarks}</td>
                              {submitedEvent.inputType === "MemberID" ? (
                                <>
                                  <td>{place.name}</td>
                                  <td>{place.inputID}</td>
                                </>
                              ) : (
                                ""
                              )}

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
        </>
      )}
    </div>
  );
};
export default Submits;
