import Button from "../../../UI/Button/Button";
import React, { useState } from "react";
import PopUp from "../../../UI/PopUp/PopUp";
import jsCookie from "js-cookie";
import axios from "axios";
import { RoleType, UserData, State as MainState, Action } from "../Users";
// import { Dispatch } from "redux"; // Update with the appropriate import based on your state management library
import { config } from "../../../utils/config";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ConstructionOutlined } from "@mui/icons-material";
import { ActionFunction } from "react-router-dom";

enum LoadingType {
  RemoveUser = "removeUser",
  EditUser = "editUser",
  CreateUser = "createUser",
  SubmitUser = "submitUser",
}

interface LoadingState {
  loading: boolean;
  loaderFor: LoadingType | "";
  loaderForValue: string;
}

interface AddUsersProps extends MainState {
  dispatch: React.Dispatch<Action>; // Update with the appropriate type for your dispatch function
}

const AddUsers: React.FC<AddUsersProps> = ({
  userData,
  dispatch,
  allRoles: roles,
  allUserData,
}) => {
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<UserData | {}>({});
  const [loading, setLoading] = useState<LoadingState>({
    loaderFor: "",
    loading: false,
    loaderForValue: "",
  });

  const [formState, setFormState] = useState({
    name: "",
    userName: "",
    password: "",
    role: "" as RoleType,
  });

  const openPopup = (actionType: LoadingType, userId?: string) => {
    if (loading.loading) return;

    setLoading({
      loading: false,
      loaderFor: actionType,
      loaderForValue: userId || "",
    });

    if (actionType === LoadingType.CreateUser) {
      // Clear form data for creating a new user
      setFormState({
        name: "",
        userName: "",
        password: "",
        role: "",
      });
    }

    setPopup(true);
  };

  const handleUserAction = async (userId: string, actionType: LoadingType) => {
    if (loading.loading) return;
    console.log({ userId, actionType });
    setLoading({
      loading: true,
      loaderFor: actionType,
      loaderForValue: userId,
    });
    if (actionType === LoadingType.EditUser) {
      try {
        const token = jsCookie.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v1/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.userData);

        setSelected(response.data.userData as UserData);
        setFormState({
          name: response.data.userData.name,
          userName: response.data.userData.userName,
          password: "", // Assuming you don't want to populate the password during editing
          role: response.data.userData.roles.roleIndex,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading({
          loading: false,
          loaderFor: actionType,
          loaderForValue: "",
        });
        openPopup(actionType, userId);
      }
    } else {
      setLoading({
        loading: false,
        loaderFor: actionType,
        loaderForValue: "",
      });
      openPopup(actionType, userId);
    }
  };

  const removeUser = async (userId: string) => {
    if (loading.loading) return;

    setLoading({
      loading: true,
      loaderFor: LoadingType.RemoveUser,
      loaderForValue: userId,
    });

    try {
      const token = jsCookie.get("token");
      const response = await axios.delete(
        `${config.APIURI}/api/v1/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "ok") {
        // Remove the user from allUserData and userData
        const updatedAllUserData = allUserData
          ? allUserData.filter((user) => user.id !== userId)
          : [];
        const updatedUserData = userData
          ? userData.filter((user) => user.id !== userId)
          : [];

        dispatch({
          type: "setAllUserData",
          payload: updatedAllUserData,
        });

        dispatch({
          type: "setUserData",
          payload: updatedUserData,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({
        loading: false,
        loaderFor: "",
        loaderForValue: "",
      });
    }
  };

  const handleFormSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = jsCookie.get("token");
      const updateUserData = {
        name: formState.name,
        userName: formState.userName,
        password: formState.password,
        role: formState.role,
      };
      console.log(updateUserData);
      console.log(loading);
      if (loading.loaderFor === LoadingType.CreateUser) {
        setLoading({
          loading: false,
          loaderFor: LoadingType.SubmitUser,
          loaderForValue: "",
        });

        const { data } = await axios.put(
          `${config.APIURI}/api/v1/user`,
          { signupData: updateUserData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        if (data.message === "ok") {
          setPopup(false);
          dispatch({
            type: "setUserData",
            payload: [...(userData ? userData : []), data.userSchema],
          });

          dispatch({
            type: "setAllUserData",
            payload: [...(allUserData ? allUserData : []), data.userSchema],
          });
        }
      } else if (loading.loaderFor === LoadingType.EditUser) {
        setLoading({
          loading: false,
          loaderFor: LoadingType.SubmitUser,
          loaderForValue: "",
        });
        const { data } = await axios.post(
          `${config.APIURI}/api/v1/role/access`,
          { signupData: updateUserData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        if (data.message === "ok") {
          const updatedAllUserData = allUserData
            ? allUserData.map((user) =>
                user.id === loading.loaderForValue ? data.updatedUser : user
              )
            : [];
          const updatedUserData = userData
            ? userData.map((user) =>
                user.id === loading.loaderForValue ? data.updatedUser : user
              )
            : [];
          dispatch({
            type: "setAllUserData",
            payload: updatedAllUserData,
          });
          dispatch({
            type: "setUserData",
            payload: updatedUserData,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setPopup(false);
      setLoading({
        loading: false,
        loaderFor: "",
        loaderForValue: "",
      });
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    setFormState((prev) => ({ ...prev, [name!]: value }));
  };

  const handleAddUserClose = () => {
    setPopup(false);
    setSelected({});
    setFormState({
      name: "",
      userName: "",
      password: "",
      role: "",
    });
    setLoading({
      loading: false,
      loaderFor: "",
      loaderForValue: "",
    });
  };

  return (
    <div className="user_controller position-relative">
      <div className="top_actions m-b-4">
        <Button
          onClick={() => openPopup(LoadingType.CreateUser)}
          variant="outlined"
          color="primary"
        >
          Add User
        </Button>
      </div>
      <div className="content-grid-one main-content-holder">
        {userData &&
          userData.map((user, index) => (
            <div className="grid-common" key={index}>
              <div className="details">
                <h2>{user.name}</h2>
                <p>Role: {user.role}</p>
              </div>
              <div className="buttons flex-row-aro m-t-4 w-full ">
                <Button
                  onClick={() =>
                    handleUserAction(user.id, LoadingType.EditUser)
                  }
                  variant="contained"
                  color="primary"
                  loading={
                    loading.loaderFor === LoadingType.EditUser &&
                    loading.loaderForValue === user.id &&
                    loading.loading
                  }
                >
                  Edit
                </Button>
                <Button
                  onClick={() => removeUser(user.id)}
                  variant="outlined"
                  color="error"
                  loading={
                    loading.loaderFor === LoadingType.RemoveUser &&
                    loading.loaderForValue === user.id &&
                    loading.loading
                  }
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
      </div>
      {popup && (
        <PopUp closePopup={handleAddUserClose}>
          {/* Contents for adding/editing a user */}
          {/* You can add form elements or other content for adding/editing users here */}
          <div className="popup_content m-4">
            <h1>
              {loading.loaderFor === LoadingType.EditUser
                ? "Edit user"
                : "User Create"}
            </h1>
            <form onSubmit={handleFormSubmit} className="flex-col w-full g-5">
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formState.name}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                label="UserName"
                name="userName"
                value={formState.userName}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                label={
                  loading.loaderFor === LoadingType.EditUser
                    ? "New Password"
                    : "Password"
                }
                name="password"
                type="password"
                value={formState.password}
                onChange={handleFormChange}
              />
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role selection</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  name="role"
                  label="Role selection"
                  value={formState.role || ""}
                  onChange={(e) => handleFormChange(e as any)}
                >
                  {/* Map over your roles array to generate MenuItem components */}
                  {roles &&
                    roles.map((role, index) => (
                      <MenuItem key={index} value={role.roleIndex}>
                        {role.roleType}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                loading={loading.loaderFor === LoadingType.SubmitUser}
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </form>
          </div>
        </PopUp>
      )}
    </div>
  );
};

export default AddUsers;
