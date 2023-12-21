import React, { useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Common/Header/Header";
import Footer from "./Common/Footer/Footer";
import Main from "./Main/Main";
import Live from "./Live/Live";
import Events from "./Events/Events";
import Houses from "./Houses/Houses";
import ErrorPage from "../Components/Error/Error";
import { config } from "../../config";
import socketio from "socket.io-client";
import axios from "axios";
import Loader from "../Components/Loader/Loader";
import HomeContext from "../context/HomeContext";
import "./Home.css";
import Score from "./Score/Score";

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
};

interface ScoreData {
  scoreBoard: {
    eventName: string;
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
  | { type: "setWs"; payload: any };

const initialValue: State = {
  status: "loading",
  publicDataStatus: "loading",
  socket: null,
  soketStatus: "loading",
  houseData: null,
  eventData: null,
  memberData: null,
  scoreData: null,
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
  const { status, socket, soketStatus, houseData, eventData, memberData } =
    state;

  useEffect(() => {
    document.title = `${config.SiteName}`;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [houseResponse, eventResponse, memberResponse, scoreResponse] =
          await Promise.all([
            axios.get(`${config.APIURI}/api/v1/houses`),
            axios.get(`${config.APIURI}/api/v1/events/public`),
            axios.get(`${config.APIURI}/api/v1/members/public`),
            axios.get(`${config.APIURI}/api/v1/public/data/scoreBoard`),
          ]);

        if (houseResponse.data.message === "ok") {
          dispatch({
            type: "setHouseData",
            payload: houseResponse.data.HouseData,
          });
        }

        if (eventResponse.data.message === "ok") {
          dispatch({
            type: "setEventData",
            payload: eventResponse.data.events,
          });
        }

        if (memberResponse.data.message === "ok") {
          dispatch({
            type: "setMemberData",
            payload: memberResponse.data.membersData,
          });
        }

        if (scoreResponse.data.message === "ok") {
          dispatch({
            type: "setScoreData",
            payload: scoreResponse.data.payload,
          });
        }

        dispatch({ type: "setPublicDataStatus", payload: "ready" });
      } catch (error) {
        dispatch({ type: "setStatus", payload: "error" });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = socketio(`${APIURI}/v1/public`, {
      transports: ["websocket"],
    });
    dispatch({ type: "setWs", payload: socket });
    socket.on("connect", () => {
      dispatch({ type: "setSoketStatus", payload: "ready" });
    });
    socket.on("server-message", (message: any) => {
      console.log(message);
    });
    return () => {
      socket.close();
    };
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
                <Route path="/live" element={<Live />} />
                <Route path="/events" element={<Events />} />
                <Route path="/houses" element={<Houses />} />
                <Route path="/score" element={<Score />} />
                <Route path={"*"} element={<ErrorPage code={404} />} />
              </Routes>
              <Footer />
            </HomeContext.Provider>
          </>
        )
      )}
    </div>
  );
};

export default Home;
