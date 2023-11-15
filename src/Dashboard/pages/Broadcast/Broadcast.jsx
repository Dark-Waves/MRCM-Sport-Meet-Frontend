import { useState, useEffect, useContext } from "react";
import "./Broadcast.css";
import DashboardContext from "../../../Context/DashboardContext";
import axios from "axios";
import Cookies from "js-cookie";
import { config } from "../../../../config";

const Broadcast = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("public");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [error, setError] = useState("");
  const { socket } = useContext(DashboardContext);
  const [isLoading, setIsLoading] = useState(true);

  const handleSend = () => {
    const message = { content: messageContent, type: messageType };
    if (!messageContent) {
      return setError("Please set a messsage");
    } else {
      setError("");
    }
    socket.emit("client-message", { type: "message", payload: message });
    setMessageContent("");
  };

  useEffect(
    function () {
      const token = Cookies.get("token");
      const getBroadcasts = async () => {
        try {
          const response = await axios.get(
            `${config.APIURI}/api/v1/broadcast/private`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response);
          setReceivedMessages((prev) =>
            [...response.data.messages, ...prev].reverse()
          );
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      getBroadcasts();
      socket.on("server-message", (message) => {
        if (message.type === "message") {
          console.log(message);
          setReceivedMessages((prev) => [{ ...message.payload }, ...prev]);
        }
      });
    },
    [socket]
  );

  return (
    <div className="broadcast">
      <textarea
        placeholder="Enter your broadcast message here"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <select
        value={messageType}
        onChange={(e) => setMessageType(e.target.value)}
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>
      <button onClick={handleSend}>Send Broadcast</button>
      <div>
        <h2>Received Messages:</h2>
        {receivedMessages.map((msg, index) => (
          <p key={index}>
            {msg.content} - {msg.type}
          </p>
        ))}
      </div>
      <div className="error">{error && <h1>{error}</h1>}</div>
    </div>
  );
};

export default Broadcast;
