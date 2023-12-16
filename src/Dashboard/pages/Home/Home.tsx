import React, { useContext, useEffect, useReducer } from "react";
import DashboardContext from "../../../context/DashboardContext";
import Intro from "./Intro/Intro";
import Top_login from "./Top_login/Top_login";
import Houses from "./Houses/Houses";
import Info from "./Info/Info";
import Broadcast from "./Broadcast/Broadcast";
import System from "./System/System";
import Financial from "./Financial/Financial";
import "./Home.css";
import Loader from "../../../Components/Loader/Loader";
import ErrorPage from "../../../Components/Error/Error";

export interface State {
  status: string;
}

export type Action = { type: "setStatus"; payload: string };

const initialValue: State = {
  status: "loading",
};

const reducer = function (state: State, action: Action): State {
  switch (action.type) {
    case "setStatus": {
      return {
        ...state,
        status: action.payload,
      };
    }
    default:
      throw new Error("Method not found");
  }
};

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status } = state;

  useEffect(() => {
    if (status !== "loading") return;
    dispatch({ type: "setStatus", payload: "ready" });
  }, []);

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "error") {
    return <ErrorPage code={400} />;
  }

  return (
    <div className="main-content-holder position-relative h-full">
      <div className="content-grid-one">
        <Intro />
        <Top_login />
        <Houses />
      </div>
      <div className="content-grid-two">
        <Info />
        <div className="grid-two-item">
          <div className="subgrid-two">
            <Broadcast />
            <Financial />
          </div>
        </div>

        <div className="grid-two-item">
          <div className="subgrid-two">
            <System />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
