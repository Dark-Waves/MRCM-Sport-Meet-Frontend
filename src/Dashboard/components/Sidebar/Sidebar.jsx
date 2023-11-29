import { personsImgs } from "../../utils/images";
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardContext from "../../../context/DashboardContext";
import { useSnackbar } from "notistack";

const Sidebar = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { socket } = useContext(DashboardContext);

  const { sidebarOpen, navigationLinks } = useContext(DashboardContext);
  // Get the current location using useLocation
  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    if (!socket) return;
    socket.on("server-message", (message) => {
      if (message.type === "message") {
        console.log(message);
        enqueueSnackbar(message.payload.content, { variant: "info" });
      }
    });
  }, [socket, enqueueSnackbar]);

  const renderSubMenu = (subMenuItems) => {
    return (
      <ul className="sub-menu">
        {subMenuItems.map((subMenuItem) => (
          <li
            className={`sub-menu-item flex-row-start ${
              location.pathname === "/Dashboard" + subMenuItem.url
                ? "active"
                : ""
            }`} // Check if the current location matches the sub-menu item's URL
            key={subMenuItem._id}
          >
            <NavLink
              to={"/Dashboard" + subMenuItem.url}
              activeclassname="active"
              className="sub-menu-link flex"
            >
              <FontAwesomeIcon
                icon={"nav-link-icon fa-solid " + subMenuItem.icon}
              />
              <span>{subMenuItem.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "" : "sidebar-change"}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img src={"/logo/logo.png"} alt="profile image" />
        </div>
        <span className="info-name">Dark Waves</span>
      </div>
      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks &&
            navigationLinks.map((navigationLink) => (
              <li
                className={`nav-item ${
                  location.pathname.startsWith(
                    "/Dashboard" + navigationLink.url
                  ) || location.pathname === "/Dashboard" + navigationLink.url
                    ? "active"
                    : ""
                }`}
                key={navigationLink._id}
              >
                <NavLink
                  activeclassname="active"
                  to={"/Dashboard" + navigationLink.url}
                >
                  <h2 className="nav-link">
                    <FontAwesomeIcon
                      icon={"nav-link-icon fa-solid " + navigationLink.icon}
                    />
                    <span className="nav-link-text">
                      {navigationLink.title}
                    </span>
                  </h2>
                </NavLink>
                {navigationLink.subMenu &&
                  renderSubMenu(navigationLink.subMenu)}
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
