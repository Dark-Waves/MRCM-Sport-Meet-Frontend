import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@mui/material";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DashboardContext from "../../../../context/DashboardContext";
import axios from "axios";
import { config } from "../../../../../config";
import "./Houses.css";
import { decrypt } from "../../../../utils/aes";

interface HouseData {
  _id: number;
  houseScore: number;
  Name: string;
}

const Houses: React.FC = () => {
  const { socket } = useContext(DashboardContext);
  const [houseData, setHouseData] = useState<HouseData[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) return; // Skip fetching if data has been fetched or loading is false
    const getData = async () => {
      try {
        const response = await axios.get(`${config.APIURI}/api/v${config.Version}/houses`);
        const data = decrypt(response.data)
        if (data.message === "ok") {
          let dummyHouseData: HouseData[] = [];
          for (let house of data.HouseData) {
            dummyHouseData.push({
              _id: house._id,
              houseScore: house.houseScore,
              Name: house.Name,
            });
          }
          setHouseData(dummyHouseData);
          setIsLoading(false);
        }
        console.log(data.HouseData);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    getData();
  }, [isLoading]);

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

            return updatedHouse;
          }
        );
        setHouseData(updatedHouseData);
      }
    });
  }, [socket, houseData]);

  const highestScore = Math.max(...houseData.map((data) => data.houseScore));
  const getScoreHeight = (score: number) => {
    const scorePercentage = (score / highestScore) * 100;
    return `${scorePercentage}%`;
  };

  const renderVerticalChartValues = (highestScore: number) => {
    if (highestScore === 0) {
      return <span>0</span>; // Render a single span with value 0 if highestScore is 0
    }

    const maxVerticalValue = highestScore;
    const step = maxVerticalValue / 4;
    const values: JSX.Element[] = [];

    for (let i = maxVerticalValue; i >= 0; i -= step) {
      const element = <span key={i}>{Math.ceil(i)}</span>;
      values.push(element);
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
        {isLoading ? (
          <div className="grid-chart">
            <div className="chart-vert-value">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} variant="text" width={40} />
              ))}
            </div>
            {[...Array(4)].map((_, index) => (
              <div className="grid-chart-bar" key={index}>
                <div className="bar-wrapper">
                  <Skeleton variant="rectangular" width={40} height={"100%"} />
                </div>
                <span className="grid-hortz-value flex-center">
                  <Skeleton variant="text" width={"50%"} />
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-chart">
            <div className="chart-vert-value">
              {renderVerticalChartValues(highestScore)}
            </div>
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
        )}
      </div>
    </div>
  );
};

export default Houses;
