import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Broadcast.css";
import Cookies from "js-cookie";

const socket = io("http://localhost:8080");

const Broadcast = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("public");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [error, setError] = useState("");
  console.log(receivedMessages);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // Authenticate when the component mounts
      socket.emit("authenticate", token);

      // Listen for authentication success or error
      socket.on("auth-success", (data) => {
        console.log(`Authenticated as ${data.role}`);
      });
      socket.on("auth-error", (error) => {
        console.error(error);
      });

      // Listen for private and public messages
      socket.on("private-message", (message) => {
        setReceivedMessages((prev) => [...prev, { message, type: "private" }]);
      });
      socket.on("public-message", (message) => {
        console.log(message);
        setReceivedMessages((prev) => [...prev, { message, type: "public" }]);
      });

      socket.on("broadcast-error", (content) => {
        console.log(content);
        setError(content);
      });

      // Cleanup on unmount
      return () => {
        socket.off("auth-success");
        socket.off("auth-error");
        socket.off("private-message");
        socket.off("public-message");
      };
    }
  }, []);

  const handleSend = () => {
    const message = { content: messageContent, type: messageType };
    if (!messageContent) {
      return setError("Please set a messsage");
    } else {
      setError("");
    }
    socket.emit("broadcast-message", message);
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
