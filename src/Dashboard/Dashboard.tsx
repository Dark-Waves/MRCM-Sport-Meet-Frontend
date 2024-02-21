import React, { useEffect, useReducer } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import socketio, { Socket } from "socket.io-client";
import axios from "axios";
import { config } from "./utils/config";
import { siteImgs } from "./utils/images";
import Sidebar from "./components/Sidebar/Sidebar";
import ContentTop from "./components/ContentTop/ContentTop";
import ErrorPage from "../Components/Error/Error";
import Loader from "../Components/Loader/Loader";
import { SnackbarProvider } from "notistack";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import DashboardContext from "../context/DashboardContext";
import Home from "./pages/Home/Home";
import Events from "./pages/Events/Events";
import Broadcast from "./pages/Broadcast/Broadcast";
import Users from "./pages/Users/Users";
import Website from "./pages/Website/Website";
import Approves from "./pages/Approves/Approves";
import Submits from "./pages/Submits/Submits";
import Members from "./pages/Members/Members";
import Houses from "./pages/Houses/Houses";
import "./Dashboard.css";
import { decrypt } from "../utils/aes";
import System from "./pages/System/System"

const defaultLogo = siteImgs.Logo;
const SiteName = config.SiteName;
const APIURI = config.APIURI;

interface Profile {
  userName: string;
  id: string;
  name: string;
  role: "owner" | "admin" | "staff" | string;
  editAcessRoles: any[];
}

interface NavigationLink {
  title: string;
  icon: string;
  path: string;
  url: string;
  subMenu: any[];
  _id: string;
}

export interface State {
  status: "loading" | "error" | "ready";
  navigationLinks: NavigationLink[] | null;
  navigationStatus: "loading" | "error" | "ready";
  profileStatus: "loading" | "error" | "ready";
  profile: Profile | null;
  sidebarOpen: boolean;
  wsShoketAuthenticated: boolean | null;
  socket: any;
}

type Action =
  | { type: "setStatus"; payload: "loading" | "error" | "ready" }
  | { type: "toggleSideBar" }
  | { type: "setProfile"; payload: Profile }
  | { type: "setProfileStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setNavigationStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setNavigationLinks"; payload: NavigationLink[] }
  | { type: "setWsAuth"; payload: boolean }
  | { type: "setWs"; payload: any };

const initialValue: State = {
  status: "loading",
  navigationLinks: null,
  navigationStatus: "loading",
  profileStatus: "loading",
  profile: null,
  sidebarOpen: true,
  wsShoketAuthenticated: null,
  socket: null,
};
const reducer = (state: State, action: Action): State => {
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
      throw new Error("method not found");
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
    System
  };
  return pages[title] || null;
};

const renderRoutes = (links: any): JSX.Element[] => {
  return links.map((link: any, index: number) => {
    const PageComponent = getPageComponent(link.title);
    if (!PageComponent) return <></>; // Skip if no matching component
    return <Route key={index} path={link.path} element={<PageComponent />} />;
  });
};

const Dashboard: React.FC = () => {
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
  const [{ authenticated, status: authStatus }, dispatchAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // When change the location loader status = loading
    dispatchAuth({ type: "setStatus", payload: "loading" });
  }, [dispatchAuth, location]);

  useEffect(() => {
    document.title = `${SiteName} Dashboard`;
  }, []);

  useEffect(() => {
    // If auth status error clear the cookies and then navigate to /auth
    if (authStatus === "error") Cookies.remove("token");
    if (authStatus === "error") navigate("/auth");
  }, [navigate, authStatus]);

  useEffect(() => {
    // If all events ok then status = ready
    if (!authenticated) return;
    if (!wsShoketAuthenticated) return;
    if (!navigationLinks) return;
    if (!profile) return;
    dispatch({ type: "setStatus", payload: "ready" });
  }, [authenticated, wsShoketAuthenticated, profile, navigationLinks]);

  useEffect(() => {
    // setup privet(home) socket with authentication
    const socket = socketio(`${APIURI}/v${config.Version}/home`, {
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
  }, []);

  useEffect(() => {
    // use socket and when clear cookies or any other security issues may handle with this.
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
  }, [socket]);

  useEffect(
    () => {
      // after login get the user data.
      const getData = async function () {
        if (profileStatus !== "loading") return;
        try {
          const token = Cookies.get("token");
          const { data } = await axios.get(
            `${config.APIURI}/api/v${config.Version}/user/@me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // console.log(decrypt(data?.userData));
          const userData = decrypt(data);
          dispatch({ type: "setProfile", payload: userData.userData });
          dispatch({ type: "setProfileStatus", payload: "ready" });
        } catch (error) {
          console.log(error);
          dispatch({ type: "setProfileStatus", payload: "error" });
          Cookies.remove("token");
          navigate("/auth");
        }
      };
      getData();
    },
    [profileStatus] // Only trigger when profileStatus changes
  );

  useEffect(() => {
    // After get the user data(profile) then get the dashboard data according to the user role.
    const getData = async function () {
      if (navigationStatus !== "loading") return;
      if (!profile) return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${config.APIURI}/api/v${config.Version}/dashboard/${profile.role}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dashboardData = decrypt(data);
        dispatch({
          type: "setNavigationLinks",
          payload: dashboardData.dashboardSchema,
        });

        dispatch({ type: "setNavigationStatus", payload: "ready" });
      } catch (error) {
        dispatch({ type: "setNavigationStatus", payload: "error" });
      }
    };

    getData();
  }, [profile, navigationStatus]);

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
                <Route
                  key={
                    navigationLinks?.length ? navigationLinks?.length : 0 + 1
                  }
                  path="/"
                  element={<Navigate to="/dashboard/home" />}
                />
                <Route
                  key={
                    navigationLinks?.length ? navigationLinks?.length : 0 + 2
                  }
                  path="*"
                  element={<ErrorPage code={404} />}
                />
              </Routes>
            </div>
          </SnackbarProvider>
        </DashboardContext.Provider>
      )}
    </>
  );
};
export default Dashboard;
