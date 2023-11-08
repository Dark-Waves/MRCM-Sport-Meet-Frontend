import { NavLink, useLocation } from "react-router-dom";
import DashboardContext from "../../Context/DashboardContext";
import { useContext } from "react";
import "./NavBar.css";
import { navLinks } from "../../../../data/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar() {
  const topNav = navLinks[0].topNav;
  const bottomNav = navLinks[0].bottomNav;
  const location = useLocation();

  const getSecondPartOfPath = () => {
    const parts = location.pathname.split("/");
    if (parts.length >= 3) {
      return parts[2]; // Get the second part of the path after '/dashboard'
    }
    return "";
  };

  const SubNav = (SubMenuLinks) => {
    return (
      <ul className="SubNav">
        {SubMenuLinks.map((subNavLink) => (
          <li key={subNavLink.id}>
            <NavLink
              activeclassname="active" // Use 'activeclassname' instead of 'activeclassname'
              to={`/dashboard/${subNavLink.url}`}
              className="SubNav-item navLink"
            >
              <i className="nav-link-icon">
                <FontAwesomeIcon icon={["fa-solid", subNavLink.icon]} />
              </i>
              <span className="link-name">{subNavLink.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  };

  const { navBarOpen, defaultLogo, SiteName } = useContext(DashboardContext);

  return (
    <nav className={navBarOpen ? "close" : "open"}>
      <div className="logo-name">
        <div className="logo-image">
          <img src={defaultLogo} alt="logo__Img" />
        </div>
        <h1 className="logo_name">{SiteName}</h1>
      </div>
      <div className="menu-items">
        <ul className="nav-links">
          {topNav.map((navLink) => (
            <li
              className={`${
                navLink.submenu && getSecondPartOfPath() === navLink.url
                  ? "active"
                  : ""
              }`}
              key={navLink.id}
            >
              <NavLink
                activeclassname="active" // Use 'activeclassname' instead of 'activeclassname'
                className="navLink"
                to={`/dashboard/${navLink.url}`}
              >
                <i className="nav-link-icon">
                  <FontAwesomeIcon icon={["fa-solid", navLink.icon]} />
                </i>
                <span className="link-name">{navLink.title}</span>
              </NavLink>
              {navLink.submenu && SubNav(navLink.submenu)}
            </li>
          ))}
        </ul>
        <ul className="nav-links logout-mode">
          {bottomNav.map((navLink) => (
            <li
              className={`${
                navLink.submenu && getSecondPartOfPath() === navLink.url
                  ? "active"
                  : ""
              }`}
              key={navLink.id}
            >
              <NavLink
                activeclassname="active" // Use 'activeclassname' instead of 'activeclassname'
                className="navLink"
                to={`/dashboard/${navLink.url}`}
              >
                <i className="nav-link-icon">
                  <FontAwesomeIcon icon={["fa-solid", navLink.icon]} />
                </i>
                <span className="link-name">{navLink.title}</span>
              </NavLink>
              {navLink.submenu && SubNav(navLink.submenu)}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
