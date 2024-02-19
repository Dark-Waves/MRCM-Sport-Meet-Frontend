import React, { useContext, useEffect, useState } from "react";
import "./Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../Components/Loader/Loader";
import { config } from "../../config";
import { TextField } from "@mui/material";
import Button from "../Dashboard/UI/Button/Button";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${config.APIURI}/api/v${config.Version}/user/auth`,
        {
          loginData: { userName, password },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 && response.data.message === "ok") {
        console.log(response);
        Cookies.set("token", response.data.token, { expires: 7 });
        navigate("/dashboard");
      }
      if (response.data.message === "You are already logged into the system") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
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
                  <TextField
                    type="text"
                    minLength={4}
                    className="input-field"
                    autoComplete="off"
                    required
                    label="Name"
                    style={{ width: "100%" }}
                    value={userName} // Bind input value to state
                    onChange={(e) => setUserName(e.target.value)} // Update state on change
                  />
                </div>
                <div className="input-wrap">
                  <TextField
                    type="password"
                    minLength={4}
                    className="input-field"
                    autoComplete="off"
                    required
                    label="Password"
                    style={{ width: "100%" }}
                    value={password} // Bind input value to state
                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                  />
                </div>
                <Button
                  type="submit"
                  defaultValue="Sign In"
                  className="sign-btn"
                  loading={loading}
                >
                  Login
                </Button>
                <p className="text text-center">You must be a Admin or Staff</p>
              </div>
            </form>
          </div>
          <div className="carousel">
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
