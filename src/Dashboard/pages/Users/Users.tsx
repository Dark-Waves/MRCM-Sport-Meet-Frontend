import { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import AddUsers from "./AddUsers/AddUsers";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import Loader from "../../../Components/Loader/Loader";
import ErrorPage from "../../../Components/Error/Error";
import React from "react";
import { decrypt } from "../../../utils/aes";
import Edit from "./Edit/Edit";

export type RoleType = "owner" | "admin" | "staff" | "";

export interface RolesData {
  roleIndex: 1 | 2 | 3;
  roleType: RoleType;
}
export interface UserData {
  id: string;
  name: string;
  roles: {
    roleType: string;
    roleIndex: number;
  };
  userName: string;
  // Define other properties as needed
}

interface CurrentUserData {
  id: string;
  name: string;
  role: string;
  userName: string;
}

export interface CurrentUser {
  email: string
  name: string;
  profilePicture: {
    image_id: string;
    url: string;
  };
  role: string;
  userName: string
}

export interface State {
  status: "loading" | "error" | "ready";
  userData: CurrentUserData[] | null;
  userDataStatus: "loading" | "error" | "ready";
  allUserData: UserData[] | null;
  allUserDataStatus: "loading" | "error" | "ready";
  allRoles: RolesData[] | null;
  allRolesStatus: "loading" | "error" | "ready";
  currentUser: CurrentUser | null;
  currentUserStatus: "loading" | "error" | "ready";
}

export type Action =
  | { type: "setStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setUserData"; payload: any[] }
  | { type: "setUserDataStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setAllUserData"; payload: any[] }
  | { type: "setAllUserDataStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setAllRoles"; payload: any[] }
  | { type: "setAllRolesStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setCurrentUser"; payload: any }
  | { type: "setCurrentUserStatus"; payload: "loading" | "error" | "ready" };

const initialValue: State = {
  status: "loading",
  userData: null,
  userDataStatus: "loading",
  allUserData: null,
  allUserDataStatus: "loading",
  allRoles: null,
  allRolesStatus: "loading",
  currentUser: null,
  currentUserStatus: "loading",
};

const reducer = function (state: State, action: Action): State {
  switch (action.type) {
    case "setStatus":
      return { ...state, status: action.payload };
    case "setUserData":
      return { ...state, userData: action.payload };
    case "setUserDataStatus":
      return { ...state, userDataStatus: action.payload };
    case "setAllUserData":
      return { ...state, allUserData: action.payload };
    case "setAllUserDataStatus":
      return { ...state, allUserDataStatus: action.payload };
    case "setAllRoles":
      return { ...state, allRoles: action.payload };
    case "setAllRolesStatus":
      return { ...state, allRolesStatus: action.payload };
    case "setCurrentUser": {
      return { ...state, currentUser: action.payload };
    }
    case "setCurrentUserStatus": {
      return { ...state, currentUserStatus: action.payload };
    }
    default:
      throw new Error("Method not found");
  }
};

const Users: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const {
    status,
    userData,
    userDataStatus,
    allUserData,
    allUserDataStatus,
    allRoles,
    allRolesStatus,
    currentUser,
    currentUserStatus,
  } = state;

  useEffect(() => {
    if (
      userDataStatus === "loading" ||
      allUserDataStatus === "loading" ||
      allRolesStatus === "loading" ||
      currentUserStatus === "loading" ||
      !allUserData ||
      !userData ||
      !allRoles ||
      !currentUser
    ) {
      return;
    }
    dispatch({ type: "setStatus", payload: "ready" });
  }, [
    userData,
    allUserData,
    allUserDataStatus,
    userDataStatus,
    allRolesStatus,
    allRoles,
    currentUserStatus,
    currentUser,
  ]);

  useEffect(() => {
    const getData = async () => {
      if (userDataStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${config.APIURI}/api/v${config.Version}/role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch({ type: "setUserDataStatus", payload: "ready" });
        dispatch({ type: "setUserData", payload: data.lowerUsers });
      } catch (error) {
        dispatch({ type: "setStatus", payload: "error" });
      }
    };
    getData();
  }, [userDataStatus]);

  useEffect(() => {
    const getData = async () => {
      if (allUserDataStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/user/@all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = decrypt(response.data);
        dispatch({ type: "setAllUserDataStatus", payload: "ready" });
        dispatch({
          type: "setAllUserData",
          payload: data.userData,
        });
      } catch (error) {
        dispatch({ type: "setStatus", payload: "error" });
      }
    };
    getData();
  }, [allUserDataStatus]);

  useEffect(() => {
    const getData = async () => {
      if (allRolesStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(
          `${config.APIURI}/api/v${config.Version}/role/access`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch({ type: "setAllRolesStatus", payload: "ready" });
        dispatch({
          type: "setAllRoles",
          payload: data.lowerRoles,
        });
      } catch (error) {
        dispatch({ type: "setStatus", payload: "error" });
      }
    };
    getData();
  }, [allRolesStatus]);

  useEffect(() => {
    const getData = async () => {
      if (currentUserStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/user/@me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = decrypt(response.data);
        dispatch({ type: "setCurrentUserStatus", payload: "ready" });
        dispatch({
          type: "setCurrentUser",
          payload: data.userData,
        });
      } catch (error) {
        dispatch({ type: "setStatus", payload: "error" });
      }
    };
    getData();
  }, [currentUserStatus]);
  return (
    <div className="events main-content-holder position-relative h-full">
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <div>
          <Routes>
            <Route path="/" index element={<Overview {...state} />} />
            <Route
              path="/Add"
              element={<AddUsers {...state} dispatch={dispatch} />}
            />
            <Route
              path="/Edit"
              element={<Edit {...state} dispatch={dispatch} />}
            />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default Users;
