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
import HomeContext from "../context/HomeContext";
import "./Home.css";
import Score from "./Score/Score";
import { decrypt } from "../utils/aes";

const APIURI = config.APIURI;
/**
 * Public Home data Main state
 */
export type State = {
  status: string;
  publicDataStatus: string;
  socket: any;
  soketStatus: string;
  houseData: HouseData[] | null;
  eventData: EventData[] | null;
  memberData: MemberData[] | null;
  scoreData: ScoreData | null;
  homeData: HomeData[] | null;
};

interface ScoreData {
  scoreBoard: {
    eventName: string;
    state: string;
    eventType: {
      option: string;
    }[];
    inputType: string;
    places: {
      house: string;
      score: number;
      member: string;
      MemberID: string;
      place: number;
    }[];
  }[];
  eventTypes: {
    _id: string;
    name: string;
    options: {
      _id: string;
      option: string;
    }[];
  }[];
}

interface HomeData {
  type: string;
  value: {
    dataType: "image" | "content";
    contnet?: string;
    image_id?: string;
    url?: string;
  };
}

interface MemberData {
  _id: string;
  Name: string;
  House: string;
  Grade: string;
  MemberID: number;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  types: {
    _id: string;
    option: string;
    selection: string;
  }[];
  state: string;
  places: any[];
}

interface HouseData {
  _id: string;
  houseScore: number;
  members: {
    _id: string;
    admissionID: number;
  }[];
  eventData: {
    _id: string;
    eventId: string;
    participants: {
      marks: number;
      place: number;
      userAdmissionId: string;
      userName: string;
    }[];
  }[];
  Name: string;
  description: string;
}

type Action =
  | { type: "setStatus"; payload: string }
  | { type: "setPublicDataStatus"; payload: string }
  | { type: "setSoketStatus"; payload: string }
  | { type: "setHouseData"; payload: any }
  | { type: "setEventData"; payload: any }
  | { type: "setMemberData"; payload: any }
  | { type: "setScoreData"; payload: any }
  | { type: "setWs"; payload: any }
  | { type: "setHomeData"; payload: any };

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
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setPublicDataStatus": {
      return { ...state, publicDataStatus: action.payload };
    }
    case "setSoketStatus": {
      return { ...state, soketStatus: action.payload };
    }
    case "setHouseData": {
      return { ...state, houseData: action.payload };
    }
    case "setEventData": {
      return { ...state, eventData: action.payload };
    }
    case "setMemberData": {
      return { ...state, memberData: action.payload };
    }
    case "setScoreData": {
      return { ...state, scoreData: action.payload };
    }
    case "setHomeData": {
      return { ...state, homeData: action.payload };
    }
    case "setWs": {
      return { ...state, socket: action.payload };
    }
    default: {
      throw new Error("Method not found");
    }
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
  } = state;

  useEffect(() => {
    document.title = `${config.SiteName}`;
  }, []);

  useEffect(() => {
    const loading =
      status !== "loading" ||
      !houseData ||
      !eventData ||
      !memberData ||
      !socket ||
      !soketStatus;

    if (!loading) {
      dispatch({ type: "setStatus", payload: "ready" });
    }
  }, [status, houseData, eventData, memberData, socket, soketStatus]);

  // Public Api data extraction
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
          dispatch({
            type: "setEventData",
            payload: eventResponseData.events,
          });
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
          console.log(scoreResponseData);
          dispatch({
            type: "setScoreData",
            payload: scoreResponseData.payload,
          });
        }

        const homeResponseData = decrypt(homeDataResponse.data);
        if (homeResponseData.message === "ok") {
          console.log(homeResponseData);
          dispatch({
            type: "setHomeData",
            payload: homeResponseData.payload,
          });
        }

        dispatch({ type: "setPublicDataStatus", payload: "ready" });
      } catch (error) {
        console.log(error);
        dispatch({ type: "setStatus", payload: "error" });
      }
    };

    fetchData();
  }, []);

  // Public Socket connection
  useEffect(() => {
    const wasocket = socketio(`${APIURI}/v${config.Version}/public`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: wasocket });
    wasocket.on("connect", () => {
      dispatch({ type: "setSoketStatus", payload: "ready" });
    });
    return () => {
      wasocket.close();
    };
  }, []);

  // Socket data extraction
  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (d: any) => {
      const data: { type: string; payload: any } = decrypt(d);

      if (data.type === "eventUpdate") {
        dispatch({
          type: "setScoreData",
          payload: {
            eventTypes: scoreData?.eventTypes || [], // Keep the existing eventTypes
            scoreBoard: [
              ...(scoreData?.scoreBoard || []), // Existing scoreBoard
              data.payload.scoreBoard, // Add incoming scoreBoard
            ],
          },
        });
      }

      if (data.type === "houseScoreUpdate") {
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

            return updatedHouse; // If not found, keep the original object
          }
        );
        dispatch({
          type: "setHouseData",
          payload: updatedHouseData,
        });
      }

      if (data.type === "message") {
        console.log(data.payload);
      }
    };

    socket.on("server-message", handleSocketMessage);

    return () => {
      socket.off("server-message", handleSocketMessage);
    };
  }, [socket, scoreData]);

  return (
    <div className="flex-col landing-page position-relative">
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
                <Route path="/events" element={<Events />} />
                <Route path="/score" element={<Score />} />
                <Route path={"*"} element={<ErrorPage code={404} />} />
              </Routes>
            </HomeContext.Provider>
          </>
        )
      )}
    </div>
  );
};

export default Home;
