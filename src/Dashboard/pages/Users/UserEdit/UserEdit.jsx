import { useContext, useEffect, useState } from "react";
import "./UserEdit.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DashboardContext from "../../../../context/DashboardContext";
import { config } from "../../../../../config";
import Loader from "../../../../Components/Loader/Loader";

export default function UserEdit() {
  // Sample user data
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      const token = Cookies.get("token");
      setIsLoading(true);
      try {
        const response = await axios.get(`${config.APIURI}/api/v1/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.lowerUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, []);

  return (
    <div className="view-user-activity grid-common main-content-holder">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2>User UserEdit</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user._id}>
                <div className="user-card">
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <p>{user.userName}</p>
                  </div>
                  <div className="role-editor">
                    {/* {currentUser.editAcessRoles.map((data,index) => {
                  <div className="role-btn" key={index}>{data.roleType}</div>
                })} */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}{" "}
    </div>
  );
}
