import "./Dashboard.css";
import TopNav from "./components/TopContent/TopNav.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Home from "./Home/home.jsx"; // Update the path and filename accordingly
import Profile from "./Profile/Profile.jsx";
import Calender from "./Calender/Calender.jsx";
import ErrorPage from "./Error/Error.jsx";
import Loader from "../../loader/Loader.jsx";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Competition from "./Competetion/Competition.jsx";
import { useEffect, useReducer, useRef } from "react";
import DashboardContext from "./Context/DashboardContext.jsx";
import useAuth from "../../hooks/useAuth.jsx";
import socketio from "socket.io-client";
import Event from "./Event/Event.jsx";
import axios from "axios";
import { config, images } from "../../config.js";
const defaultLogo = images.Logo;
const SiteName = config.SiteName;
const APIURI = config.APIURI;
const initialValue = {
  status: "loading",
  profileStatus: "loading",
  theme: "light",
  themeType: localStorage.getItem("theme") || "System",
  navBarOpen: false,
  profile: null,
  wsShoketAuthenticated: null,
  socket: null,
  updateAvailable: false,
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setTheme": {
      return { ...state, theme: action.payload };
    }
    case "setUpdate": {
      return { ...state, updateAvailable: action.payload };
    }
    case "setThemeType": {
      return { ...state, themeType: action.payload };
    }
    case "setProfile": {
      return { ...state, profile: action.payload };
    }
    case "setProfileStatus": {
      return { ...state, profileStatus: action.payload };
    }
    case "toggleNavBar": {
      return { ...state, navBarOpen: !state.navBarOpen };
    }
    case "setWsAuth": {
      return { ...state, wsShoketAuthenticated: action.payload };
    }
    case "setWs": {
      return { ...state, socket: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const {
    status,
    wsShoketAuthenticated,
    socket,
    profile,
    profileStatus,
    theme,
    themeType,
  } = state;
  const [{ authenticated, status: authStatus }, dipatchAuth] = useAuth();
  const navigate = useNavigate();
  /**Client Updates Checking */

  useEffect(function () {
    if (!window.electron) return;
    const handleEvents = function (_, event) {
      switch (event.status) {
        case "downloaded": {
          dispatch({ type: "setUpdate", payload: true });
          return;
        }
      }
    };
    window.electronAPI.handleUpdates(handleEvents);
    return function () {
      window.electronAPI.removehandleUpdates(handleEvents);
    };
  }, []);

  useEffect(function () {
    document.title = `${SiteName} Dashboard`;
  }, []);
  useEffect(
    function () {
      if (authStatus !== "ready") return;
      if (!authenticated) navigate("/login");
    },
    [authenticated, navigate, authStatus]
  );

  useEffect(
    function () {
      if (!authenticated) return;
      if (!wsShoketAuthenticated) return;
      if (!profile) return;
      dispatch({ type: "setStatus", payload: "ready" });
    },
    [authenticated, wsShoketAuthenticated, profile]
  );

  useEffect(function () {
    const socket = socketio(`${APIURI}/home`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: socket });
    socket.on("connect", () => {
      socket.emit("client-message", {
        type: "auth",
        payload: document.cookie
          ?.split(";")
          .map((val) => val.trim())
          ?.find((val) => val.startsWith("token"))
          ?.split("=")
          ?.at(1),
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  /**Event handler */
  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function (args) {
        const { type, payload } = args;
        switch (type) {
          case "auth": {
            if (payload.success) dispatch({ type: "setWsAuth", payload: true });
            else dispatch({ type: "setWsAuth", payload: false });
            return;
          }
          case "preflight": {
            socket.emit("client-message", {
              type: "preflight",
              payload: {
                sToken: payload.sToken,
                token: document.cookie
                  ?.split(";")
                  .map((val) => val.trim())
                  ?.find((val) => val.startsWith("token"))
                  ?.split("=")
                  ?.at(1),
              },
            });
            return;
          }
          case "userUpdate": {
            if (payload.id !== profile.id) return;
            dispatch({ type: "setProfileStatus", payload: "loading" });
            return;
          }
          case "checkLogin": {
            dipatchAuth({ type: "setStatus", payload: "loading" });
            return;
          }
        }
      };
      socket.on("server-message", handleSocket);
      return function () {
        socket.removeEventListener("server-message", handleSocket);
      };
    },
    [socket, dipatchAuth, profile]
  );
  useEffect(
    function () {
      const getData = async function () {
        if (profileStatus !== "loading") return;
        try {
          const { data = null } = await axios.post(`/api/profile/getData`, {});
          dispatch({ type: "setProfileStatus", payload: "ready" });
          dispatch({ type: "setProfile", payload: data });
          socket &&
            socket.emit("server-message", {
              type: "profileUpdated",
              payload: {
                success: false,
              },
            });
        } catch (error) {
          dispatch({ type: "setProfileStatus", payload: "error" });
        }
      };
      getData();
    },
    [profileStatus, socket]
  );
  useEffect(
    function () {
      if (!window.matchMedia) return;
      const system = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = function () {
        switch (themeType) {
          case "System": {
            localStorage.setItem("theme", "System");
            dispatch({
              type: "setTheme",
              payload: system.matches ? "dark" : "light",
            });
            return;
          }
          case "Light": {
            localStorage.setItem("theme", "Light");
            dispatch({ type: "setTheme", payload: "light" });
            return;
          }
          case "Dark": {
            localStorage.setItem("theme", "Dark");
            dispatch({ type: "setTheme", payload: "dark" });
            return;
          }
        }
      };
      handleChange();
      system.addEventListener("change", handleChange);
      return function () {
        system.removeEventListener("change", handleChange);
      };
    },
    [themeType]
  );
  useEffect(
    function () {
      document.body.classList = theme;
    },
    [theme]
  );

  return (
    <div className="app" id="app">
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <DashboardContext.Provider
          value={{ ...state, dispatch, defaultLogo, SiteName }}
        >
          <NavBar />
          <section className="dashboard">
            <TopNav />
            <div className="innnerUpdates">
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="competitions/*" element={<Competition />} />
                <Route path="profile/*" element={<Profile />} />
                <Route path="calender" element={<Calender />} />
                <Route path="event/:eventId" element={<Event />} />
                <Route path="/" element={<Navigate to={"home"} />} />
                <Route path="*" element={<ErrorPage code={404} />} />
              </Routes>
            </div>
          </section>
        </DashboardContext.Provider>
      )}
    </div>
  );
}
