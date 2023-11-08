import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Navigate
import { config, images } from "../../config";
const SiteName = config.SiteName;
export default function Logout() {
  const navigate = useNavigate(); // Initialize the navigation function
  useEffect(function () {
    document.title = `${SiteName} Logging out...`;
  }, []);
  useEffect(
    function () {
      async function logout() {
        try {
          await axios.get("api/logout");
          navigate("/login"); // Use the navigate function to go to "/login"
        } catch (error) {
          console.error("Logout failed", error);
        }
      }
      logout();
    },
    [navigate]
  ); // Include navigate in the dependency array

  return <div>Logging out...</div>;
}
