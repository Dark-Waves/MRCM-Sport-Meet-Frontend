import Button from "../../../UI/Button/Button";
import { useState } from "react";
import PopUp from "../../../UI/PopUp/PopUp";
import jsCookie from "js-cookie";
import axios from "axios";
import { config } from "../../../utils/config";

interface UserData {
  id: string;
  name: string;
  role: string;
  userName: string;
  // Define other properties as needed
}

interface LoadingState {
  loaderFor: string;
  loading: boolean;
  loaderForValue: string;
}

interface AddUsersProps {
  userData: UserData[];
  dispatch: Function; // Change the type to the appropriate function type
}

const AddUsers: React.FC<AddUsersProps> = ({ userData, dispatch }) => {
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<UserData | {}>({});
  const [loading, setLoading] = useState<LoadingState>({
    loaderFor: "",
    loading: false,
    loaderForValue: "",
  });

  const removeUser = async (userId: string) => {
    if (loading.loading) return;
    setLoading({
      loading: true,
      loaderFor: "removeUser",
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
      // To do
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({
        loading: false,
        loaderFor: "",
        loaderForValue: "",
      });
    }
    // Dispatch an action for removing the user
    // Example dispatch usage: dispatch({ type: 'REMOVE_USER', payload: userId });
  };

  const editUser = (userId: string) => {
    if (loading.loading) return;
    setLoading({
      loading: true,
      loaderFor: "editUser",
      loaderForValue: userId,
    });
    // Dispatch an action for editing the user
    // Example dispatch usage: dispatch({ type: 'EDIT_USER', payload: userId });
  };

  const createUser = () => {
    if (loading.loading) return;
    setSelected({});
    // Dispatch an action for editing the user
    // Example dispatch usage: dispatch({ type: 'EDIT_USER', payload: userId });
  };

  const handleAddUserClose = () => {
    setPopup(false);
    setSelected({});
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
                onClick={() => {
                  editUser(user.id);
                }}
                variant="contained"
                color="primary"
                loading={
                  loading.loading &&
                  loading.loaderFor === "editUser" &&
                  loading.loaderForValue === user.id
                }
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  removeUser(user.id);
                }}
                variant="outlined"
                color="error"
                loading={
                  loading.loading &&
                  loading.loaderFor === "removeUser" &&
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
          {/* Contents for adding a user */}
          {/* You can add form elements or other content for adding users here */}
        </PopUp>
      )}
    </div>
  );
};

export default AddUsers;
