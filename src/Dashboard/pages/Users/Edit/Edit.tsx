import React, { useEffect, useState } from "react";
import { Action, State as MainState } from "../Users";
import Button from "../../../UI/Button/Button";
import "./Edit.css";
import { TextField } from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../../../../config";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LoadingButton } from "@mui/lab";

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

interface overViewProps extends MainState {
  dispatch: React.Dispatch<Action>;
}

interface EditingCurrentEditUser {
  loading: boolean;
  value: string;
  ready: boolean;
}

const Edit: React.FC<overViewProps> = function ({ dispatch, currentUser }) {
  const [editedUser, setEditedUser] = useState<{
    email: EditingCurrentEditUser;
    name: EditingCurrentEditUser;
    userName: EditingCurrentEditUser;
    newPassword: EditingCurrentEditUser;
  }>({
    email: { loading: false, value: "", ready: false },
    name: { loading: false, value: "", ready: false },
    userName: { loading: false, value: "", ready: false },
    newPassword: { loading: false, value: "", ready: false },
  });
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) return;
    setEditedUser({
      email: { loading: false, value: currentUser.email, ready: false },
      name: { loading: false, value: currentUser.name, ready: false },
      userName: { loading: false, value: currentUser.userName, ready: false },
      newPassword: {
        loading: false,
        value: "",
        ready: false,
      },
    });
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    if (!currentUser) return;
    const { value } = e.target;
    if (currentUser[type] !== value) {
      setEditedUser((prevUser) => ({
        ...prevUser,
        [type]: { loading: false, value: value, ready: true },
      }));
    } else if (currentUser[type] === value) {
      setEditedUser((prevUser) => ({
        ...prevUser,
        [type]: { loading: false, value: value, ready: false },
      }));
    }
    setEditedUser((prevUser) => ({
      ...prevUser,
      [type]: { ...prevUser[type], value: value },
    }));
  };

  const updateUser = async (type: string) => {
    setEditedUser((prev) => ({
      ...prev,
      [type]: { ...prev[type], loading: true },
    }));
    try {
      const token = Cookies.get("token");
      let value: string = "";
      if (type === "email") {
        value = editedUser.email.value;
      }
      if (type === "name") {
        value = editedUser.name.value;
      }
      if (type === "userName") {
        value = editedUser.userName.value;
      }
      if (type === "newPassword") {
        const response = await axios.post(
          `${config.APIURI}/api/v${config.Version}/users/reset-password`,
          {
            newPassword: editedUser.newPassword.value,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
      }
      if (!value) return;
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/user/data`,
        { [type]: value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditedUser((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false, ready: false },
      }));
      console.log(response.data);
    } catch (error) {
      setEditedUser((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
      console.error("Error updating user:", error);
    }
  };

  const uploadProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const token = Cookies.get("token");
      setImageUploading(true);
      if (currentUser?.profilePicture.image_id) {
        const response = await axios.post(
          `${config.APIURI}/api/v${config.Version}/user/data/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
      } else {
        const response = await axios.put(
          `${config.APIURI}/api/v${config.Version}/user/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response.data);
        dispatch({
          type: "setCurrentUser",
          payload: {
            ...currentUser,
            profilePicture: {
              image_id: response.data.image_id,
              url: response.data.url,
            },
          },
        });
      }
      setImageUploading(false);
    } catch (error) {
      setImageUploading(false);
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <div className="user_controller position-relative">
      <div className="top_actions m-b-4">
        <h2 className="title">Hello Welcome {currentUser?.role}!</h2>
      </div>
      <div className="content-grid-one main-content-holder">
        <div className="grid-common">
          <div className="details">
            <span className="font-md font-weight-600 m-auto text-center flex-row-center">
              Your Profile Picture
            </span>
            <div className="image-container flex-row-center m-auto">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser?.profilePicture.url}
                  className="img-fit-cover"
                  alt={currentUser.name}
                  width={"50%"}
                />
              ) : (
                <img
                  src="/assets/images/blank_profile.png"
                  className="img-fit-cover"
                  alt="no Profile Picture"
                  width={"50%"}
                />
              )}
            </div>
          </div>
          <div className="buttons flex-row-aro m-t-4 w-full ">
            <LoadingButton
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              loading={imageUploading}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                onChange={uploadProfilePicture}
              />
            </LoadingButton>
          </div>
        </div>
        <div className="grid-common grid-span-2">
          <div className="details">
            <span className="font-md font-weight-600 m-auto text-center flex-row-center">
              Your Profile Details
            </span>
            {Object.entries(editedUser).map(([type, data]) => (
              <div className="text-container flex-row g-4 m-t-5 p-4" key={type}>
                <TextField
                  id={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  variant="outlined"
                  fullWidth
                  name={type}
                  value={data.value}
                  onChange={(e) => handleChange(e, type)}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  className="w-20"
                  loading={data.loading}
                  onClick={() => updateUser(type)}
                  disabled={data.value === "" || !data.ready}
                >
                  Save
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-common grid-span-3">
          <div className="details">
            <span className="font-md font-weight-600 m-auto text-center flex-row-center">
              Reset Your Password
            </span>
            <div className="text-container flex-row-center m-auto">
              <TextField
                id="new-password"
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={editedUser.newPassword}
                onChange={(e) => handleChange(e, "newPassword")}
              />
            </div>
          </div>
          <div className="buttons flex-row-aro m-t-4 w-full">
            <Button
              variant="contained"
              color="primary"
              loading={editedUser.newPassword.loading}
              onClick={() => updateUser("newPassword")}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Edit;
