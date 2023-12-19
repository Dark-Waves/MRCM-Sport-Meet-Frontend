import React, { useEffect, useState } from "react";
import { parse } from "papaparse";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
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
import Loader from "../../../../Components/Loader/Loader";
import { Action, State as MainState } from "../Members";
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

interface Member {
  MemberID: number | null;
  Grade: string;
  House: string;
  Name: string;
  _id: string;
  // Add more fields here according to your data structure
}

interface AddMembersProps extends MainState {
  dispatch: React.Dispatch<Action>;
}

const AddMembers: React.FC<AddMembersProps> = ({
  dispatch,
  allMembersData,
  houseData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [membersData, setMembersData] = useState<Member[]>([]);
  const [submitErrors, setSubmitErrors] = useState<any[]>([]);
  const [emptyErrors, setEmptyErrors] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newMember, setNewMember] = useState<Member>({
    MemberID: 0,
    Name: "",
    Grade: "",
    House: "",
    _id: "",
  });
  const [createNew, setCreateNew] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            if (
              Array.isArray(jsonData) &&
              jsonData.every((obj) => typeof obj === "object")
            ) {
              // Check if JSON data is an array of objects
              setMembersData(jsonData);
            } else {
              enqueueSnackbar(
                "Invalid JSON format. Expected an array of objects.",
                { variant: "error" }
              );
            }
          } catch (error) {
            console.error("Error parsing JSON file:", error);
            enqueueSnackbar("Error parsing JSON file", { variant: "error" });
          }
        };
        reader.readAsText(file);
      } else if (
        file.type === "text/csv" ||
        file.type === "application/vnd.ms-excel"
      ) {
        parse(file, {
          header: true,
          complete: (parsedData) => {
            const requiredKeys = ["Name", "Grade", "House", "MemberID"];

            const hasRequiredKeys = requiredKeys.every((key) => {
              const foundKey = parsedData.meta.fields.find(
                (field: string) => field.toLowerCase() === key.toLowerCase()
              );
              return foundKey !== undefined || key.toLowerCase() === "MemberID";
            });

            if (!hasRequiredKeys) {
              enqueueSnackbar(
                "Import a valid data format (Name, Grade, House, MemberID)",
                { variant: "error" }
              );
              return;
            }
            const transformedData = parsedData.data
              .map((entry: any) => {
                const transformedEntry: any = {};
                let newKey = "";
                for (const key in entry) {
                  if (key.toLowerCase() === "name") newKey = "Name";
                  else if (key.toLowerCase() === "grade") newKey = "Grade";
                  else if (key.toLowerCase() === "house") newKey = "House";
                  else if (
                    key.toLowerCase() === "admissionid" ||
                    key.toLowerCase() === "memberid" ||
                    key.toLowerCase() === "houseid"
                  )
                    newKey = "MemberID";
                  transformedEntry[newKey] = entry[key];
                }
                return transformedEntry;
              })
              .filter((obj: any) =>
                Object.values(obj).some((val) => val !== "" && val !== null)
              );

            setMembersData(transformedData);
          },
          error: (err) => {
            console.error("CSV Parsing Error:", err);
            enqueueSnackbar("Error parsing CSV file", { variant: "error" });
          },
        });
      } else {
        enqueueSnackbar("Unsupported file type", { variant: "error" });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setInProgress(true);
      const emptyIndexes: number[] = [];
      const isEmptyRow = membersData.some((member, index) => {
        const isEmpty =
          !member.Name || !member.Grade || !member.House || !member.MemberID;
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
      console.log(membersData);
      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/members/add`,
        { members: membersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
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
        dispatch({
          type: "setAllMembersData",
          payload: [
            ...(allMembersData ? allMembersData : []),
            ...response.data.memberData,
          ],
        });

        console.log(response.data);
        enqueueSnackbar("Successfully imported data.", { variant: "success" });
        setMembersData([]);
        setEmptyErrors([]);
        setEditIndex(null);
        setNewMember({
          Name: "",
          House: "",
          MemberID: null,
          Grade: "",
          _id: "",
        });
        setCreateNew(false);
        setSubmitErrors([]);
      }
    } catch (error) {
      enqueueSnackbar("Member submitted Error.", {
        variant: "error",
      });
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
    setNewMember({
      Name: "",
      House: "",
      MemberID: null,
      Grade: "",
      _id: "",
    });
  };

  const clearCreateNew = () => {
    setCreateNew(false);
    setNewMember({
      Name: "",
      House: "",
      MemberID: null,
      Grade: "",
      _id: "",
    });
  };

  return (
    <div className="member__add">
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
            accept="application/json/text/csv/vnd.ms-excel"
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
                    label="MemberID"
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        MemberID: parseInt(e.target.value, 10) || null,
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
                      value={newMember.House}
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
                      {houseData &&
                        houseData.map((House, index) => (
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
                  <Button color="primary" onClick={clearCreateNew}>
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
                          id="MemberID"
                          type="number"
                          label="MemberID"
                          value={member.MemberID || ""}
                          onChange={(e) =>
                            handleInputChanges(e, index, "MemberID")
                          }
                          required
                        />
                        <TextField
                          id="Name"
                          type="text"
                          label="Name"
                          value={member.Name || ""}
                          onChange={(e) => handleInputChanges(e, index, "Name")}
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
                          <InputLabel id="House-select-label">House</InputLabel>
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
                            {houseData &&
                              houseData.map((House, index) => (
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
                          MemberID: {member.MemberID}
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
                        (value) => value.data === member.MemberID
                      ) && (
                        <>
                          <Alert severity="error">
                            {
                              submitErrors.find(
                                (value) => value.data === member.MemberID
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
                      color="error"
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
                          color="primary"
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
    </div>
  );
};
export default AddMembers;
