import { useEffect, useState } from "react";
// import img from "../../../../public/logo/logo.png"
import "./Hero.css";
import { Link } from "react-router-dom";

export default function Hero({ houseData }) {
  const highestScore = Math.max(...houseData.map((data) => data.HouseScore));

  const getScoreHeight = function (score) {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };
  return (
    <div className="hero">
      <div className="left-content">
        <div className="house-overview m-b-4">
          {houseData.map((data, index) => (
            <div className="House__Container w-full" key={index}>
              <div className="House__box flex-col-center">
                <h3 className="House__Name font-lg font-weight-600">
                  {data.houseName}
                </h3>
                <span className="House__Score font-xl font-weight-700">
                  {data.HouseScore}
                </span>
              </div>

              <div className="House_Chart__Container flex-col-center flex-start">
                <div
                  className="House_Chart__Bar"
                  style={{
                    height: getScoreHeight(data.HouseScore),
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
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
        <img src="/logo/logo.png" alt="MRCM LOGO" className="w-90 m-auto" />
      </div>
    </div>
  );
}
