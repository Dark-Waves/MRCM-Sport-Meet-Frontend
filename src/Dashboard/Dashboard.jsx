import "./Dashboard.css";
import DashboardContext from "../context/DashboardContext";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Broadcast from "./pages/Broadcast/Broadcast";
import Users from "./pages/Users/Users";
import Website from "./pages/Website/Website";
import ContentTop from "./components/ContentTop/ContentTop"; // Heading
import ErrorPage from "../Components/Error/Error.jsx";
import Loader from "../Components/Loader/Loader";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import useAuth from "../hooks/useAuth.jsx";
import socketio from "socket.io-client";
import axios from "axios";
import { config } from "./utils/config.js";
import { siteImgs } from "./utils/images.js";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
const defaultLogo = siteImgs.Logo;
const SiteName = config.SiteName;
import Cookies from "js-cookie";
import Approves from "./pages/Approves/Approves.jsx";
import Submits from "./pages/Submits/Submits.jsx";
import Members from "./pages/Members/Members.jsx";
import { SnackbarProvider } from "notistack";
import Houses from "./pages/Houses/Houses.jsx";
const APIURI = config.APIURI;

const initialValue = {
  status: "loading",
  navigationLinks: null,
  navigationStatus: "loading",
  profileStatus: "loading",
  profile: null,
  sidebarOpen: true,
  wsShoketAuthenticated: null,
  socket: null,
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "toggleSideBar": {
      return { ...state, sidebarOpen: !state.sidebarOpen };
    }
    case "setProfile": {
      return { ...state, profile: action.payload };
    }
    case "setProfileStatus": {
      return { ...state, profileStatus: action.payload };
    }
    case "setNavigationStatus": {
      return { ...state, navigationStatus: action.payload };
    }
    case "setNavigationLinks": {
      return { ...state, navigationLinks: action.payload };
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

const getPageComponent = (title) => {
  // Map the title to the corresponding component
  const pages = {
    Home: Home,
    Events: Events,
    Broadcast: Broadcast,
    Users: Users,
    Website: Website,
    Approves: Approves,
    Submit: Submits,
    Members: Members,
    Houses: Houses,
    // ... map other titles to components
  };

  return pages[title] || null; // Return the component or null if not found
};

const renderRoutes = (links) => {
  console.log(links);
  return links.map((link) => {
    const PageComponent = getPageComponent(link.title);
    if (!PageComponent) return null; // Skip if no matching component
    console.log(links);
    return (
      <Route key={link._id} path={link.path} element={<PageComponent />} />
      // Note: If subMenu exists, you might want to handle nested routes here
    );
  });
};
export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const {
    status,
    profileStatus,
    wsShoketAuthenticated,
    profile,
    socket,
    navigationLinks,
    navigationStatus,
  } = state;
  const [{ authenticated, status: authStatus }, dipatchAuth] = useAuth();
  const navigate = useNavigate();
  /**Client Updates Checking */

  useEffect(function () {
    document.title = `${SiteName} Dashboard`;
  }, []);

  useEffect(
    function () {
      if (authStatus !== "ready") return;
      if (!authenticated) navigate("/auth");
    },
    [authenticated, navigate, authStatus]
  );

  useEffect(
    function () {
      if (!authenticated) return;
      if (!wsShoketAuthenticated) return;
      if (!navigationLinks) return;
      if (!profile) return;
      dispatch({ type: "setStatus", payload: "ready" });
    },
    [authenticated, wsShoketAuthenticated, profile, navigationLinks]
  );

  useEffect(function () {
    const socket = socketio(`${APIURI}/v1/home`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: socket });
    socket.on("connect", () => {
      console.log(socket);
      socket.emit("client-message", {
        type: "auth",
        payload: Cookies.get("token"),
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
                token: Cookies.get("token"),
              },
            });
            return;
          }
        }
      };
      socket.on("server-message", handleSocket);
      return function () {
        socket.removeEventListener("server-message", handleSocket);
      };
    },
    [socket, dipatchAuth]
  );

  useEffect(
    function () {
      const getData = async function () {
        if (profileStatus !== "loading") return;
        try {
          const token = Cookies.get("token");
          const { data: userData } = await axios.get(
            `${config.APIURI}/api/v1/user/@me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          dispatch({ type: "setProfile", payload: userData?.userData });
          dispatch({ type: "setProfileStatus", payload: "ready" });
        } catch (error) {
          dispatch({ type: "setProfileStatus", payload: "error" });
        }
      };
      getData();
    },
    [profileStatus] // Only trigger when profileStatus changes
  );

  useEffect(
    function () {
      const getData = async function () {
        if (navigationStatus !== "loading") return;
        if (!profile) return;
        try {
          const token = Cookies.get("token");
          const { data: navigationLinks } = await axios.get(
            `${config.APIURI}/api/v1/dashboard/${profile.role}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          dispatch({
            type: "setNavigationLinks",
            payload: navigationLinks?.data.navigationLinks,
          });

          dispatch({ type: "setNavigationStatus", payload: "ready" });
        } catch (error) {
          dispatch({ type: "setNavigationStatus", payload: "error" });
        }
      };

      getData();
    },
    [profile, navigationStatus]
  );
  return (
    <>
      {status === "loading" && (
        <div style={{ background: "#fff" }}>
          <Loader />
        </div>
      )}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <DashboardContext.Provider
          value={{ ...state, dispatch, defaultLogo, SiteName }}
        >
          <SnackbarProvider maxSnack={3}>
            <Sidebar />
            <div className="Dashboard main-content">
              <ContentTop />
              <Routes>
                {navigationLinks ? renderRoutes(navigationLinks) : ""}
                <Route path="/" element={<Navigate to="/dashboard/home" />} />
                <Route path="*" element={<ErrorPage code={404} />} />
              </Routes>
            </div>
          </SnackbarProvider>
        </DashboardContext.Provider>
      )}
    </>
  );
}
