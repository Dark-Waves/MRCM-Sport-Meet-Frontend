import React from "react";
import Manager from "./Manager/Manager";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import Controller from "./Controller/Controller";

export default function Events() {
  return (
    <div className="events main-content-holder">
      <div>
        <Routes>
          <Route path="/" index element={<Overview />} />
          <Route path="/Manager" element={<Manager />} />
          <Route path="/Controller" element={<Controller />} />
        </Routes>
      </div>
    </div>
  );
}

