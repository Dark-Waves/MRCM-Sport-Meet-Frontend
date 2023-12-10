import React, { useEffect, useState } from "react";
import { parse } from "papaparse";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import Input from "../../../UI/Input/Input";
import "./AddMembers.css";
import Button from "../../../UI/Button/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button2 from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Loader from "../../../../Components/Loader/Loader";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddMembers({ setAllMembersData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [membersData, setMembersData] = useState([]);
  const [submitErrors, setSubmitErrors] = useState([]);
  const [emptyErrors, setEmptyErrors] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [createNew, setCreateNew] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      parse(file, {
        header: true,
        complete: (parsedData) => {
          const requiredKeys = ["Name", "Grade", "House", "HouseID"];

          const hasRequiredKeys = requiredKeys.every((key) => {
            const foundKey = parsedData.meta.fields.find(
              (field) => field.toLowerCase() === key.toLowerCase()
            );
            return (
              foundKey !== undefined || key.toLowerCase() === "HouseID"
            );
          });

          if (!hasRequiredKeys) {
            enqueueSnackbar(
              "Import a valid data format (Name, Grade, House, HouseID)",
              { variant: "error" }
            );
            return;
          }
          const transformedData = parsedData.data
            .map((entry) => {
              const transformedEntry = {};
              let newKey = "";
              for (const key in entry) {
                if (key === "name") newKey = "Name"; // Convert 'Name' to 'name'
                else if (key === "grade")
                  newKey = "Grade"; // Convert 'Grade' to 'grade'
                else if (key === "house")
                  newKey = "House"; // Convert 'House' to 'house'
                else if (
                  key === "HouseID" ||
                  key === "HouseID" ||
                  key === "HouseID"
                )
                  newKey = "HouseID"; // Preserve 'HouseID' as is
                transformedEntry[newKey] = entry[key];
              }
              return transformedEntry;
            })
            .filter((obj) =>
              Object.values(obj).some((val) => val !== "" && val !== null)
            ); // Filter out objects with at least one non-empty value for any key
          setMembersData(transformedData);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setInProgress(true);
      const emptyIndexes = [];
      const isEmptyRow = membersData.some((member, index) => {
        const isEmpty =
          !member.Name || !member.Grade || !member.House || !member.HouseID;
        if (isEmpty) {
          emptyIndexes.push(index);
        }
        return isEmpty;
      });

      if (isEmptyRow) {
        const emptyErrors = membersData.map((_, index) => {
          return emptyIndexes.includes(index)
            ? {
                message: "Empty fields. Please fill in all required fields.",
                error: true,
              }
            : {
                message: "",
                error: false,
              };
        });

        setEmptyErrors(emptyErrors);
        setInProgress(false);
        console.log(emptyErrors);
        return;
      }
      if (!membersData.length) {
        setInProgress(false);
        return;
      }
      console.log(membersData)
      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/members/add`,
        { members: membersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response)
      if (response.data) {
        setInProgress(false);
      }
      if (response.data.error) {
        setSubmitErrors(response.data.data);
        for (const error of response.data.data) {
          enqueueSnackbar(`${error.message} on ID - ${error.data}`, {
            variant: "error",
          });
        }
        console.log(response.data.data);
      }
      if (response.data.message === "ok") {
        setAllMembersData((prev) => [...prev, ...membersData]);
        console.log(response.data);
        enqueueSnackbar("Successfully imported data.", { variant: "success" });
        setMembersData([]);
        setEmptyErrors([]);
        setEditIndex(null);
        setNewMember({});
        setCreateNew(false);
        setSubmitErrors([]);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // functions
  const handleRemove = (index) => {
    const updatedMembersData = [...membersData];
    updatedMembersData.splice(index, 1);
    setMembersData(updatedMembersData);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEmptyErrors((prevEmptyErrors) => {
      const updatedEmptyErrors = [...prevEmptyErrors];
      updatedEmptyErrors[index] = { message: "", error: false };
      return updatedEmptyErrors;
    });
  };

  const handleOk = (e) => {
    e.preventDefault();
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleInputChanges = (e, index, id) => {
    const { value } = e.target;
    console.log(id);
    console.log(value);
    const updatedMembersData = [...membersData];
    updatedMembersData[index][id] = value;
    console.log(updatedMembersData);
    setMembersData(updatedMembersData);
  };

  const addCreateNew = () => {
    setMembersData([newMember, ...membersData]);
    setCreateNew(false);
    setNewMember({});
  };

  const clearCreateNew = () => {
    setCreateNew(false);
    setNewMember({});
  };

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`${config.APIURI}/api/v1/houses`);
        if (response.data && response.data.HouseData) {
          setHouses(response.data.HouseData); // Set fetched options
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses(); // Fetch data when Autocomplete is opened
  }, []);
  return (
    <div className="member__add">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="member-add-top m-4">
            <Button2
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              color="primary"
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </Button2>

            <div className="addButtons flex-row-center g-4">
              <Button variant="outlined" onClick={() => setCreateNew(true)}>
                Create New
              </Button>
              <Button
                variant="contained"
                disabled={!membersData.length || inProgress}
                onClick={handleSubmit}
              >
                {inProgress ? <CircularProgress size={25} /> : "Submit"}
              </Button>
            </div>
          </div>
          {membersData.length || createNew ? (
            <>
              {createNew && (
                <div>
                  <form
                    onSubmit={addCreateNew}
                    className="content grid-common m-4 flex-col"
                  >
                    <div className="inputs w-full p-4 g-3">
                      <TextField
                        type="number"
                        label="HouseID"
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            HouseID: e.target.value,
                          })
                        }
                        required
                      />
                      <TextField
                        type="text"
                        label="Name"
                        onChange={(e) =>
                          setNewMember({ ...newMember, Name: e.target.value })
                        }
                        required
                      />
                      <TextField
                        type="number"
                        label="Grade"
                        onChange={(e) =>
                          setNewMember({ ...newMember, Grade: e.target.value })
                        }
                        required
                      />

                      <FormControl fullWidth>
                        <InputLabel id="House-select-label">House</InputLabel>
                        <Select
                          labelId="House-select-label"
                          // value={age}
                          id="House"
                          required
                          label="House"
                          onChange={(e) =>
                            setNewMember({
                              ...newMember,
                              House: e.target.value,
                            })
                          }
                        >
                          {houses.map((House, index) => (
                            <MenuItem key={index} value={House.Name}>
                              {House.Name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="buttons flex-row-center g-4">
                      <Button type="submit" variant="contained">
                        OK
                      </Button>
                      <Button btnType="primary" onClick={clearCreateNew}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              {membersData.map((member, index) => (
                <div className="div" key={index}>
                  <form
                    onSubmit={handleOk}
                    className="content grid-common m-4 flex-col position-relative"
                  >
                    <div className="user-content">
                      <div className="data-content inputs w-full p-4 g-3">
                        {editIndex === index ? (
                          <>
                            <TextField
                              id="HouseID"
                              type="number"
                              label="HouseID"
                              value={member.HouseID || ""}
                              onChange={(e) =>
                                handleInputChanges(e, index, "HouseID")
                              }
                              required
                            />
                            <TextField
                              id="Name"
                              type="text"
                              label="Name"
                              value={member.Name || ""}
                              onChange={(e) =>
                                handleInputChanges(e, index, "Name")
                              }
                              required
                            />
                            <TextField
                              id="Grade"
                              type="number"
                              label="Grade"
                              value={member.Grade || ""}
                              onChange={(e) =>
                                handleInputChanges(e, index, "Grade")
                              }
                              required
                            />

                            <FormControl fullWidth>
                              <InputLabel id="House-select-label">
                                House
                              </InputLabel>
                              <Select
                                itemID="House"
                                labelId="House-select-label"
                                value={member.House || ""}
                                id="House"
                                label="House"
                                onChange={(e) =>
                                  handleInputChanges(e, index, "House")
                                }
                              >
                                {houses.map((House, index) => (
                                  <MenuItem key={index} value={House.Name}>
                                    {House.Name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </>
                        ) : (
                          <>
                            <span
                              onClick={() => handleEdit(index)}
                              className="font-md p-3 bg-primary rounded-md font-weight-500"
                            >
                              HouseID: {member.HouseID}
                            </span>
                            <span
                              onClick={() => handleEdit(index)}
                              className="font-md p-3 bg-primary rounded-md font-weight-500"
                            >
                              Name: {member.Name}
                            </span>
                            <span
                              onClick={() => handleEdit(index)}
                              className="font-md p-3 bg-primary rounded-md font-weight-500"
                            >
                              Grade: {member.Grade}
                            </span>
                            <span
                              onClick={() => handleEdit(index)}
                              className="font-md p-3 bg-primary rounded-md font-weight-500"
                            >
                              House: {member.House}
                            </span>
                          </>
                        )}

                        {submitErrors.length > 0 &&
                          submitErrors.find(
                            (value) => value.data === member.HouseID
                          ) && (
                            <>
                              <Alert severity="error">
                                {
                                  submitErrors.find(
                                    (value) => value.data === member.HouseID
                                  )?.message
                                }
                              </Alert>
                            </>
                          )}

                        {emptyErrors[index]?.error && (
                          <Alert severity="warning">
                            {emptyErrors[index]?.message}
                          </Alert>
                        )}
                      </div>
                    </div>
                    <div className="buttons flex-row-center g-4">
                      <>
                        <Button
                          btnType="error"
                          variant="outlined"
                          onClick={() => handleRemove(index)}
                          className="bg-scarlet-1 rounded-md font-weight-600 font-md"
                        >
                          Remove
                        </Button>
                        {editIndex === index ? (
                          <>
                            <Button
                              type="submit"
                              variant="contained"
                              // onClick={handleOk}
                              className="bg-primary rounded-md font-weight-600 font-md"
                            >
                              OK
                            </Button>
                            <Button
                              btnType="primary"
                              variant="text"
                              onClick={handleCancel}
                              className="bg-secondary rounded-md font-weight-600 font-md"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => handleEdit(index)}
                            className="bg-primary rounded-md font-weight-600 font-md"
                          >
                            Edit
                          </Button>
                        )}
                      </>
                    </div>
                  </form>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-member-add">
              <h1 className="font-lg font-weight-700 text-center m-t-8">
                You can Upload a CSV file or add members manualy.
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}
