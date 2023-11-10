import React from "react";
// import img from "../../../../public/logo/logo.png"
import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero">
      <div className="left-content">
        <h1 className="font-2xl font-weight-800">
          Modernizing Mahinda Rajapaksha College Matara Sports Meet
        </h1>
        <div className="hero-buttons flex-row g-5">
          <Link
            to={"About"}
            className="hero-btn font-md font-weight-600 rounded-md main-btn"
          >
            About
          </Link>
          <Link
            to={"Live"}
            className="hero-btn font-md font-weight-600 rounded-md second-btn"
          >
            Live
          </Link>
        </div>
      </div>
      <div className="right-content flex-row">
        <img
          src="/logo/logo.png"
          alt="MRCM LOGO"
          className="w-90 m-auto"
        />
      </div>
    </div>
  );
}
