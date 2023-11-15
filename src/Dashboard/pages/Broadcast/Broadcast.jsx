import { useState, useEffect, useContext } from "react";
import "./Broadcast.css";
import DashboardContext from "../../../Context/DashboardContext";


const Broadcast = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("public");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [error, setError] = useState("");
  const { socket } = useContext(DashboardContext)

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
          <p key={index}>{msg.message && msg.message.content}</p>
        ))}
      </div>
      <div className="error">{error && <h1>{error}</h1>}</div>
    </div>
  );
};

export default Broadcast;
