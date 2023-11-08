import { useContext, useEffect } from "react";
import { UilBars, UilSearch, UilBell } from "@iconscout/react-unicons";
import ProfileSubmenu from "./components/ProfileSubmenu/ProfileSubmenu";
import NotifySubmenu from "./components/NotifySubmenu/NotifySubmenu";
import "./components/Submenu.css";
import "./TopNav.css";
import { useReducer } from "react";
import axios from "axios";
import DashboardContext from "../../Context/DashboardContext";
import { config } from "../../../../config";
import { v4 as uuidv4 } from "uuid";
import UpdateButton from "./components/UpdateButton/UpdateButton";
const reducer = function (state, action) {
  switch (action.type) {
    case "setNotifications": {
      return { ...state, notifications: action.payload };
    }
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setForceLoading": {
      return { ...state, forceLoading: action.payload };
    }
    case "addReadNotification": {
      if (!state.readNotifications.includes(action.payload)) {
        return {
          ...state,
          readNotifications: [...state.readNotifications, action.payload],
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case "resetReadNotifications": {
      return {
        ...state,
        readNotifications: [],
      };
    }
    case "addTempNotification": {
      return {
        ...state,
        tempNotifications: [...state.tempNotifications, action.payload],
      };
    }
    case "removeTempNotification": {
      return {
        ...state,
        tempNotifications: state.tempNotifications.filter(
          (notification) => notification.key !== action.payload
        ),
      };
    }
    case "toggleProfileMenu": {
      return {
        ...state,
        profileMenu: !state.profileMenu,
        notifyMenu: state.notifyMenu ? !state.notifyMenu : state.notifyMenu,
      };
    }
    case "toggleNotifyMenu": {
      return {
        ...state,
        notifyMenu: !state.notifyMenu,
        profileMenu: state.profileMenu ? !state.profileMenu : state.profileMenu,
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
    socket,
    profile,
    defaultLogo,
    updateAvailable,
  } = useContext(DashboardContext);
  const [state, dispatch] = useReducer(reducer, initialValue);
  const {
    profileMenu,
    notifyMenu,
    tempNotifications,
    notifications,
    status,
    forceLoading,
    readNotifications,
  } = state;
  const newNotificationsLength =
    notifications.unread.length > 9 ? "9+" : notifications.unread.length;
  useEffect(
    function () {
      if (!forceLoading && status !== "loading") return;
      async function fetchData() {
        try {
          const { data } = await axios.post(`/api/home/getNotifications`);
          if (!data.Notifications)
            throw new Error(`Cannot get the notifications`);
          dispatch({ type: "setNotifications", payload: data.Notifications });
          dispatch({ type: "setStatus", payload: "ready" });
        } catch (error) {
          dispatch({ type: "setStatus", payload: "error" });
        } finally {
          dispatch({ type: "setForceLoading", payload: false });
        }
      }
      fetchData();
      // Fetch notifications from the API
    },
    [status, forceLoading]
  );
  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function (event, { type, payload }) {
        if (event !== "server-message") return;
        switch (type) {
          case "notificationUpdate": {
            const { message, success, save } = payload;
            if (message) {
              const { message: pMessage } = message;
              const notification = {
                key: Date.now() + uuidv4(),
                message: pMessage,
                title: success,
              };
              dispatch({
                type: "addTempNotification",
                payload: notification,
              });
              setTimeout(function () {
                dispatch({
                  type: "removeTempNotification",
                  payload: notification.key,
                });
              }, 1000 * 5);
            }

            if (save) dispatch({ type: "setForceLoading", payload: true });
            return;
          }
        }
      };
      socket.onAnyOutgoing(handleSocket);
      socket.onAny(handleSocket);
      return function () {
        socket.offAny(handleSocket);
        socket.offAnyOutgoing(handleSocket);
      };
    },
    [socket]
  );

  /**Notification reading system */
  useEffect(
    function () {
      const postdata = async function () {
        if (notifyMenu) return;
        if (!readNotifications.length) return;
        const { data } = await axios.post(`/api/home/readNotifications`, {
          ids: readNotifications,
        });
        if (data.error) return;
        dispatch({ type: "resetReadNotifications" });
      };
      postdata();
    },
    [notifyMenu, readNotifications]
  );
  /**Removing if it clicks other things */
  useEffect(function () {
    const handleClose = function () {};
  }, []);
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
        <div
          className="notify-btn"
          onClick={() => dispatch({ type: "toggleNotifyMenu" })}
        >
          <i id="notifyBtn">
            <UilBell size="25" color="#61DAFB" />
          </i>
          {newNotificationsLength !== 0 && (
            <div className="notify-count" id="notifyBtnCount">
              {newNotificationsLength}
            </div>
          )}
        </div>
        <img
          id="ProfileBtn"
          alt=""
          src={profile.profilePicture || defaultLogo}
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
      {updateAvailable && <UpdateButton />}
      {notifyMenu && <NotifySubmenu stateNav={state} dispatchNav={dispatch} />}
      <div className="toast">
        {tempNotifications.map((notification) => (
          <div key={notification.key} className="toast-inside active">
            <div className="toast-content">
              <i
                className={
                  notification.title
                    ? "fas fa-solid fa-check check"
                    : "fas fa-solid fa-xmark check"
                }
              ></i>
              <div className="message">
                <span className="text text-1">
                  {notification.title ? "Success" : "Error"}
                </span>
                <span className="text text-2">{notification.message}</span>
              </div>
            </div>
            <i
              className="fa-solid fa-xmark close"
              onClick={() => {
                dispatch({
                  type: "removeTempNotification",
                  payload: notification.key,
                });
              }}
            ></i>
            <div className="progress active"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
