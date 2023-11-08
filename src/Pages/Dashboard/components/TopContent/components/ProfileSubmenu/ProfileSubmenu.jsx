import { NavLink } from "react-router-dom";
import "./ProfileSubmenu.css";
import { profileLinks } from "../../../../../../data/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function ProfileSubmenu({
  dispatchNav,
  profile,
  stateNav,
  defaultLogo,
}) {
  return (
    <>
      <div className="submenu-wrap" id="subMenu">
        <div className="submenu">
          <div className="user-details">
            <img
              src={profile.profilePicture || defaultLogo}
              alt=""
              className="logo"
            />
            <h3 className="name">{profile.name}</h3>
          </div>
          <hr />
          {profileLinks.map((val) => (
            <NavLink
              activeclassname="active" // Use 'activeclassname' instead of 'activeclassname'
              className="navLink"
              to={`/dashboard/${val.url}`}
              key={val.id}
            >
              <i className="icon nav-link-icon">
                <FontAwesomeIcon icon={["fa-solid", val.icon]} />
              </i>
              <p>{val.title}</p>
              <span>{">"}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
