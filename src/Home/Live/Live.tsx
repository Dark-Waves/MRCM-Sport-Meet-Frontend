import React, { useContext, useEffect, useState } from "react";
import "./Live.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import HomeContext from "../../context/HomeContext";
import { config } from "../../../config";
import { decrypt } from "../../utils/aes";

const Live: React.FC = () => {
  const { state } = useContext(HomeContext);
  const [message, setMessage] = useState("");
  // Socket data extraction
  useEffect(() => {
    if (!state.socket) return;

    const handleSocketMessage = (d: any) => {
      const data: { type: string; payload: any } = decrypt(d);

      if (data.type === "message") {
        console.log(data.payload);
        setMessage(data.payload.content);
      }
    };

    state.socket.on("server-message", handleSocketMessage);

    return () => {
      if (!state.socket) return
      state.socket.off("server-message", handleSocketMessage);
    };
  }, [state.socket]);
  return (
    <div className="house-scores p-t-8 m-t-8 flex fex-col g-5">
      <div className="youtube-live flex flex-col g-5 flex-center" style={{ zIndex: 111111 }}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/LIVESTREAM_VIDEO_ID"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <div className="message-container text-center flex-center align-center" style={{maxWidth:"500px"}}>
          <span className="font-weight-700 font-2xl">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Live;
