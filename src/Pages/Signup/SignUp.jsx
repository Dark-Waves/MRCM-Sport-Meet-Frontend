import "./SignUp.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import useAuth from "../../hooks/useAuth";
import { config, images } from "../../config";
const SiteName = config.SiteName;
const LoggingBG = {
  backgroundImage: `url(${images.loginBG})`,
};
const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add a loading state
  const [{ authenticated, status: authStatus }] = useAuth();
  useEffect(function () {
    document.title = `${SiteName} SignUp`;
  }, []);
  useEffect(
    function () {
      if (authStatus !== "ready") return;
      if (authenticated) navigate("/dashboard");
    },
    [authenticated, authStatus, navigate]
  );
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    grade: "",
    school: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      // Prevent multiple submissions while the previous one is in progress
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`/api/signup/submit`, formData);

      if (response.data.error) {
        setError(response.data.message);
      } else {
        setError("");
        navigate("/dashboard"); // Redirect to the home page after successful signup
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
            <span className="login100-form-title p-b-41"> Account SignUp </span>
            <form
              className="login100-form validate-form p-b-33 p-t-5"
              onSubmit={handleSubmit}
            >
              <div className="form-inputs">
                {/* Input fields */}
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter Your Name"
                >
                  <input
                    className="input100"
                    type="text"
                    name="name"
                    placeholder="Name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter username"
                >
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    placeholder="User name"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter email"
                >
                  <input
                    className="input100"
                    type="text"
                    name="email"
                    placeholder="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
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
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter Grade"
                >
                  <input
                    className="input100"
                    type="number"
                    name="grade"
                    placeholder="Grade"
                    max={13}
                    min={6}
                    id="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter School"
                >
                  <input
                    className="input100"
                    type="text"
                    name="school"
                    placeholder="School"
                    max={13}
                    min={6}
                    id="school"
                    value={formData.school}
                    onChange={handleInputChange}
                  />
                  <span className="focus-input100" data-placeholder="" />
                </div>

                {/* Repeat this structure for other input fields */}
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
                    SignUp
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
                  If you Already Have An Account <Link to="/login">Login</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
