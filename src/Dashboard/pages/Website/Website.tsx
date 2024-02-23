import React, { useState, useEffect, useReducer } from "react";
import "./Website.css";
import WebSettings from "./WebSettings/WebSettings";
import WebContent from "./WebContent/WebContent";
import Configuration from "./Configuration/Configuration";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import axios from "axios";
import { config } from "../../../../config";
import { decrypt } from "../../../utils/aes";

export type State = {
  status: string;
  publicDataStatus: string;
  homeData: HomeData[] | null;
};

interface ImageData {
  image_id?: string | null;
  url?: string | null;
}

export interface HomeData {
  type: string;
  value: {
    dataType: "image" | "content";
    contnet?: string;
    image_id?: string;
    url?: string;
  };
}


export type Action =
  | { type: "setStatus"; payload: string }
  | { type: "setPublicDataStatus"; payload: string }
  | { type: "setHomeData"; payload: any };

const initialValue: State = {
  status: "loading",
  publicDataStatus: "loading",
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
    case "setHomeData": {
      return { ...state, homeData: action.payload };
    }
    default: {
      throw new Error("Method not found");
    }
  }
};

const Website: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeDataResponse] = await Promise.all([
          axios.get(`${config.APIURI}/api/v${config.Version}/public/data/home`),
        ]);

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
  return (
    <div className="website main-content-holder">
      <Routes>
        {/* Pass the overviewProps as props to the Overview component */}
        <Route
          path="/"
          index
          element={<Overview dispatch={dispatch} {...state} />}
        />
        <Route path="Content" element={<WebContent dispatch={dispatch} {...state} />} />
        <Route path="Settings" element={<WebSettings dispatch={dispatch} {...state} />} />
        <Route path="Configuration" element={<Configuration />} />
      </Routes>
    </div>
  );
};
export default Website;
