import { useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";

import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { config, images } from "../../config";
const SiteName = config.SiteName;
const LoggingBG = {
  backgroundImage: `url(${images.loginBG})`,
};
const Login = function () {
  const navigate = useNavigate(); // Use useNavigate to access navigation
  const [loading, setLoading] = useState(false); // Add a loading state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [{ authenticated, status: authStatus }] = useAuth();
  useEffect(function () {
    document.title = `${SiteName} Login`;
  }, []);
  useEffect(
    function () {
      if (authStatus !== "ready") return;
      if (authenticated) navigate("/dashboard");
    },
    [authenticated, authStatus, navigate]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      // Prevent multiple submissions while the previous one is in progress
      return;
    }
    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const userData = {
        username: username,
        password: password,
      };
      setLoading(true);

      const response = await axios.post(`/api/login/submit`, userData);

      if (response.data.error) {
        setError(response.data.message);
      } else {
        setError("");
        navigate("/dashboard");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login" style={LoggingBG}>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-30 p-b-50">
            <span className="login100-form-title p-b-41"> Account Login </span>
            <form
              className="login100-form validate-form p-b-33 p-t-5"
              onSubmit={handleSubmit} // Handle form submission
            >
              {/* Your input fields */}
              <div className="form-inputs">
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter username"
                >
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    data-icon="\f007"
                    placeholder="User name"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter password"
                >
                  <input
                    className="input100"
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
              </div>
              {loading ? (
                <div className="container-login100-form-btn m-t-32">
                  <button className="login100-form-btn" id="Btn" type="submit">
                    <span className="login-signup-form-loader"></span>
                  </button>
                </div>
              ) : (
                <div className="container-login100-form-btn m-t-32">
                  <button className="login100-form-btn" id="Btn" type="submit">
                    Login
                  </button>
                </div>
              )}
              {error && (
                <div className="error-box">
                  <span className="error-text">{error}</span>
                </div>
              )}
              <div className="redirect m-t-32">
                <span className="text">
                  Don't Have An Account <Link to={"/signup"}>SignUp</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
