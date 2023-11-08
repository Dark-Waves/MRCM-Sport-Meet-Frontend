// index.js

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./Main.css";
import "./utils/icons.js";
// import Login from "./pages/Login.jsx";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/SignUp";
import Logout from "./pages/Logout/Logout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/Error/Error";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard/*" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="logout" element={<Logout />} />
        <Route path="*" element={<ErrorPage code={404} />} />
      </Routes>
    </Router>
  </StrictMode>
);
