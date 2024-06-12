import { Route, Routes } from "react-router";
import "./App.css";
import "./utils/icons";
import Home from "./Home/Home";
import Dashboard from "./Dashboard/Dashboard";
import Auth from "./Auth/Auth";
import Error from "./Components/Error/Error";
import Loader from "./Components/Loader/Loader";
import "./Components/Loader/Loader.css";
import React from "react";

export default function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path={"/*"} element={<Home />} />
          <Route path={"/auth"} element={<Auth />} />
          <Route path={"/dashboard/*"} element={<Dashboard />} />
          <Route path={"/error"} element={<Error />} />
        </Routes>
      </div>
    </>
  );
}
