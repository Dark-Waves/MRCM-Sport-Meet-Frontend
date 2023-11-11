import React, { useContext, useEffect, useState } from "react";
import "./Auth.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Auth() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [ navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make an Axios POST request to your API
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/auth",
        {
          loginData: { userName, password },
        }
      );

      // Check if the login is successful
      if (response.status === 200 && response.data.message === "ok") {
        // Redirect to dashboard
        // localStorage.setItem("authToken", response.data.token);
        console.log(response);
        Cookies.set("token", response.data.token, { expires: 7 }); // Set a cookie named 'token' that expires in 7 days

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., display an error message)
    }
  };

  return (
    <div className="auth">
      <div className="box">
        <div className="inner-box">
          <div className="forms-wrap">
            <form
              onSubmit={handleSubmit} // Use the handleSubmit function on form submit
              autoComplete="off"
              className="sign-in-form"
            >
              <div className="logo text-center flex-col-center">
                <h4>MRCM Sport Meet Admin</h4>
              </div>
              <div className="heading flex-col-center">
                <img src="/logo/logo.png" alt="mrcmlogo" className="w-50" />
              </div>
              <div className="actual-form">
                <div className="input-wrap">
                  <input
                    type="text"
                    minLength={4}
                    className="input-field"
                    autoComplete="off"
                    required=""
                    value={userName} // Bind input value to state
                    onChange={(e) => setUserName(e.target.value)} // Update state on change
                  />
                  <label>Name</label>
                </div>
                <div className="input-wrap">
                  <input
                    type="password"
                    minLength={4}
                    className="input-field"
                    autoComplete="off"
                    required=""
                    value={password} // Bind input value to state
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                  />
                  <label>Password</label>
                </div>
                <input
                  type="submit"
                  defaultValue="Sign In"
                  className="sign-btn"
                />
                <p className="text text-center">You must be a Admin or Staff</p>
              </div>
            </form>
          </div>
          <div className="carousel">
            <div className="images-wrapper">
              <img src="./img/image1.png" className="image img-1 show" alt="" />
              <img src="./img/image2.png" className="image img-2" alt="" />
              <img src="./img/image3.png" className="image img-3" alt="" />
            </div>
            <div className="text-slider">
              <div className="text-wrap">
                <div className="text-group">
                  <h2>Get Acess Contact Owner</h2>
                  <h2>Customize as you like</h2>
                  <h2>Invite students to your class</h2>
                </div>
              </div>
              <div className="bullets">
                <span className="active" data-value={1} />
                <span data-value={2} />
                <span data-value={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
