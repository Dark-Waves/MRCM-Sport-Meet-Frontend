import { useContext } from "react";
import { UilBars, UilSearch } from "@iconscout/react-unicons";
import ProfileSubmenu from "./components/ProfileSubmenu/ProfileSubmenu";
import "./components/Submenu.css";
import "./TopNav.css";
import { useReducer } from "react";
import axios from "axios";
import DashboardContext from "../../Context/DashboardContext";
import UpdateButton from "./components/UpdateButton/UpdateButton";
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setForceLoading": {
      return { ...state, forceLoading: action.payload };
    }
    case "toggleProfileMenu": {
      return {
        ...state,
        profileMenu: !state.profileMenu,
        notifyMenu: state.notifyMenu ? !state.notifyMenu : state.notifyMenu,
      };
    }
    default:
      return new Error("method not found");
  }
};
const initialValue = {
  status: "loading",
  profileMenu: false,
  notifyMenu: false,
  tempNotifications: [],
  readNotifications: [],
  notifications: { all: [], unread: [] },
  forceLoading: false,
};

export default function TopNav() {
  const {
    dispatch: DashboardDispatch,
    profile,
    defaultLogo,
    updateAvailable,
  } = useContext(DashboardContext);
  const [state, dispatch] = useReducer(reducer, initialValue);
  const {
    profileMenu,
  } = state;
  return (
    <div className="top">
      <i
        className="sidebar-toggle"
        onClick={() => DashboardDispatch({ type: "toggleNavBar" })}
      >
        <UilBars size="25" color="#61DAFB" />
      </i>
      <div className="search-box">
        <i>
          <UilSearch size="23" color="#61DAFB" />
        </i>
        <input type="text" placeholder="Search here..." />
      </div>
      <div className="nav-notify-profile">
        <img
          id="ProfileBtn"
          alt=""
          src={profile && profile.profilePicture || defaultLogo}
          onClick={() => dispatch({ type: "toggleProfileMenu" })}
        />
      </div>
      {profileMenu && (
        <ProfileSubmenu
          stateNav={state}
          profile={profile}
          dispatchNav={dispatch}
          defaultLogo={defaultLogo}
        />
      )}
    </div>
  );
}
