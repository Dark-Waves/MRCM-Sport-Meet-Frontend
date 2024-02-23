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
}

const Edit: React.FC<overViewProps> = function ({ dispatch, currentUser }) {
  const [editedUser, setEditedUser] = useState<{
    email: EditingCurrentEditUser;
    name: EditingCurrentEditUser;
    userName: EditingCurrentEditUser;
  }>({
    email: { loading: false, value: "" },
    name: { loading: false, value: "" },
    userName: { loading: false, value: "" },
  });
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentUser) return;
    setEditedUser({
      email: { loading: false, value: currentUser.email },
      name: { loading: false, value: currentUser.name },
      userName: { loading: false, value: currentUser.userName },
    });
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    const { value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [type]: { ...prevUser[type], value: value },
    }));
  };

  const updateUser = async (type: string) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/user/data/${type}/content`,
        { [type]: editedUser[type].value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
    } catch (error) {
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
      setImageUploading(false);
      console.log(response.data);
    } catch (error) {
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
              Your Profile Details
            </span>
            <div className="text-container flex-row-center m-auto"></div>
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
            />
          </div>
          <div className="buttons flex-row-aro m-t-4 w-full ">
            <Button variant="contained" color="primary" loading={false}>
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Edit;
