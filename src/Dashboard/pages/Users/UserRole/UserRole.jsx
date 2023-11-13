import { useContext, useEffect, useState } from "react";
import "./UserRole.css"; // CSS file for styling
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserRole() {
  // Sample user data
  const { isLoggedIn ,currentUser} = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!isLoggedIn || !token) {
      navigate("/auth");
      return;
    }

    const getUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/v1/role", {
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
  }, [isLoggedIn, navigate]);

  console.log(currentUser)
  return (
    <div className="view-user-activity grid-common main-content-holder">
      <h2>User Roles</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id}>
            <div className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.userName}</p>
              </div>
              <div className="role-editor">
                {currentUser.editAcessRoles.map((data,index) => {
                  <div className="role-btn" key={index}>{data.roleType}</div>
                })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
