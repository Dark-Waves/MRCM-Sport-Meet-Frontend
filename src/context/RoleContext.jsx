import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [role, setRole] = useState({});

  //   useEffect(() => {
  //     const token = localStorage.getItem("authToken");
  //   }, []);

console.log(user)

  return (
    <RoleContext.Provider value={{ user, setUser, role }}>
      {children}
    </RoleContext.Provider>
  );
};
