import React, { useContext, useEffect, useState } from "react";
// import img from "../../../../public/logo/logo.png"
import "./Hero.css";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { State } from "../../Home";
import HomeContext from "../../../context/HomeContext";
import { config } from "../../../../config";

const Hero: React.FC = () => {
  const { houseData, homeData }: State = useContext(HomeContext);

  if (!houseData) return;
  const highestScore = Math.max(...houseData.map((data) => data.houseScore));
  const getScoreHeight = function (score: number) {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };
  return (
    <div className="hero p-t-8 m-t-8">
      <div className="left-content">
        <div className="house-overview m-b-4">
          {houseData.map((data, index) => (
            <div className="House__Container w-full" key={index}>
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
          {homeData?.find((data) => data.type === "HeroTitle")?.value.contnet
            ? homeData?.find((data) => data.type === "HeroTitle")?.value.contnet
            : config.SiteName}
        </h1>

      </div>
      <div className="right-content flex-row">
        <img
          src={
            homeData?.find((data) => data.type === "HeroImage")?.value.url
              ? homeData?.find((data) => data.type === "HeroImage")?.value.url
              : "/assets/hero/hero logo.svg"
          }
          alt="MRCM LOGO"
          className="w-90 m-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
