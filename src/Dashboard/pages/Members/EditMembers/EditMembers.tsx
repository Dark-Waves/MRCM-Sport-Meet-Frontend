import { useState } from "react";
import axios from "axios";
import { config } from "../../../utils/config";
import Cookies from "js-cookie";
import Input from "../../../UI/Input/Input";
import "./EditMembers.css";
import Button from "../../../UI/Button/Button";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "notistack";
import { TextField } from "@mui/material";
import React from "react";
import { Action, State as MainState, MemberData } from "../Members";

interface EditMembersProps extends MainState {
  dispatch: React.Dispatch<Action>;
}

const editMembers: React.FC<EditMembersProps> = function ({
  allMembersData,
  dispatch,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [submitErrors, setSubmitErrors] = useState<Record<string, any>>({});
  const [emptyErrors, setEmptyErrors] = useState<Record<string, any>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<MemberData | null>(null);

  const handleInputChanges = (field: keyof MemberData, value: string) => {
    if (editedMember) {
      setEditedMember((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditedMember({ ...(allMembersData ? allMembersData : [])[index] });
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

  const handleUpdateMember = async (updatedMemberData: MemberData) => {
    try {
      if (
        !updatedMemberData.Name ||
        !updatedMemberData.Grade ||
        !updatedMemberData.House
      ) {
        return setEmptyErrors({
          MemberID: updatedMemberData.MemberID,
          message: "Empty fields. Please fill in all required fields.",
        });
      }
      const token = Cookies.get("token");
      const response = await axios.patch(
        `${config.APIURI}/api/v${config.Version}/member/${updatedMemberData.MemberID}`,
        { updatedMemberData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === "ok") {
        const updatedMembers = allMembersData
          ? allMembersData.map((member) =>
              member.MemberID === updatedMemberData.MemberID
                ? updatedMemberData
                : member
            )
          : [];
        dispatch({ type: "setAllMembersData", payload: updatedMembers });

        enqueueSnackbar("Member updated successfully.", { variant: "success" });
      }
    } catch (error) {
      if (error.response?.data.error) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      }
      console.error("Error updating member:", error);
    }
  };

  const handleRemoveMember = async (memId: number) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v${config.Version}/member/${memId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.message === "ok") {
        const updatedMembers = allMembersData
          ? allMembersData.filter((member) => member.MemberID !== memId)
          : [];
        dispatch({ type: "setAllMembersData", payload: updatedMembers });
        enqueueSnackbar("Member removed successfully.", { variant: "success" });
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="member__add">
      {allMembersData && allMembersData.length ? (
        <>
          {allMembersData.map((member, index) => (
            <div className="div" key={index}>
              <div className="content grid-common m-4 flex-col position-relative">
                <div className="user-content">
                  <div className="data-content inputs w-full p-4 g-3">
                    {editIndex === index ? (
                      <>
                        <span className="font-md p-3 bg-primary rounded-md font-weight-500">
                          MemberID: {member.MemberID}
                        </span>
                        <TextField
                          id="name"
                          type="text"
                          label="Name"
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
                        <TextField
                          id="grade"
                          type="text"
                          label="Grade"
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

                        <TextField
                          id="house"
                          type="text"
                          label="House"
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

                    {submitErrors.MemberID === member.MemberID && (
                      <>
                        <Alert severity="error">
                          {submitErrors.MemberID === member.MemberID &&
                            submitErrors.message}
                        </Alert>
                      </>
                    )}

                    {emptyErrors.MemberID === member.MemberID && (
                      <Alert severity="warning">{emptyErrors.message}</Alert>
                    )}
                  </div>
                </div>
                <div className="buttons flex-row-center g-4">
                  <>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() =>
                        member.MemberID && handleRemoveMember(member.MemberID)
                      }
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
};

export default editMembers;
