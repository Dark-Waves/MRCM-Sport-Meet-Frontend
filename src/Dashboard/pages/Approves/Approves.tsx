import React, { useContext, useEffect, useState } from "react";
import DashboardContext from "../../../context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../../config";
import Loader from "../../../Components/Loader/Loader";
import Button from "../../UI/Button/Button";
import { CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";

interface SubmitData {
  _id: string;
  name: string;
  places: Array<{
    place: string;
    name: string;
    inputID: string;
    house: string;
    minimumMarks: number;
  }>;
  description: string;
  types: any[];
  state: string;
  inputType: string;
}

export default function Approves() {
  const { socket } = useContext(DashboardContext);
  const [incomingSubmits, setIncomingSubmits] = useState<SubmitData[]>([]);
  const [approved, setApproved] = useState<SubmitData[]>([]);
  const [submitLoaded, setSubmitLoaded] = useState(false);
  const [approveLoaded, setApproveLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approoving, setApprooving] = useState(false);
  const [rejecting, setRejecting] = useState({ state: false, place: "" });
  const { enqueueSnackbar } = useSnackbar();

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

  useEffect(() => {
    if (!submitLoaded) return;
    if (!approveLoaded) return;
    setLoading(false);
  }, [approveLoaded, submitLoaded]);

  useEffect(function () {
    const getData = async function () {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/events/submitted`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.events);
        setIncomingSubmits(response.data.events);
        // Add logic to handle the response if needed
      } catch (error) {
        console.log(error);
      } finally {
        setSubmitLoaded(true);
      }
    };
    getData();
  }, []);

  useEffect(function () {
    const getData = async function () {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/events/approved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.events);
        setApproved(response.data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setApproveLoaded(true);
      }
    };
    getData();
  }, []);

  const approveEvent = async function (eventId) {
    try {
      setApprooving(true);
      const token = Cookies.get("token");
      console.log(token);
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/event/approve/${eventId}`,
        {
          token: token,
        }
      );
      enqueueSnackbar(`Event Approve successful.`, {
        variant: "success",
      });
      console.log(response.data);
    } catch (error) {
      setApprooving(false);
      enqueueSnackbar("Event Approve Error.", {
        variant: "error",
      });
      console.log(error);
    } finally {
      setApprooving(false);
    }
  };
  const rejectEvent = async function (eventId) {
    try {
      setRejecting({ state: true, place: eventId });
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/event/reject/${eventId}`,
        {
          token: token,
        }
      );
      console.log(response.data);
      enqueueSnackbar(`Event Reaject successful.`, {
        variant: "success",
      });
    } catch (error) {
      setRejecting({ state: false, place: eventId });
      enqueueSnackbar("Event Reject Error.", {
        variant: "error",
      });
      console.log(error);
    } finally {
      setRejecting({ state: false, place: eventId });
    }
  };

  const rejectAllEvents = async function () {
    const userConfirmed = window.confirm("Are you sure you want to proceed?");
    if (userConfirmed) {

      try {
        setRejecting({ state: true, place: "all" });
        const token = Cookies.get("token");
        const response = await axios.post(
          `${config.APIURI}/api/v${config.Version}/event/reject/all`,
          {
            token: token,
          }
        );
        console.log(response.data);
        enqueueSnackbar(`Event Reaject successful.`, {
          variant: "success",
        });
      } catch (error) {
        setRejecting({ state: false, place: "all" });
        enqueueSnackbar("Event Reject Error.", {
          variant: "error",
        });
        console.log(error);
      } finally {
        setRejecting({ state: false, place: "all" });
      }
    } else return

  }
  return (
    <div className="approve__submits position-relative h-full">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex-col">
          {incomingSubmits.length ? (
            <div className="incoming_submits">
              <Button loading={rejecting.state && rejecting.place === "all"} disabled={rejecting.state && rejecting.place === "all"} onClick={rejectAllEvents}>
                rejectAllEvents
              </Button>
              <h1 className="font-weight-600 font-lg">Incoming Submits</h1>
              <div className="incoming_submits__container">
                {incomingSubmits.map((data, index) => (
                  <div
                    key={index}
                    className="incoming_submit grid-common p-4 m-3"
                  >
                    <div className="event_name text-center font-weight-600 font-md">
                      {data.name +
                        " - " +
                        data.types.map((type) => type.selection).join(" - ")}
                    </div>
                    <div className="event_places table-responsive">
                      <table>
                        <tbody>
                          <tr>
                            <th>Place</th>
                            <th>Score</th>
                            {data.inputType === "MemberID" ? (
                              <>
                                <th>Winner Name</th>
                                <th>Admision No</th>
                              </>
                            ) : (
                              ""
                            )}
                            <th>Winner House</th>
                          </tr>
                          {data.places &&
                            data.places.map((place, placeIndex) => (
                              <tr
                                key={placeIndex}
                                className="submitted__places"
                              >
                                <td>{place.place}</td>
                                <td>{place.minimumMarks}</td>
                                {data.inputType === "MemberID" ? (
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
                    </div>
                    <div className="buttons flex-row-center g-4">
                      <Button
                        disabled={approoving}
                        loading={approoving}
                        variant="contained"
                        onClick={() => {
                          approveEvent(data._id);
                        }}
                        className="submit p-t-3 p-b-3 p-l-4 p-r-4 bg-main rounded"
                      >
                        Approve
                      </Button>
                      <Button
                        disabled={rejecting.state && rejecting.place === data._id}
                        loading={rejecting.state && rejecting.place === data._id}
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          rejectEvent(data._id);
                        }}
                        className="reject p-t-3 p-b-3 p-l-4 p-r-4 bg-scarlet-1 rounded"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span>You Don't have any incoming submits.</span>
          )}
          {approved.length ? (
            <div className="approved">
              <h1 className="font-weight-600 font-lg">Approved</h1>
              <div className="incoming_submits__container">
                {approved.map((data, index) => (
                  <div
                    key={index}
                    className="incoming_submit grid-common p-4 m-3"
                  >
                    <div className="event_name text-center font-weight-600 font-md">
                      {data.name}
                    </div>
                    <div className="event_places table-responsive">
                      <table>
                        <tbody>
                          <tr>
                            <th>Place</th>
                            {data.inputType === "MemberID" ? (
                              <>
                                <th>Winner Name</th>
                                <th>Admision No</th>
                              </>
                            ) : (
                              ""
                            )}
                            <th>Winner House</th>
                          </tr>
                          {data.places.map((place, placeIndex) => (
                            <tr key={placeIndex} className="submitted__places">
                              <td>{place.place}</td>
                              {data.inputType === "MemberID" ? (
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span>You Don't have any Approved submits.</span>
          )}
        </div>
      )}
    </div>
  );
}
