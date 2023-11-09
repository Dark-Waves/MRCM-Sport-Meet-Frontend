import React, { useState } from "react";
import "./Broadcast.css";

const initialFilters = {
  grade: [],
  events: [],
  school: "all",
};

const initialMessage = {
  message: "",
  filter: { ...initialFilters },
  content: "",
};

export default function Broadcast() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "message 1",
      filter: { grade: [6, 7, 8], events: [2, 6, 3], school: "all" },
      content:
        "Event , Event 3 ,Event 6, will start after 5 minutes. Get ready!",
    },
    // Add more messages as needed
  ]);

  const [newMessage, setNewMessage] = useState({ ...initialMessage });

  const handleAddMessage = () => {
    setMessages([...messages, { id: messages.length + 1, ...newMessage }]);
    setNewMessage({ ...initialMessage });
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter((message) => message.id !== id);
    setMessages(updatedMessages);
  };

  return (
    <div className="broadcast main-content-holder grid-common">
      <div className="grid-c-title">
        <h1 className="grid-c-title-text">Broadcast Messages</h1>
      </div>

      <div className="message-input">
        <textarea
          placeholder="Enter your message here"
          value={newMessage.message}
          onChange={(e) =>
            setNewMessage({ ...newMessage, message: e.target.value })
          }
        />
      </div>

      <div className="filters flex-row-bet">
        <div className="inpt-content flex-col">
          <label htmlFor="grade">Grade</label>
          <input
            id="grade"
            type="text"
            placeholder="e.g., 6, 7, 8"
            value={newMessage.filter.grade.join(", ")}
            onChange={(e) =>
              setNewMessage({
                ...newMessage,
                filter: {
                  ...newMessage.filter,
                  grade: e.target.value.split(", "),
                },
              })
            }
          />
        </div>
        <div className="ipt-content flex-col">
          {" "}
          <label htmlFor="event">Events</label>
          <input
            id="event"
            type="text"
            placeholder="e.g., 2, 6, 3"
            value={newMessage.filter.events.join(", ")}
            onChange={(e) =>
              setNewMessage({
                ...newMessage,
                filter: {
                  ...newMessage.filter,
                  events: e.target.value.split(", "),
                },
              })
            }
          />
        </div>
        <div className="ipt-content flex-col">
          {" "}
          <label htmlFor="school">School</label>
          <input
            id="school"
            type="text"
            placeholder="all"
            value={newMessage.filter.school}
            onChange={(e) =>
              setNewMessage({
                ...newMessage,
                filter: { ...newMessage.filter, school: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="message-content">
        <textarea
          placeholder="Enter message content here"
          value={newMessage.content}
          onChange={(e) =>
            setNewMessage({ ...newMessage, content: e.target.value })
          }
        />
      </div>

      <button onClick={handleAddMessage}>Add Message</button>

      <div className="message-list">
        {messages.map((message) => (
          <div className="message flex-row-bet" key={message.id}>
            <div className="content">
              <h2>{message.message}</h2>
              <p>Grade: {message.filter.grade.join(", ")}</p>
              <p>Events: {message.filter.events.join(", ")}</p>
              <p>School: {message.filter.school}</p>
              <p>{message.content}</p>
            </div>
            <button onClick={() => handleDeleteMessage(message.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
