import React, { useEffect, useState } from "react";
import { personsImgs } from "../../utils/images";
import { navigationLinks, user } from "../../data/data";
import "./Sidebar.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);

  // Get the current location using useLocation
  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass("sidebar-change");
    } else {
      setSidebarClass("");
    }
  }, [isSidebarOpen]);

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
            key={subMenuItem.id}
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
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img src={personsImgs.person_two} alt="profile image" />
        </div>
        <span className="info-name">Dark Waves</span>
      </div>
      <nav className="navigation">
        <ul className="nav-list">
          {user.role === "admin"
            ? navigationLinks.admin.map((navigationLink) => (
                <li
                  className={`nav-item ${
                    location.pathname.startsWith(
                      "/Dashboard" + navigationLink.url
                    ) || location.pathname === "/Dashboard" + navigationLink.url
                      ? "active"
                      : ""
                  }`}
                  key={navigationLink.id}
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
              ))
            : user.role === "staff"
            ? navigationLinks.staff.map((navigationLink) => (
                <li
                  className={`nav-item ${
                    location.pathname.startsWith(
                      "/Dashboard" + "/Dashboard" + navigationLink.url
                    ) || location.pathname === "/Dashboard" + navigationLink.url
                      ? "active"
                      : ""
                  }`}
                  key={navigationLink.id}
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
              ))
            : "you don't have access"}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
