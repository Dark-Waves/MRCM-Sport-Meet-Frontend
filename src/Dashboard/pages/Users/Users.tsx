import { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import AddUsers from "./AddUsers/AddUsers";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import Loader from "../../../Components/Loader/Loader";
import ErrorPage from "../../../Components/Error/Error";

interface State {
  status: "loading" | "error" | "ready";
  userData: any[] | null;
  userDataStatus: "loading" | "error" | "ready";
  allUserData: any[] | null;
  allUserDataStatus: "loading" | "error" | "ready";
}

type Action =
  | { type: "setStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setUserData"; payload: any[] }
  | { type: "setUserDataStatus"; payload: "loading" | "error" | "ready" }
  | { type: "setAllUserData"; payload: any[] }
  | { type: "setAllUserDataStatus"; payload: "loading" | "error" | "ready" };

const initialValue: State = {
  status: "loading",
  userData: null,
  userDataStatus: "loading",
  allUserData: null,
  allUserDataStatus: "loading",
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
    default:
      throw new Error("Method not found");
  }
};

const Users: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, userData, userDataStatus, allUserData, allUserDataStatus } =
    state;

  useEffect(() => {
    if (
      userDataStatus === "loading" ||
      allUserDataStatus === "loading" ||
      !allUserData ||
      !userData
    ) {
      return;
    }
    if (allUserData.length && userData.length) {
      dispatch({ type: "setStatus", payload: "ready" });
    }
  }, [userData, allUserData, allUserDataStatus, userDataStatus]);

  useEffect(() => {
    const getData = async () => {
      if (userDataStatus !== "loading") return;
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const { data } = await axios.get(`${config.APIURI}/api/v1/user/@all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  return (
    <div className="events main-content-holder">
      {status === "loading" && <Loader />}
      {status === "error" && <ErrorPage code={400} />}
      {status === "ready" && (
        <div>
          <Routes>
            <Route
              path="/"
              index
              element={<Overview {...state} dispatch={dispatch} />}
            />
            <Route
              path="/Add"
              element={<AddUsers {...state} dispatch={dispatch} />}
            />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default Users;
