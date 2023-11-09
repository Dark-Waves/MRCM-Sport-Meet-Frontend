import React, { useState } from 'react';
import { events, users } from '../../../data/data';
import './Controller.css';

export default function Controller() {
  const [eventStatus, setEventStatus] = useState('stopped');

  const toggleEventStatus = () => {
    setEventStatus(eventStatus === 'started' ? 'stopped' : 'started');
  };

  const selectParticipants = (grade) => {
    // Implement your logic to select participants by grade here
    // For example, you can filter users based on their grade
  };

  return (
    <div className="event-controller">
      <div className="grid-common">
        <div className="grid-c-title">
          <span className="grid-c-title-text">Event Status:</span>
          <button
            className={`event-status-button ${eventStatus}`}
            onClick={toggleEventStatus}
          >
            {eventStatus === 'started' ? 'Stop Event' : 'Start Event'}
          </button>
        </div>

        <div className="grid-c-title">
          <span className="grid-c-title-text">Select Participants:</span>
          <div className="grade-buttons">
            <button
              className="grade-button"
              onClick={() => selectParticipants(6)}
            >
              Grade 6
            </button>
            <button
              className="grade-button"
              onClick={() => selectParticipants(7)}
            >
              Grade 7
            </button>
            {/* Add buttons for other grades as needed */}
          </div>
        </div>

        <div className="event-data">
          <h2>Event Details:</h2>
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.title}</strong>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>

          <h2>User Details:</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <strong>{user.user}</strong>
                <p>Grade: {user.grade}</p>
                {/* Display other user details as needed */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
