import React from "react";
import NavBar from "./NavBar/NavBar";
import Hero from "./Hero/Hero";

export default function Home() {
  return (
    <div className="home p-2">
      <NavBar />
      <div className="content">
        <Hero />
      </div>
    </div>
  );
}
