import Button from "../../../UI/Button/Button";
import { useState } from "react";
import PopUp from "../../../UI/PopUp/PopUp";
import jsCookie from "js-cookie";
import axios from "axios";
import { Dispatch } from "redux"; // Update with the appropriate import based on your state management library
import { config } from "../../../utils/config";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

enum LoadingType {
  RemoveUser = "removeUser",
  EditUser = "editUser",
  CreateUser = "createUser",
}

interface LoadingState {
  loading: boolean;
  loaderFor: LoadingType | "";
  loaderForValue: string;
}

interface UserData {
  id: string;
  name: string;
  role: string;
  userName: string;
  // Define other properties as needed
}

interface RolesData {
  id: string;
  name: string;
  role: string;
  userName: string;
  // Define other properties as needed
}

interface AddUsersProps {
  allRoles: RolesData[];
  userData: UserData[];
  dispatch: Dispatch; // Update with the appropriate type for your dispatch function
}

const AddUsers: React.FC<AddUsersProps> = ({
  userData,
  dispatch,
  allRoles: roles,
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
    role: null,
  });

  const handleUserAction = async (userId: string, actionType: LoadingType) => {
    if (loading.loading) return;

    setLoading({
      loading: true,
      loaderFor: actionType,
      loaderForValue: userId,
    });

    try {
      const token = jsCookie.get("token");
      const response = await axios.get(
        `${config.APIURI}/api/v1/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (actionType === LoadingType.EditUser) {
        setSelected(response.data.userData as UserData);
        setFormState({
          name: response.data.userData.name,
          userName: response.data.userData.userName,
          password: "", // Assuming you don't want to populate the password during editing
          role: response.data.userData.role,
        });
      }

      // Add logic for Remove User if needed
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

  const removeUser = (userId: string) => {
    handleUserAction(userId, LoadingType.RemoveUser);
  };

  const editUser = (userId: string) => {
    handleUserAction(userId, LoadingType.EditUser);
  };

  const createUser = () => {
    if (loading.loading) return;
    setSelected(null);
    setFormState({
      name: "",
      userName: "",
      password: "",
      role: null,
    });
    setPopup(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value)
    setFormState((prev) => ({ ...prev, [name!]: value }));
  };

  const handleFormSubmit = async () => {
    try {
      const token = jsCookie.get("token");
      const userData = {
        name: formState.name,
        userName: formState.userName,
        password: formState.password,
        role: formState.role,
      };

      if (loading.loaderFor === LoadingType.CreateUser) {
        // Make a request to create a new user
        // Dispatch an action for adding the user
        // Example dispatch usage: dispatch({ type: 'ADD_USER', payload: userData });
      } else if (loading.loaderFor === LoadingType.EditUser) {
        // Make a request to update the existing user
        // Dispatch an action for updating the user
        // Example dispatch usage: dispatch({ type: 'UPDATE_USER', payload: userData });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPopup(false);
      setLoading({
        loading: false,
        loaderFor: "",
        loaderForValue: "",
      });
    }
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
  };

  return (
    <div className="user_controller position-relative">
      <div className="top_actions m-b-4">
        <Button onClick={() => createUser()} variant="outlined" color="primary">
          Add User
        </Button>
      </div>
      <div className="content-grid-one main-content-holder">
        {userData.map((user) => (
          <div className="grid-common" key={user.id}>
            <div className="details">
              <h2>{user.name}</h2>
              <p>Role: {user.role}</p>
            </div>
            <div className="buttons flex-row-aro m-t-4 w-full ">
              <Button
                onClick={() => editUser(user.id)}
                variant="contained"
                color="primary"
                loading={
                  loading.loaderFor === LoadingType.EditUser &&
                  loading.loaderForValue === user.id
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
                  loading.loaderForValue === user.id
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
            <h1>{selected ? "Edit user" : "User Create"}</h1>
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
                label="Password"
                name="password"
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
                  value={formState.role}
                  onChange={handleFormChange}
                >
                  {/* Map over your roles array to generate MenuItem components */}
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role.roleIndex}>
                      {role.roleType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
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
