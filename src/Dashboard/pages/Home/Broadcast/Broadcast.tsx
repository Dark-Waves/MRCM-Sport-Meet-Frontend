import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Broadcast.css";
import {
  faBullhorn,
  faCheckSquare,
  faExclamationCircle,
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useEffect, useState } from "react";
import DashboardContext from "../../../../context/DashboardContext";
import jsCookie from "js-cookie";
import axios from "axios";
import { config } from "../../../../../config";
import { Skeleton } from "@mui/material";

interface Message {
  content: string;
  type: string;
}

const Broadcast: React.FC = () => {
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const { socket } = useContext(DashboardContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = jsCookie.get("token");
    const getBroadcasts = async () => {
      try {
        const response = await axios.get(
          `${config.APIURI}/api/v${config.Version}/broadcast/private`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReceivedMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getBroadcasts();
  }, []);

  useEffect(() => {
    socket.on("server-message", (message) => {
      if (message.type === "message") {
        setReceivedMessages((prev) => [{ ...message.payload }, ...prev]);
      }
    });
  }, [socket]);

  const topBroadcast = receivedMessages.slice(0, 6);
  // Filter the data and get the top in the array.

  return (
    <div className="subgrid-two-item grid-common grid-c5">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Top Broadcast Messages</h3>
        <button className="grid-c-title-icon">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="grid-c5-content">
        {isLoading ? (
          <div className="grid-items">
            {[...Array(6)].map((_, index) => (
              <div className="grid-item" key={index}>
                <div className="grid-item-l">
                  <div>
                    <Skeleton variant="rounded" width={30} height={30} />
                  </div>
                  <p className="text text-silver-v1">
                    <Skeleton variant="text" width={80} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-items">
            {topBroadcast.map((messages, index) => (
              <div className="grid-item" key={index}>
                <div className="grid-item-l">
                  <div
                    className="p-3"
                  >
                    <FontAwesomeIcon
                    size='lg'
                      icon={
                        messages.type === "private"
                          ? faLock
                          : faBullhorn
                      }
                    />
                  </div>
                  <p className="text text-silver-v1">{messages.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Broadcast;
