import { useContext, useEffect, useState } from "react";
import Hero from "./Hero/Hero";
import Theme from "./Theme/Theme";
import HomeContext from "../../context/HomeContext";
import Houses from "./Houses/Houses";
import "./Main.css";

export default function Main() {
  const { houseData } = useContext(HomeContext);


  return (
    <div className="home-content p-5">
      <Hero houseData={houseData} />
      <Theme />
      {/* <About /> */}
      <Houses houseData={houseData} />
    </div>
  );
}
