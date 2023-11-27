import Header from "./Common/Header/Header";
import Footer from "./Common/Footer/Footer";
import "./Home.css";
import { Route, Routes } from "react-router-dom";
import Main from "./Main/Main";
import Live from "./Live/Live";
import Events from "./Events/Events";
import Houses from "./Houses/Houses";
import ErrorPage from "../Components/Error/Error";
import { useEffect, useReducer } from "react";
import { config } from "../../config";
import socketio from "socket.io-client";
import axios from "axios";
import Loader from "../Components/Loader/Loader";
import HomeContext from "../context/HomeContext";
const APIURI = config.APIURI;

const initialValue = {
  status: "loading",
  publicDataStatus: "loading",
  socket: null,
  soketStatus: "loading",
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setPublicData": {
      return { ...state, publicData: action.payload };
    }
    case "setPublicDataStatus": {
      return { ...state, publicDataStatus: action.payload };
    }
    case "setSoketStatus": {
      return { ...state, soketStatus: action.payload };
    }
    case "setWs": {
      return { ...state, socket: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, publicDataStatus, publicData, socket, soketStatus } = state;
  /**Client Updates Checking */

  useEffect(function () {
    document.title = `${config.SiteName}`;
  }, []);

  useEffect(
    function () {
      if (!publicData) return;
      if (!socket) return;
      dispatch({ type: "setStatus", payload: "ready" });
    },
    [publicData, socket]
  );

  useEffect(function () {
    const socket = socketio(`${APIURI}/v1/public`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: socket });
    socket.on("connect", () => {
      dispatch({ type: "setSoketStatus", payload: "ready" });
    });
    socket.on("server-message", (message) => {
      console.log(message);
    });
    return () => {
      socket.close();
    };
  }, []);

  useEffect(
    function () {
      const getData = async function () {
        if (publicDataStatus !== "loading") return;
        try {
          const { data } = await axios.get(
            `${config.APIURI}/api/v1/public/data`
          );
          dispatch({ type: "setPublicData", payload: data });
          dispatch({ type: "setPublicDataStatus", payload: "ready" });
        } catch (error) {
          dispatch({ type: "setPublicDataStatus", payload: "error" });
        }
      };
      getData();
    },
    [publicDataStatus] // Only trigger when profileStatus changes
  );

  return (
    <div className="flex-col landing-page">
      {status === "loading" ? (
        <Loader />
      ) : status === "error" ? (
        <ErrorPage code={400} />
      ) : (
        status === "ready" && (
          <>
            <HomeContext.Provider value={{ ...state, dispatch }}>
              <Header />
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/live" element={<Live />} />
                <Route path="/events" element={<Events />} />
                <Route path="/houses" element={<Houses />} />
                <Route path={"*"} element={<ErrorPage code={404} />} />
              </Routes>
              <Footer />
            </HomeContext.Provider>
          </>
        )
      )}
    </div>
  );
}
