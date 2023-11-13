import { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./Routes/Routes";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../Components/Loader/Loader";
import "./Dashboard.css";

export default function Dashboard() {
  const { isLoggedIn, setUserRole, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Centralized error handling and navigation

  useEffect(() => {
    const token = Cookies.get("token");

    // If no token or not logged in, redirect to auth page
    if (!isLoggedIn || !token) {
      navigate("/auth");
      return;
    }
    const handleError = (error) => {
      navigate("/error", {
        state: {
          error: error,
        },
      });
    };
    // Function to fetch user data
    const findUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/@me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.message === "ok") {
          console.log(response.data.userData);
          const role = response.data.userData.role;
          setUserRole(role);
          setUser(response.data.userData);

          // Redirect if the role is not staff, admin, or owner
          if (!["staff", "admin", "owner"].includes(role)) {
            handleError({
              code: "Permission_Error",
              message: "You don't have access to the dashboard",
            });
          }
        } else {
          handleError({
            code: "API_ERROR",
            message: "Failed to fetch user data.",
          });
        }
      } catch (error) {
        handleError({
          code: "400",
          message: "API_ERROR : Failed to fetch user data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    findUser();
  }, [isLoggedIn, navigate, setUserRole]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Sidebar />
      <Content />
    </>
  );
}
