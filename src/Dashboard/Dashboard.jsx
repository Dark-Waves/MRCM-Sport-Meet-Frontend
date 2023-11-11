import { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./Routes/Routes";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Dashboard() {
  const { isLoggedIn, setUserRole } = useContext(AuthContext);
  console.log(isLoggedIn);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/auth");
    }

    console.log(token);
    // const token = localStorage.getItem("authToken");
    const findUser = async (token) => {
      try {
        // console.log(token);
        // Make an Axios POST request to your API
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/@me",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token is sent in the Authorization header
            },
          }
        );

        // Check if the login is successful
        if (response.status === 200 && response.data.message === "ok") {
          // Redirect to dashboard
          // window.location.href = "/dashboard/home";
          console.log(response.data.userData);
          // setRole("staff");
          setUserRole("staff");
        }
      } catch (error) {
        console.error("Login failed:", error);
        // Handle login failure (e.g., display an error message)
      }
    };
    if (isLoggedIn) {
      findUser(token);
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Sidebar />
      <Content />
    </>
  );
}
