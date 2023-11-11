import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";

const ContentTop = () => {
  const location = useLocation();
  const path = location.pathname;
  const pathName = path.substring(1);
  const { toggleSidebar } = useContext(SidebarContext);

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
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
        <button type="button" className="search-btn content-top-btn">
          <img src={iconsImgs.search} alt="" />
        </button>
        <button className="notification-btn content-top-btn">
          {isLoggedIn && (
            <FontAwesomeIcon onClick={handleLogout} icon={faRightFromBracket} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ContentTop;
