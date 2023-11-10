import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Content from "./Routes/Routes";

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      <Content />
    </>
  );
}
