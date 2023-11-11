import React, { useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./Routes/Routes";
import { AuthContext } from "../context/AuthContext";
import { RoleContext } from "../context/RoleContext";
import axios from "axios";

export default function Dashboard() {
  const { isLoggedIn } = useContext(AuthContext);
  // console.log(isLoggedIn);

  const { setUser } = useContext(RoleContext);
  const findUser = async (token) => {
    try {
      console.log(token);
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
        setUser(response.data.userData);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., display an error message)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (isLoggedIn) {
      findUser(token);
    }
  });

  return (
    <>
      <Sidebar />
      <Content />
    </>
  );
}
