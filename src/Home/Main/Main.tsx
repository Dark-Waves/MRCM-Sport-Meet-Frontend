import React, { useContext, useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import Theme from "./Theme/Theme";
import HomeContext from "../../context/HomeContext";
import Houses from "./Houses/Houses";
import "./Main.css";

const Main: React.FC = () => {
  const { state } = useContext(HomeContext);

  return (
    <div className="home-content p-5">
      <Hero />
      <Theme />
      {/* <About /> */}
      <Houses />
    </div>
  );
};
export default Main;
