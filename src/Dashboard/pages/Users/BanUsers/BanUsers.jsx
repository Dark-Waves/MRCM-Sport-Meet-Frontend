import React from 'react';
import './BanUsers.css'; // CSS file for styling

export default function BanUsers() {
  // Sample user data
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

  const handleBanUser = (userId) => {
    // Implement the logic to ban the user with the provided userId
    console.log(`Banning user with ID: ${userId}`);
  };

  return (
    <div className="ban-users main-content-holder grid-common">
      <h2>Ban Users</h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id}>
            <div className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.userName}</p>
              </div>
              <button onClick={() => handleBanUser(user._id)}>Ban User</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
