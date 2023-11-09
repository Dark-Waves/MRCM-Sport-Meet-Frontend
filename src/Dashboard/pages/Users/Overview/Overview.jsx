import React from 'react';
import './Overview.css'; // Create a CSS file for this component

// Sample user data (replace with your actual user data)
const users = [
  {
    _id: '1',
    userName: 'User1',
    name: 'John Doe',
  },
  {
    _id: '2',
    userName: 'User2',
    name: 'Jane Smith',
  },
  // Add more users as needed
];

export default function Overview() {
  return (
    <div className="user-overview grid-common main-content-holder">
      <h1>User Overview</h1>
      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user._id}>
            <h2>{user.name}</h2>
            <p>Username: {user.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
