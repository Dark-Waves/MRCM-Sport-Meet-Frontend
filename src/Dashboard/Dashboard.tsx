import React, { useEffect, useReducer } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import useAuth from "../hooks/useAuth";
import socketio from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "./utils/config";
import { siteImgs } from "./utils/images";
import Sidebar from "./components/Sidebar/Sidebar";
import ContentTop from "./components/ContentTop/ContentTop";
import ErrorPage from "../Components/Error/Error";
import Loader from "../Components/Loader/Loader";
import DashboardContext, { DashboardState, DashboardAction, initialState } from "../context/DashboardContext";
import { decrypt } from "../utils/aes";

import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Broadcast from "./pages/Broadcast/Broadcast";
import Users from "./pages/Users/Users";
import Website from "./pages/Website/Website";
import Approves from "./pages/Approves/Approves";
import Submits from "./pages/Submits/Submits";
import Members from "./pages/Members/Members";
import Houses from "./pages/Houses/Houses";
import System from "./pages/System/System";

import "./Dashboard.css";

const { APIURI, SiteName } = config;
const defaultLogo = siteImgs.Logo;



const reducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "setStatus":
      return { ...state, status: action.payload };
    case "toggleSideBar":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "setProfile":
      return { ...state, profile: action.payload };
    case "setProfileStatus":
      return { ...state, profileStatus: action.payload };
    case "setNavigationStatus":
      return { ...state, navigationStatus: action.payload };
    case "setNavigationLinks":
      return { ...state, navigationLinks: action.payload };
    case "setWsAuth":
      return { ...state, wsShoketAuthenticated: action.payload };
    case "setWs":
      return { ...state, socket: action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

const getPageComponent = (title: string): React.FC | null => {
  const pages: Record<string, React.FC> = {
    Home,
    Events,
    Broadcast,
    Users,
    Website,
    Approves,
    Submit: Submits,
    Members,
    Houses,
    System,
  };
  return pages[title] || null;
};

const renderRoutes = (links: any[]): JSX.Element[] => {
  return links.map((link, index) => {
    const PageComponent = getPageComponent(link.title);
    return PageComponent ? (
      <Route key={index} path={link.path} element={<PageComponent />} />
    ) : <></>;
  });
};

const Dashboard: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    status,
    profileStatus,
    wsShoketAuthenticated,
    profile,
    socket,
    navigationLinks,
    navigationStatus,
  } = state;
  const [{ authenticated, status: authStatus }, dispatchAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatchAuth({ type: "setStatus", payload: "loading" });
  }, [dispatchAuth, location]);

  useEffect(() => {
    document.title = `${SiteName} Dashboard`;
  }, []);

  useEffect(() => {
    if (authStatus === "error") {
      Cookies.remove("token");
      navigate("/auth");
    }
  }, [navigate, authStatus]);

  useEffect(() => {
    if (authenticated && wsShoketAuthenticated && navigationLinks && profile) {
      dispatch({ type: "setStatus", payload: "ready" });
    }
  }, [authenticated, wsShoketAuthenticated, profile, navigationLinks]);

  useEffect(() => {
    const socket = socketio(`${APIURI}/v${config.Version}/home`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: socket });

    socket.on("connect", () => {
      socket.emit("client-message", {
        type: "auth",
        payload: Cookies.get("token"),
      });
    });

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSocket = async ({ type, payload }: { type: string; payload: any }) => {
      switch (type) {
        case "auth":
          dispatch({ type: "setWsAuth", payload: payload.success });
          break;
        case "preflight":
          socket.emit("client-message", {
            type: "preflight",
            payload: {
              sToken: payload.sToken,
              token: Cookies.get("token"),
            },
          });
          break;
      }
    };

    socket.on("server-message", handleSocket);

    return () => {
      socket.off("server-message", handleSocket);
    };
  }, [socket]);

  useEffect(() => {
    const getData = async () => {
      if (profileStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${APIURI}/api/v${config.Version}/user/@me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = decrypt(data);
        dispatch({ type: "setProfile", payload: userData.userData });
        dispatch({ type: "setProfileStatus", payload: "ready" });
      } catch (error) {
        dispatch({ type: "setProfileStatus", payload: "error" });
        Cookies.remove("token");
        navigate("/auth");
      }
    };
    getData();
  }, [profileStatus, navigate]);

  useEffect(() => {
    const getData = async () => {
      if (navigationStatus !== "loading" || !profile) return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${APIURI}/api/v${config.Version}/dashboard/${profile.role}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const dashboardData = decrypt(data);
        dispatch({ type: "setNavigationLinks", payload: dashboardData.dashboardSchema });
        dispatch({ type: "setNavigationStatus", payload: "ready" });
      } catch (error) {
        dispatch({ type: "setNavigationStatus", payload: "error" });
      }
    };
    getData();
  }, [profile, navigationStatus]);

  return (
    <>
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <DashboardContext.Provider value={{ ...state, dispatch, defaultLogo, SiteName }}>
          <SnackbarProvider maxSnack={3}>
            <Sidebar />
            <div className="Dashboard main-content">
              <ContentTop />
              <Routes>
                {navigationLinks && renderRoutes(navigationLinks)}
                <Route path="/" element={<Navigate to="/dashboard/home" />} />
                <Route path="*" element={<ErrorPage code={404} />} />
              </Routes>
            </div>
          </SnackbarProvider>
        </DashboardContext.Provider>
      )}
    </>
  );
};

export default Dashboard;
