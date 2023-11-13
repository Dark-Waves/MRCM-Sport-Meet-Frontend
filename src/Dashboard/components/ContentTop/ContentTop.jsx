import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";
import Cookies from "js-cookie";

const ContentTop = () => {
  const location = useLocation();
  const path = location.pathname;
  const pathName = path.substring(1);
  const { toggleSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    Cookies.remove("token");
    // setIsLoggedIn(false);
    navigate("/");
    // Redirect to login page or update the state
  };

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button
          type="button"
          className="sidebar-toggler"
          onClick={() => toggleSidebar()}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h3 className="content-top-title">{pathName}</h3>
      </div>
      <div className="content-top-btns">
        <button className="notification-btn content-top-btn">
          {isLoggedIn && (
            <FontAwesomeIcon onClick={handleLogout} icon={faRightFromBracket} className="font-md" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ContentTop;
