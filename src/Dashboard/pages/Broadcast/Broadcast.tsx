import React, { useState, useEffect, useContext } from "react";
import "./Broadcast.css";
import DashboardContext from "../../../context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../../config";
import { TextField } from "@mui/material";
import Button from "../../UI/Button/Button";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { faBullhorn, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../../Components/Loader/Loader";

interface Message {
  content: string;
  type: string;
}

const Broadcast: React.FC = () => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("public");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");
  const { socket } = useContext(DashboardContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSend = () => {
    const message: Message = { content: messageContent, type: messageType };
    if (!messageContent) {
      return setError("Please set a message");
    } else {
      setError("");
    }
    socket.emit("client-message", { type: "message", payload: message });
    setMessageContent("");
  };

  const handleMessageType = (e: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) {
      setMessageType(value);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    const getBroadcasts = async () => {
      try {
        const response = await axios.get(`${config.APIURI}/api/v1/broadcast/private`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReceivedMessages((prev) => [...response.data.messages, ...prev].reverse());
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

  return (
    <div className="broadcast grid-common position-relative h-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="top-actions-broadcast w-full g-5 flex-col">
            <div className="brodcast_send_msg flex-col-bet g-4 w-full">
              <TextField
                fullWidth
                maxRows={4}
                minRows={3}
                label="Enter your broadcast message here"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-50"
              />
              <ToggleButtonGroup
                value={messageType}
                exclusive
                onChange={handleMessageType}
                color="success"
                fullWidth
              >
                <ToggleButton
                  value="private"
                  aria-label="private"
                  color="primary"
                >
                  <FontAwesomeIcon icon={faLock} />
                </ToggleButton>
                <ToggleButton
                  value="public"
                  aria-label="public"
                  color="primary"
                >
                  <FontAwesomeIcon icon={faBullhorn} />
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                className="w-full"
                variant="contained"
                onClick={handleSend}
              >
                Send Broadcast
              </Button>
            </div>
          </div>
          <div>
            <h2>Received Messages:</h2>
            {receivedMessages.map((msg, index) => (
              <p key={index}>
                {msg.content} - {msg.type}
              </p>
            ))}
          </div>
          <div className="error">{error && <h1>{error}</h1>}</div>
        </>
      )}
    </div>
  );
};

export default Broadcast;
