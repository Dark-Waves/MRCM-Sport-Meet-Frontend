import React from "react";
import BanUsers from "./BanUsers/BanUsers";
import ViewUserActivity from "./ViewUserActivity/ViewUserActivity";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";

export default function Users() {
  return (
    <div className="Users main-content-holder">
      {/* <ViewUserActivity />
      <BanUsers /> */}
      <Routes>
        <Route index path="/" element={<Overview />} />
        <Route path="Activity" element={<ViewUserActivity />} />
        <Route path="Ban" element={<BanUsers />} />
      </Routes>
    </div>
  );
}
