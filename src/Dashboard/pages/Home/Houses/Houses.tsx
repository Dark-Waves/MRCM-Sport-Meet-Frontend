import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DashboardContext from "../../../../context/DashboardContext";
import "./Houses.css";
import { UsageData } from "../../../data/data";
import axios from "axios";
import { config } from "../../../../../config";

interface HouseData {
  _id: number;
  houseScore: number;
  Name: string;
}

const Houses: React.FC = () => {
  const { socket } = useContext(DashboardContext);
  const [houseData, setHouseData] = useState<HouseData[]>([]);

  useEffect(
    function () {
      const getData = async function () {
        try {
          const response = await axios.get(`${config.APIURI}/api/v1/houses`);

          if (response.data.message === "ok") {
            setHouseData(response.data.HouseData);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    },
    [] // Only trigger when profileStatus changes
  );

  useEffect(() => {
    socket.on("server-message", (data) => {
      if (data.type === "houseScoreUpdate") {
        const updatedHouseData = data.payload.wsSendHouseData.map(
          (updatedHouse: HouseData) => {
            const index = houseData.findIndex(
              (house) => house._id === updatedHouse._id
            );

            if (index !== -1) {
              return {
                ...houseData[index],
                houseScore: updatedHouse.houseScore,
              };
            }

            return updatedHouse; // If not found, keep the original object
          }
        );
        setHouseData(updatedHouseData);
      }
    });
  }, [socket, houseData]);

  const highestScore = Math.max(...houseData.map((data) => data.houseScore));
  const getScoreHeight = function (score: number) {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };

  const renderVerticalChartValues = () => {
    const maxVerticalValue = highestScore; // Define your maximum vertical value here
    const step = maxVerticalValue / 4; // Split it into four steps (change as needed)
    const values = [];

    for (let i = maxVerticalValue; i >= 0; i -= step) {
      values.push(<span key={i}>{Math.ceil(i)}</span>);
    }
  
    return values;
  };

  return (
    <div className="grid-one-item grid-common grid-c3">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Houses Status</h3>
        <button className="grid-c-title-icon">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="grid-c3-content">
        <div className="grid-chart">
          <div className="chart-vert-value">{renderVerticalChartValues()}</div>
          {houseData.map((data, index) => (
            <div className="grid-chart-bar" key={index}>
              <div className="bar-wrapper">
                <div
                  className="bar-item1"
                  style={{ height: getScoreHeight(data.houseScore) }}
                ></div>
              </div>
              <span className="grid-hortz-value">{data.Name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Houses;
