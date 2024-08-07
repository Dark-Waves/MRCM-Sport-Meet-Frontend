import React, { useContext, useEffect, useState } from "react";
import "./HouseScores.css";
import HomeContext from "../../context/HomeContext";

const HouseScores: React.FC = () => {
  const { state } = useContext(HomeContext);

  if (!state.houseData) return;
  const highestScore = Math.max(...state.houseData.map((data) => data.houseScore));
  const getScoreHeight = function (score: number) {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };
  return (
    <div
      className="house-scores p-t-8 m-t-8 flex flex-col g-5"
      style={{ height: "10rem" }}
    >
      <div
        className="house-overview m-b-4 bg-white color-white"
        style={{
          width: "100%",
          padding: "4rem",
          zIndex: 1111,
          background: "#93908dc4",
          backdropFilter: "blur(113px)",
          margin: "auto",
          borderRadius: "3rem",
          maxWidth: "94%",
        }}
      >
        {state.houseData.map((data, index) => (
          <div className="House__Container w-full" key={index}>
            <div
              style={{ height: "100%" }}
              className="House_Chart__Container flex-col-center flex-start"
            >
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
    </div>
  );
};

export default HouseScores;
