import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import Button from "../../../UI/Button/Button";
import { useSnackbar } from "notistack";
import "./Types.css";
import Loader from "../../../../Components/Loader/Loader";
import { TextField } from "@mui/material";
import {
  State as MainState,
  Action as MainAction,
  EventTypes,
} from "../Events";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TypesProps extends MainState {
  dispatch: React.Dispatch<MainAction>; // Define the type for dispatch as needed
}

interface Progress {
  progressTo: string;
  progress: boolean;
}

const Types: React.FC<TypesProps> = ({
  eventTypes,
  dispatch: dispatchEvent,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedEventType, setEditedEventType] = useState<EventTypes>({
    _id: "",
    name: "",
    options: null,
  });
  const [createForm, setCreateForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>({
    progressTo: "",
    progress: false,
  });
  const [eventOptions, setEventOptions] = useState<any[]>([]);

  const handleInputChanges = (
    field: string,
    value: string,
    index?: number
  ): void => {
    if (field === "option" && index !== undefined) {
      setEditedEventType((prev) => {
        const updatedOptions = [...(prev.options ? prev.options : [])];

        // If value is an empty string, it indicates removal
        if (value === "") {
          updatedOptions.splice(index, 1); // Remove the option at the specified index
        } else {
          updatedOptions[index] = { ...updatedOptions[index], option: value };
        }

        return {
          ...prev,
          options: updatedOptions,
        };
      });
    } else {
      setEditedEventType((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setCreateForm(false);
    setEditedEventType({ ...(eventTypes ? eventTypes : [])[index] });
  };

  const handleOk = async (e) => {
    e.preventDefault();
    if (editedEventType) {
      await handleUpdateEventType(editedEventType);
      setEditedEventType({
        name: "",
        options: [],
        _id: "",
      });
      setEventOptions([]);
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setCreateForm(false);
    setEditedEventType({
      name: "",
      options: [],
      _id: "",
    });
    setEventOptions([]);
  };

  const setCreateNew = () => {
    setCreateForm(true);
    setEditIndex(null);
    setEditedEventType({
      name: "",
      options: [],
      _id: "",
    });
    setEventOptions([]);
  };

  const handleCreateEventType = async (
    e: React.FormEvent<HTMLFormElement>,
    updatedEventTypes: EventTypes
  ): Promise<void> => {
    setProgress({ progressTo: "create", progress: true });
    e.preventDefault();
    try {
      const eventOptions =
        updatedEventTypes.options &&
        updatedEventTypes.options.map((option) => ({
          option: `${option.option}`,
        }));

      const token = Cookies.get("token");
      const cratingEventTypes = {
        name: updatedEventTypes.name,
        options: eventOptions,
      };
      const response = await axios.put(
        `${config.APIURI}/api/v${config.Version}/event-types`,
        {
          eventTypes: cratingEventTypes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        setEditIndex(null);
        setCreateForm(false);
        setEditedEventType({
          name: "",
          options: [],
          _id: "",
        });
        setEventOptions([]);
        dispatchEvent({
          type: "setEventTypes",
          payload: eventTypes
            ? [...eventTypes, response.data.evenType]
            : [response.data.evenType],
        });

        enqueueSnackbar("Event Type created successfully.", {
          variant: "success",
        });
      }
      setProgress({
        progressTo: "",
        progress: false,
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      setProgress({
        progressTo: "",
        progress: false,
      });
      console.error("Error creating eventType:", error);
    }
  };

  const handleUpdateEventType = async (updatedData: EventTypes) => {
    try {
      setProgress({ progressTo: "update", progress: true });
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${config.APIURI}/api/v${config.Version}/event-types/${updatedData._id}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        console.log(eventTypes);
        const updatedEventTypes = (eventTypes ? eventTypes : []).map(
          (eventType) =>
            eventType._id === updatedData._id ? updatedData : eventType
        );
        setEditIndex(null);
        setCreateForm(false);
        setEditedEventType({
          name: "",
          options: [],
          _id: "",
        });
        setEventOptions([]);
        dispatchEvent({
          type: "setEventTypes",
          payload: updatedEventTypes,
        });
        enqueueSnackbar("Event Type updated successfully.", {
          variant: "success",
        });
      }
      setProgress({
        progressTo: "",
        progress: false,
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      setProgress({
        progressTo: "",
        progress: false,
      });

      console.error("Error updating eventType:", error);
    }
  };

  const handleRemoveEventType = async (eventID: string) => {
    setProgress({ progressTo: "remove" + eventID, progress: true });

    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v${config.Version}/event-types/${eventID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        const updatedEventType = (eventTypes ? eventTypes : []).filter(
          (eventType) => eventType._id !== eventID
        );
        setEditIndex(null);
        setCreateForm(false);
        setEditedEventType({
          name: "",
          options: [],
          _id: "",
        });
        setEventOptions([]);
        dispatchEvent({
          type: "setEventTypes",
          payload: updatedEventType,
        });
        enqueueSnackbar("Event Type removed successfully.", {
          variant: "success",
        });
      }
      setProgress({
        progressTo: "",
        progress: false,
      });
    } catch (error) {
      setProgress({
        progressTo: "",
        progress: false,
      });
      if (error.response && error.response.data && error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error removing eventType:", error);
    }
  };

  const createOption = () => {
    setEventOptions((prevOptions) => [...prevOptions, { option: "" }]);
    // Add a option and value = empty for the option
  };
  const removeEventOption = (indexToRemove) => {
    setEventOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter(
        (_, index) => index !== indexToRemove
      );
      return updatedOptions;
    });
  };

  // Function to remove an option from editedEventType.options
  const removeEditedOption = (indexToRemove) => {
    setEditedEventType((prev) => {
      const updatedOptions = (prev.options ? prev.options : []).filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prev,
        options: updatedOptions,
      };
    });
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
                    handleCreateEventType(e, editedEventType); // Pass event and editedEventType to handleCreateEventType
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
                      <div className="event_types g-4 flex-col">
                        {eventOptions.map((data, index) => (
                          <div className="flex-row position-relative">
                            <TextField
                              fullWidth
                              id="option"
                              type="text"
                              label={`Option ${index + 1}`}
                              key={index}
                              onChange={(e) => (
                                e.preventDefault(),
                                handleInputChanges(
                                  "option",
                                  e.target.value,
                                  index
                                )
                              )}
                              required
                            />
                            <Button
                              onClick={() => {
                                removeEventOption(index); // Pass the index of the option to remove
                              }}
                              variant="text"
                              color="error"
                              className="position-absolute"
                              style={{ right: 0, top: 0, bottom: 0 }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            createOption();
                          }}
                          variant="contained"
                        >
                          Create Option
                        </Button>
                      </div>
                    </div>
                    <div className="eventTypes_submit_btn m-auto p-t-4">
                      <Button
                        loading={
                          progress &&
                          progress.progressTo === "create" &&
                          progress.progress
                            ? true
                            : false
                        }
                        type="submit"
                        variant="contained"
                      >
                        Create
                      </Button>
                      <Button
                        className="houses_submit_btn"
                        color="primary"
                        variant="text"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            {eventTypes && eventTypes.length ? (
              eventTypes.map((eventType, index) => (
                <div className="event__container" key={index}>
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
                              (editedEventType && editedEventType.name) ||
                              eventType.name ||
                              ""
                            }
                            onChange={(e) => (
                              e.preventDefault(),
                              handleInputChanges("name", e.target.value)
                            )}
                            required
                          />
                          <div className="event_types flex-col g-3">
                            {editedEventType.options &&
                              editedEventType.options.map((data, index) => (
                                <div className="flex-row position-relative">
                                  <TextField
                                    fullWidth
                                    id="option"
                                    type="text"
                                    value={(data && data.option) || ""}
                                    label={`Option ${index + 1}`}
                                    key={index}
                                    onChange={(e) => (
                                      e.preventDefault(),
                                      handleInputChanges(
                                        "option",
                                        e.target.value,
                                        index
                                      )
                                    )}
                                    required
                                  />
                                  <Button
                                    onClick={() => {
                                      removeEditedOption(index); // Pass the index of the option to remove
                                    }}
                                    variant="text"
                                    color="error"
                                    className="position-absolute"
                                    style={{ right: 0, top: 0, bottom: 0 }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              ))}
                            <Button
                              onClick={() => {
                                setEditedEventType((prev) => ({
                                  ...prev,
                                  options: [
                                    ...(prev.options || []), // Preserve previous options
                                    { option: "", _id: "" }, // Add a new empty option
                                  ],
                                }));
                              }}
                              variant="contained"
                            >
                              Create Option
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span
                            onClick={() => handleEdit(index)}
                            className="font-md p-3 bg-primary rounded-md font-weight-500"
                          >
                            Name: {eventType.name}
                          </span>
                          {eventType.options && (
                            <div
                              className="types flex-row g-2"
                              onClick={() => handleEdit(index)}
                              style={{ overflow: "auto" }}
                            >
                              {eventType.options.map((option, index) => (
                                <span
                                  key={index}
                                  className="type p-3 bg-primary rounded"
                                >
                                  {option.option}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="event__buttons buttons flex-row-center m-auto g-4">
                      <Button
                        loading={
                          progress.progressTo === "remove" + eventType._id &&
                          progress.progress
                        }
                        className="houses_submit_btn"
                        color="error"
                        variant="outlined"
                        onClick={() => handleRemoveEventType(eventType._id)}
                      >
                        Remove
                      </Button>

                      {editIndex === index ? (
                        <>
                          <Button
                            loading={
                              progress.progressTo === "update" &&
                              progress.progress
                            }
                            className="houses_submit_btn"
                            variant="contained"
                            type="submit"
                          >
                            OK
                          </Button>
                          <Button
                            className="houses_submit_btn"
                            color="primary"
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
              ))
            ) : (
              <div className="empty_houses">
                <h2>{"We can't find any types"}</h2>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Types;
