import React, { useContext, useEffect, useState } from "react";
import "./Live.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { State } from "../Home";
import HomeContext from "../../context/HomeContext";
import { config } from "../../../config";
import { decrypt } from "../../utils/aes";

const Live: React.FC = () => {
  const { houseData, homeData, socket }: State = useContext(HomeContext);
  const [message, setMessage] = useState("");
  // Socket data extraction
  useEffect(() => {
    if (!socket) return;

    const handleSocketMessage = (d: any) => {
      const data: { type: string; payload: any } = decrypt(d);

      if (data.type === "message") {
        console.log(data.payload);
        setMessage(data.payload.content);
      }
    };

    socket.on("server-message", handleSocketMessage);

    return () => {
      socket.off("server-message", handleSocketMessage);
    };
  }, [socket]);
  return (
    <div className="house-scores p-t-8 m-t-8 flex fex-col g-5">
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/LIVESTREAM_VIDEO_ID"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <span className="font-weight-700 font-2xl">{message}</span>
    </div>
  );
};

export default Live;
