import { useState } from "react";
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
import { CircularProgress } from "@mui/material";

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

  const handleFileUpload = (e) => {
    console.log("lol");
    const file = e.target.files[0];
    if (file) {
      parse(file, {
        header: true,
        complete: (parsedData) => {
          setMembersData(parsedData.data);
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
          !member.name || !member.grade || !member.house || !member.admissionID;
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
      const token = Cookies.get("token");
      const response = await axios.put(
        `${config.APIURI}/api/v1/members/add`,
        { members: membersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const handleOk = () => {
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleInputChanges = (e, index) => {
    const { id, value } = e.target;
    const updatedMembersData = [...membersData];
    updatedMembersData[index][id] = value;
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
                  <Input
                    type="text"
                    placeholder="AdmissionID"
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        admissionID: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Name"
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Grade"
                    onChange={(e) =>
                      setNewMember({ ...newMember, grade: e.target.value })
                    }
                    required
                  />

                  <Input
                    type="text"
                    placeholder="House"
                    onChange={(e) =>
                      setNewMember({ ...newMember, house: e.target.value })
                    }
                    required
                  />
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
              <div className="content grid-common m-4 flex-col position-relative">
                <div className="user-content">
                  <div className="data-content inputs w-full p-4 g-3">
                    {editIndex === index ? (
                      <>
                        <Input
                          id="admissionID"
                          type="text"
                          placeholder="AdmissionID"
                          value={member.admissionID || ""}
                          onChange={(e) => handleInputChanges(e, index)}
                          required
                        />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Name"
                          value={member.name || ""}
                          onChange={(e) => handleInputChanges(e, index)}
                          required
                        />
                        <Input
                          id="grade"
                          type="text"
                          placeholder="Grade"
                          value={member.grade || ""}
                          onChange={(e) => handleInputChanges(e, index)}
                          required
                        />

                        <Input
                          id="house"
                          type="text"
                          placeholder="House"
                          value={member.house || ""}
                          onChange={(e) => handleInputChanges(e, index)}
                          required
                        />
                      </>
                    ) : (
                      <>
                        <span
                          onClick={() => handleEdit(index)}
                          className="font-md p-3 bg-primary rounded-md font-weight-500"
                        >
                          AdmissionID: {member.admissionID}
                        </span>
                        <span
                          onClick={() => handleEdit(index)}
                          className="font-md p-3 bg-primary rounded-md font-weight-500"
                        >
                          Name: {member.name}
                        </span>
                        <span
                          onClick={() => handleEdit(index)}
                          className="font-md p-3 bg-primary rounded-md font-weight-500"
                        >
                          Grade: {member.grade}
                        </span>
                        <span
                          onClick={() => handleEdit(index)}
                          className="font-md p-3 bg-primary rounded-md font-weight-500"
                        >
                          House: {member.house}
                        </span>
                      </>
                    )}

                    {submitErrors.length > 0 &&
                      submitErrors.find(
                        (value) => value.data === member.admissionID
                      ) && (
                        <>
                          <Alert severity="error">
                            {
                              submitErrors.find(
                                (value) => value.data === member.admissionID
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
                          variant="contained"
                          onClick={handleOk}
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
              </div>
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
}
