import React, { useContext, useEffect, useReducer, useState } from "react";
import DashboardContext from "../../../context/DashboardContext";
import Intro from "./Intro/Intro";
import Top_login from "./Top_login/Top_login";
import Report from "./Usage/Usage";
import Info from "./Info/Info";
import Broadcast from "./Broadcast/Broadcast";
import System from "./System/System";
import Financial from "./Financial/Financial";
import "./Home.css";
import Loader from "../../../Components/Loader/Loader";

interface SystemData {
  id: number;
  type: string;
  usage: string;
  data: {
    _id: number;
    title: string;
    amount: string;
  }[];
}

export interface State {
  status: {
    mainStatus: string;
    SystemState: string;
  };
  systemData: SystemData[] | null;
}

export type Action =
  | { type: "setStatus"; payload: string }
  | { type: "setSystemData"; payload: SystemData[] }
  | { type: "setSystemDataStatus"; payload: string };

const initialValue: State = {
  status: {
    mainStatus: "loading",
    SystemState: "loading", // Initially set to loading
  },
  systemData: null,
};

const reducer = function (state: State, action: Action): State {
  switch (action.type) {
    case "setStatus": {
      return {
        ...state,
        status: { ...state.status, mainStatus: action.payload },
      };
    }
    case "setSystemData": {
      return { ...state, systemData: action.payload };
    }
    case "setSystemDataStatus": {
      return {
        ...state,
        status: { ...state.status, SystemState: action.payload },
      };
    }
    default:
      throw new Error("Method not found");
  }
};

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, systemData } = state;

  const { socket } = useContext(DashboardContext);

  useEffect(() => {
    if (status.SystemState !== "ready") return;

    dispatch({ type: "setStatus", payload: "ready" });
  }, [status]);

  useEffect(() => {
    socket.on("server-message", (args: any) => {
      if (args.type === "systemInfo") {
        dispatch({ type: "setSystemDataStatus", payload: "ready" });
        dispatch({ type: "setSystemData", payload: args.payload });
      }
    });
  }, [socket]);

  if (status.mainStatus === "loading") {
    return <Loader />;
  }

  return (
    <div className="main-content-holder position-relative h-full">
      <div className="content-grid-one">
        <Intro />
        <Top_login />
        <Report />
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
            {status.mainStatus === "ready" && (
              <System systemData={systemData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
