import { useState } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import Input from "../../../UI/Input/Input";
import "./EditMembers.css";
import Button from "../../../UI/Button/Button";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "notistack";

export default function EditMembers({ allMembersData, setAllMembersData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState({});
  const [emptyErrors, setEmptyErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editedMember, setEditedMember] = useState(null);

  const handleInputChanges = (field, value) => {
    setEditedMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedMember({ ...allMembersData[index] });
  };

  const handleOk = async () => {
    if (editedMember) {
      await handleUpdateMember(editedMember);
      setEditedMember(null);
    }
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditedMember(null);
  };

  const handleUpdateMember = async (updatedMemberData) => {
    console.log(updatedMemberData);
    try {
      if (
        !updatedMemberData.Name ||
        !updatedMemberData.Grade ||
        !updatedMemberData.House
      ) {
        return setEmptyErrors({
          admissionID: updatedMemberData.admissionID,
          message: "Empty fields. Please fill in all required fields.",
        });
      }
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${config.APIURI}/api/v1/member/${updatedMemberData.admissionID}`,
        { updatedMemberData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      if (response.data.message === "ok") {
        const updatedMembers = allMembersData.map((member) =>
          member.admissionID === updatedMemberData.admissionID
            ? updatedMemberData
            : member
        );
        setAllMembersData(updatedMembers);
        enqueueSnackbar("Member updated successfully.", { variant: "success" });
      }
    } catch (error) {
      if (error.response.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error updating member:", error);
    }
  };

  const handleRemoveMember = async (memId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/member/${memId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
console.log(response)
      if (response.data.message === "ok") {
        const updatedMembers = allMembersData.filter(
          (member) => member._id !== memId
        );
        setAllMembersData(updatedMembers);
        enqueueSnackbar("Member removed successfully.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="member__add">
      {allMembersData.length ? (
        <>
          {allMembersData.map((member, index) => (
            <div className="div" key={index}>
              <div className="content grid-common m-4 flex-col position-relative">
                <div className="user-content">
                  <div className="data-content inputs w-full p-4 g-3">
                    {editIndex === index ? (
                      <>
                        <span className="font-md p-3 bg-primary rounded-md font-weight-500">
                          AdmissionID: {member.admissionID}
                        </span>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Name"
                          value={
                            (editedMember && editedMember.Name) ||
                            member.Name ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChanges("Name", e.target.value)
                          }
                          required
                        />
                        <Input
                          id="grade"
                          type="text"
                          placeholder="Grade"
                          value={
                            (editedMember && editedMember.Grade) ||
                            member.Grade ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChanges("Grade", e.target.value)
                          }
                          required
                        />

                        <Input
                          id="house"
                          type="text"
                          placeholder="House"
                          value={
                            (editedMember && editedMember.House) ||
                            member.House ||
                            ""
                          }
                          onChange={(e) =>
                            handleInputChanges("House", e.target.value)
                          }
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

                    {submitErrors.admissionID === member.admissionID && (
                      <>
                        <Alert severity="error">
                          {submitErrors.admissionID === member.admissionID &&
                            submitErrors.message}
                        </Alert>
                      </>
                    )}

                    {emptyErrors.admissionID === member.admissionID && (
                      <Alert severity="warning">{emptyErrors.message}</Alert>
                    )}
                  </div>
                </div>
                <div className="buttons flex-row-center g-4">
                  <>
                    <Button
                      btnType="error"
                      variant="outlined"
                      onClick={() => handleRemoveMember(member.admissionID)}
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
        <div className="empty_members">
          <h2 className="font-weight-600 font-lg">We can't find any members</h2>
        </div>
      )}
    </div>
  );
}
