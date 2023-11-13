import { useContext, useEffect, useState } from "react";
import "./Overview.css";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../Components/Loader/Loader";

export default function Overview() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [popupUser, setPopupUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handlePopUp = async (userId) => {
    const token = Cookies.get("token");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.userData);
      setPopupUser(response.data.userData); // Assuming the response has the user data
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditPopup = (user) => {
    handlePopUp(user.id);
    setShowPopup(true);
  };

  const closePopup = () => {
    setPopupUser(null);
    setShowPopup(false);
  };

  return (
    <div className="user-overview grid-common main-content-holder position-relative">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1>User Overview</h1>
          <div className="user-list">
            {users.map((user) => (
              <div
                className="user-card"
                key={user.id}
                onClick={() => openEditPopup(user)}
              >
                <h2>{user.name}</h2>
                <p>Username: {user.userName}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-popup" onClick={closePopup}>
              &times;
            </span>
            {/* Display popupUser details here */}
          </div>
        </div>
      )}
    </div>
  );
}
