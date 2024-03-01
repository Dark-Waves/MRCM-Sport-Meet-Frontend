import React, { useEffect, useRef, useState } from "react";
import Button from "../../../UI/Button/Button";
import "./Edit.css";
import { TextField } from "@mui/material";
import Cookies from "js-cookie";
import axios, { AxiosResponse } from "axios";
import { config } from "../../../../../config";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LoadingButton } from "@mui/lab";
import Dropzone from "react-dropzone";
import { Accept } from "react-dropzone";
import AvatarEditor, { AvatarEditorProps } from "react-avatar-editor";
import PopUp from "../../../UI/PopUp/PopUp";
import { useSnackbar } from "notistack";
import { encrypt } from "../../../../utils/aes";

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

const acceptedFileTypes: Accept = {
  image: ["image/jpeg", "image/png", "image/gif"],
};

interface overViewProps {
  dispatch: React.Dispatch<any>;
  currentUser: any; // Update this to match the actual type of currentUser
}

interface EditingCurrentEditUser {
  loading: boolean;
  value: string;
  ready: boolean;
}

interface LoadedImage {
  loading: boolean;
  loaded: boolean;
  file: string | File;
}

const Edit: React.FC<overViewProps> = function ({ dispatch, currentUser }) {
  const { enqueueSnackbar } = useSnackbar();
  const [editedUser, setEditedUser] = useState<{
    email: EditingCurrentEditUser;
    name: EditingCurrentEditUser;
    userName: EditingCurrentEditUser;
  }>({
    email: { loading: false, value: "", ready: false },
    name: { loading: false, value: "", ready: false },
    userName: { loading: false, value: "", ready: false },
  });
  const [imageUploading, setImageUploading] = useState<LoadedImage>({
    loaded: false,
    loading: false,
    file: "",
  });
  const [newPassword, setNewPassword] = useState({
    loading: false,
    value: {
      confirmPassword: "",
      newPassword: "",
    },
    ready: false,
  });
  const editorRef = useRef<AvatarEditor>(null);
  const [imageReRender, setImageReRender] = useState(1);

  useEffect(() => {
    if (!currentUser) return;
    setEditedUser({
      email: { loading: false, value: currentUser.email, ready: false },
      name: { loading: false, value: currentUser.name, ready: false },
      userName: { loading: false, value: currentUser.userName, ready: false },
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

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ) => {
    if (type === "newPassword") {
      setNewPassword((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          newPassword: e.target.value,
        },
      }));
    } else if (type === "confirmPassword") {
      setNewPassword((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          confirmPassword: e.target.value,
        },
      }));
    }
  };

  const updateUser = async (type: string) => {
    if (type === "newPassword") {
      if (newPassword.value.newPassword !== newPassword.value.confirmPassword) {
        enqueueSnackbar("Passwords do not match.", { variant: "error" });
        return;
      }
      setNewPassword((prev) => ({
        ...prev,
        loading: true,
      }));
    } else {
      setEditedUser((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: true },
      }));
    }

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
          `${config.APIURI}/api/v${config.Version}/user/reset-password`,
          {
            value: encrypt(newPassword.value),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        if (response.data.message === "ok") {
          enqueueSnackbar("Password reset successful.", {
            variant: "success",
          });
          setNewPassword((prev) => ({
            ...prev,
            loading: false,
            value: {
              confirmPassword: "",
              newPassword: "",
            },
            ready: false,
          }));
        } else {
          setNewPassword((prev) => ({
            ...prev,
            loading: false,
          }));

        }
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
      if (response.data.message === "ok") {
        enqueueSnackbar(`${type} updated successfully.`, {
          variant: "success",
        });
      }
    } catch (error) {
      setEditedUser((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
      if (error.response.data.error) {
        enqueueSnackbar(`${error.response.data.message}`, {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Error updating ${type}.`, {
          variant: "error",
        });
      }
      console.error("Error updating user:", error);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    const uploadedFile: File = acceptedFiles[0];
    setImageUploading({ loading: false, loaded: true, file: uploadedFile });
  };

  const uploadProfilePicture = async () => {
    if (!editorRef.current) return;
    const canvas = editorRef.current.getImage();
    // Convert canvas data to a Blob
    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) return;
      try {
        const formData = new FormData();
        formData.append("file", blob, "profile-picture.png"); // Append the blob with a filename

        const token = Cookies.get("token");
        setImageUploading((prev) => ({ ...prev, loading: true, loaded: true }));

        let response: AxiosResponse;
        if (currentUser?.profilePicture?.image_id) {
          response = await axios.post(
            `${config.APIURI}/api/v${config.Version}/user/data/profile-pic`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          enqueueSnackbar(`Profile picture updated.`, {
            variant: "success",
          });
          setImageReRender((prev) => prev + 1);
        } else {
          response = await axios.put(
            `${config.APIURI}/api/v${config.Version}/user/profile-pic`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
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
          enqueueSnackbar(`Profile picture updated.`, {
            variant: "success",
          });
        }
        console.log(response.data);
        setImageUploading((prev) => ({
          loading: false,
          loaded: false,
          file: "",
        }));
        setImageReRender((prev) => prev + 1);
      } catch (error) {
        setImageUploading((prev) => ({
          ...prev,
          loading: false,
          loaded: true,
        }));
        if (error.response.data.error) {
          enqueueSnackbar(`${error.response.data.message}`, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(`Error updating profile picture.`, {
            variant: "error",
          });
        }
        console.error("Error updating profile picture:", error);
      }
    }, "image/png"); // Specify the desired image format, e.g., 'image/jpeg' or 'image/png'
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
            <Dropzone
              onDrop={onDrop}
              accept={acceptedFileTypes}
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="image-container flex-row-center m-auto"
                >
                  <input {...getInputProps()} />
                  {currentUser?.profilePicture ? (
                    <img
                      src={`${currentUser?.profilePicture.url}?${imageReRender}`}
                      className="img-fit-cover"
                      style={{ cursor: "pointer" }}
                      alt={currentUser.name}
                      width={"50%"}
                      key={imageReRender}
                    />
                  ) : (
                    <img
                      src="/assets/images/blank_profile.png"
                      className="img-fit-cover"
                      alt="no Profile Picture"
                      width={"50%"}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              )}
            </Dropzone>
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
                value={newPassword.value.newPassword}
                onChange={(e) => handlePasswordChange(e, "newPassword")}
              />
              <TextField
                id="confirm-new-password"
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={newPassword.value.confirmPassword}
                onChange={(e) => handlePasswordChange(e, "confirmPassword")}
              />
            </div>
          </div>
          <div className="buttons flex-row-aro m-t-4 w-full">
            <Button
              variant="contained"
              color="primary"
              loading={newPassword.loading}
              onClick={() => updateUser("newPassword")}
            >
              Reset Password
            </Button>
          </div>
        </div>
      </div>
      {imageUploading.loaded && (
        <PopUp
          closePopup={() =>
            setImageUploading({ loaded: false, loading: false, file: "" })
          }
        >
          <div className="popup_content m-4">
            <AvatarEditor
              ref={editorRef}
              image={imageUploading.file} // Type assertion to string
              width={200}
              height={200}
              border={50}
              borderRadius={100}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={1}
              rotate={0}
            />
            <LoadingButton
              variant="contained"
              loading={imageUploading.loading}
              onClick={uploadProfilePicture}
            >
              Submit
            </LoadingButton>
          </div>
        </PopUp>
      )}
    </div>
  );
};
export default Edit;
