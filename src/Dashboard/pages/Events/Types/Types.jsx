import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import Input from "../../../UI/Input/Input";
import Button from "../../../UI/Button/Button";
import { useSnackbar } from "notistack";
import "./Types.css";
import Loader from "../../../../Components/Loader/Loader";
import { TextField } from "@mui/material";

export default function Types({
  eventTypes,
  eventData,
  dispatch: dispatchEvent,
}) {
  const [setAllEventTypes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [editIndex, setEditIndex] = useState(null);
  const [editedHouse, setEditedHouse] = useState(null);
  const [createForm, setCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(false);

  const handleInputChanges = (field, value) => {
    setEditedHouse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedHouse({ ...eventTypes[index] });
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (editedHouse) {
      await handleUpdateEventType(editedHouse);
      setEditedHouse(null);
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedHouse(null);
  };

  const setCreateNew = () => {
    setCreateForm(true);
  };

  const handleCreateEventType = async (e, updatedEventTypes) => {
    console.log(updatedEventTypes);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/event-types`,
        { updatedEventTypes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        setCreateForm(false);
        dispatchEvent({
          type: "setEventTypes",
          payload: { ...eventTypes, updatedEventTypes },
        });
        enqueueSnackbar("Event Type created successfully.", {
          variant: "success",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error creating eventType:", error);
    }
  };

  const handleUpdateEventType = async (updatedData) => {
    console.log(updatedData);
    try {
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${config.APIURI}/api/v1/event-types/${updatedData._id}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        console.log(eventTypes);
        const updatedEventTypes = eventTypes.map((eventType) =>
          eventType._id === updatedData._id ? updatedData : eventType
        );
        dispatchEvent({
          type: "setEventTypes",
          payload: updatedEventTypes,
        });
        enqueueSnackbar("Event Type updated successfully.", {
          variant: "success",
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error updating eventType:", error);
    }
  };

  const handleRemoveEventType = async (eventID) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/event-types/${eventID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        const updatedEventType = eventTypes.filter(
          (eventType) => eventType._id !== eventID
        );
        dispatchEvent({
          type: "setEventTypes",
          payload: updatedEventType,
        });
        enqueueSnackbar("Event Type removed successfully.", {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error removing eventType:", error);
    }
  };

  return (
    <div className="event_types__container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="houses_add flex-row m-t-5 p-4 ">
            <Button
              variant="outlined"
              className="m-4 p-4 "
              onClick={setCreateNew}
            >
              Create New
            </Button>
          </div>
          <div className="content-grid-one">
            {createForm && (
              <div className="create_event_type grid-common m-4 flex-col position-relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent default form submission behavior
                    handleCreateEventType(e, editedHouse); // Pass event and editedHouse to handleCreateEventType
                  }}
                  className="inputs w-full"
                >
                  <div className="feild_container flex-col-center p-4 g-3 w-full">
                    <div className="input_fields w-full flex-col g-5">
                      <TextField
                        fullWidth
                        id="name"
                        type="text"
                        label="Name"
                        onChange={(e) => (
                          e.preventDefault(),
                          handleInputChanges("name", e.target.value)
                        )}
                        required
                      />
                    </div>
                    <div className="eventTypes_submit_btn m-auto p-t-4">
                      <Button type="submit" variant="contained">
                        Create
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {eventTypes.length ? (
              <>
                {eventTypes.map((eventType, index) => (
                  <div className="event__container" key={eventType._id}>
                    <form
                      onSubmit={handleOk}
                      className="create_event_type house__content content grid-common m-4 flex-col"
                    >
                      <div className="data-content inputs w-full p-4 g-3">
                        {editIndex === index ? (
                          <>
                            <TextField
                              id="name"
                              type="text"
                              placeholder="Description"
                              value={
                                (editedHouse && editedHouse.name) ||
                                eventType.name ||
                                ""
                              }
                              onChange={(e) => (
                                e.preventDefault(),
                                handleInputChanges("name", e.target.value)
                              )}
                              required
                            />
                          </>
                        ) : (
                          <>
                            <span
                              onClick={() => handleEdit(index)}
                              className="font-md p-3 bg-primary rounded-md font-weight-500"
                            >
                              Name: {eventType.name}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="event__buttons buttons flex-row-center m-auto g-4">
                        <Button
                          className="houses_submit_btn"
                          btnType="error"
                          variant="outlined"
                          onClick={() => handleRemoveEventType(eventType._id)}
                        >
                          Remove
                        </Button>
                        {editIndex === index ? (
                          <>
                            <Button
                              className="houses_submit_btn"
                              variant="contained"
                              type="submit"
                            >
                              OK
                            </Button>
                            <Button
                              className="houses_submit_btn"
                              btnType="primary"
                              variant="text"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="houses_submit_btn"
                            variant="contained"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty_houses">
                <h2>{"We can't find any houses"}</h2>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
