import { createContext, useState, useContext } from 'react';

// Create the context with a default value
export const RoleContext = createContext(null);

// Create a custom hook to use the RoleContext
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Provider component
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('guest'); // default role

  // Function to change the role, could integrate with your auth system
  const changeRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};
