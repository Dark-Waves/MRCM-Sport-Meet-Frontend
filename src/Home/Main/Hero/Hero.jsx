import { useEffect, useState } from "react";
// import img from "../../../../public/logo/logo.png"
import "./Hero.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

export default function Hero({ houseData }) {
  const highestScore = Math.max(...houseData.map((data) => data.houseScore));
  const getScoreHeight = function (score) {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };
  return (
    <div className="hero p-t-8 m-t-8">
      <div className="left-content">
        <div className="house-overview m-b-4">
          {houseData.map((data, index) => (
            <div className="House__Container w-full" key={data._id}>
              <div className="House_Chart__Container flex-col-center flex-start">
                <div
                  className={`House_Chart__Bar houseType-${index}`}
                  style={{
                    height: getScoreHeight(data.houseScore),
                  }}
                ></div>
              </div>

              <div className={`House__box flex-col-center`}>
                <h3 className="House__Name font-lg font-weight-600">
                  {data.Name}
                </h3>
                <span className="House__Score font-xl font-weight-700">
                  {data.houseScore}
                </span>
              </div>
            </div>
          ))}
        </div>
        <h1 className="font-2xl font-weight-800">
          Modernizing Sports Meet Of Mahinda Rajapaksha College Matara
        </h1>
        <div className="hero-buttons flex-row g-5 m-t-5">
          <Link to={"About"}>
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              About
            </Button>
          </Link>
          <Link to={"Live"}>
            <Button
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                fontSize: 17,
              }}
              variant="text"
              color="inherit"
            >
              Live
            </Button>
          </Link>
        </div>
      </div>
      <div className="right-content flex-row">
        <img
          src="/assets/hero/hero logo.svg"
          alt="MRCM LOGO"
          className="w-90 m-auto"
        />
      </div>
    </div>
  );
}
