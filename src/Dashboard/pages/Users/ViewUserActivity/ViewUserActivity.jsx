import React, { useState } from 'react';
import './ViewUserActivity.css'; // CSS file for styling

export default function ViewUserActivity() {
  // Sample user data
  const users = [
    {
      _id: '1',
      userName: 'User1',
      name: 'John Doe',
      eventIDS: ['event1', 'event2'],
    },
    {
      _id: '2',
      userName: 'User2',
      name: 'Jane Smith',
      eventIDS: ['event3', 'event4'],
    },
    // Add more users as needed
  ];

  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="view-user-activity grid-common main-content-holder">
      <h2>View User Activity</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} onClick={() => handleUserSelect(user)}>
            <div className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.userName}</p>
              </div>
              <button>View Activity</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div className="user-activity-details">
          <h3>{selectedUser.name}'s Activity</h3>
          <ul>
            {selectedUser.eventIDS.map((eventId) => (
              <li key={eventId}>
                {/* Render event details for the selected user */}
                Event ID: {eventId}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
