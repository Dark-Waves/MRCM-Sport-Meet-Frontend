import React, { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Common/Header/Header";
import Main from "./Main/Main";
import Events from "./Events/Events";
import ErrorPage from "../Components/Error/Error";
import { config } from "../../config";
import socketio from "socket.io-client";
import axios from "axios";
import Loader from "../Components/Loader/Loader";
import HomeContext, { State, Action } from "../context/HomeContext";
import "./Home.css";
import Score from "./Score/Score";
import { decrypt } from "../utils/aes";
import HouseScores from "./HouseScores/HouseScores";
import Live from "./Live/Live";

const APIURI = config.APIURI;

const initialValue: State = {
  status: "loading",
  publicDataStatus: "loading",
  socket: null,
  soketStatus: "loading",
  houseData: null,
  eventData: null,
  memberData: null,
  scoreData: null,
  homeData: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "setStatus":
      return { ...state, status: action.payload };
    case "setPublicDataStatus":
      return { ...state, publicDataStatus: action.payload };
    case "setSoketStatus":
      return { ...state, soketStatus: action.payload };
    case "setHouseData":
      return { ...state, houseData: action.payload };
    case "setEventData":
      return { ...state, eventData: action.payload };
    case "setMemberData":
      return { ...state, memberData: action.payload };
    case "setScoreData":
      return { ...state, scoreData: action.payload };
    case "setHomeData":
      return { ...state, homeData: action.payload };
    case "setWs":
      return { ...state, socket: action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const {
    status,
    socket,
    soketStatus,
    houseData,
    eventData,
    memberData,
    scoreData,
    publicDataStatus,
  } = state;

  useEffect(() => {
    document.title = `${config.SiteName}`;
  }, []);

  useEffect(() => {
    console.log(
      status !== "loading" &&
        houseData &&
        eventData &&
        memberData &&
        socket &&
        soketStatus === "ready"
    );
    if (
      status === "loading" &&
      soketStatus === "ready" &&
      publicDataStatus === "ready"
    ) {
      dispatch({ type: "setStatus", payload: "ready" });
    }
  }, [status, houseData, eventData, memberData, socket, soketStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          houseResponse,
          eventResponse,
          memberResponse,
          scoreResponse,
          homeDataResponse,
        ] = await Promise.all([
          axios.get(`${config.APIURI}/api/v${config.Version}/houses`),
          axios.get(`${config.APIURI}/api/v${config.Version}/events/public`),
          axios.get(`${config.APIURI}/api/v${config.Version}/members/public`),
          axios.get(
            `${config.APIURI}/api/v${config.Version}/public/data/scoreBoard`
          ),
          axios.get(`${config.APIURI}/api/v${config.Version}/public/data/home`),
        ]);

        const houseResponseData = decrypt(houseResponse.data);
        if (houseResponseData.message === "ok") {
          dispatch({
            type: "setHouseData",
            payload: houseResponseData.HouseData,
          });
        }

        const eventResponseData = decrypt(eventResponse.data);
        if (eventResponseData.message === "ok") {
          dispatch({ type: "setEventData", payload: eventResponseData.events });
        }

        const memberResponseData = decrypt(memberResponse.data);
        if (memberResponseData.message === "ok") {
          dispatch({
            type: "setMemberData",
            payload: memberResponseData.membersData,
          });
        }

        const scoreResponseData = decrypt(scoreResponse.data);
        if (scoreResponseData.message === "ok") {
          dispatch({
            type: "setScoreData",
            payload: scoreResponseData.payload,
          });
        }

        const homeResponseData = decrypt(homeDataResponse.data);
        if (homeResponseData.message === "ok") {
          dispatch({ type: "setHomeData", payload: homeResponseData.payload });
        }

        dispatch({ type: "setPublicDataStatus", payload: "ready" });
      } catch (error) {
        console.error(error);
        dispatch({ type: "setStatus", payload: "error" });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const wasocket = socketio(`${APIURI}/v${config.Version}/public`, {
      transports: ["websocket"],
    });

    wasocket.on("connect", () => {
      dispatch({ type: "setSoketStatus", payload: "ready" });
    });

    dispatch({ type: "setWs", payload: wasocket });

    return () => {
      wasocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (d: any) => {
      const data: { type: string; payload: any } = decrypt(d);

      switch (data.type) {
        case "eventUpdate":
          dispatch({
            type: "setScoreData",
            payload: {
              eventTypes: scoreData?.eventTypes || [],
              scoreBoard: [
                ...(scoreData?.scoreBoard || []),
                data.payload.scoreBoard,
              ],
            },
          });
          break;

        case "houseScoreUpdate":
          if (!houseData) return;
          const updatedHouseData = data.payload.wsSendHouseData.map(
            (updatedHouse) => {
              const index = houseData.findIndex(
                (house) => house._id === updatedHouse._id
              );

              if (index !== -1) {
                return {
                  ...houseData[index],
                  houseScore: updatedHouse.houseScore,
                };
              }

              return updatedHouse;
            }
          );
          dispatch({ type: "setHouseData", payload: updatedHouseData });
          break;

        case "message":
          console.log(data.payload);
          break;

        default:
          console.warn("Unknown socket message type:", data.type);
      }
    };

    socket.on("server-message", handleSocketMessage);

    return () => {
      socket.off("server-message", handleSocketMessage);
    };
  }, [socket, scoreData, houseData]);

  return (
    <div className="flex-col landing-page position-relative">
      {status === "loading" ? (
        <Loader />
      ) : status === "error" ? (
        <ErrorPage code={400} />
      ) : status === "ready" ? (
        <HomeContext.Provider value={{ state, dispatch }}>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/score" element={<Score />} />
            <Route path="/housescores" element={<HouseScores />} />
            <Route path="*" element={<ErrorPage code={404} />} />
          </Routes>
        </HomeContext.Provider>
      ) : null}
    </div>
  );
};

export default Home;
