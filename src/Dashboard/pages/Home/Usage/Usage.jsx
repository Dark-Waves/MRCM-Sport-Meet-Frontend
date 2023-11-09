import { iconsImgs } from "../../../utils/images";
import "./Usage.css";
import { UsageData } from "../../../data/data";
// import { useState, useEffect } from "react";
// import io from "socket.io-client";

// Setup server usage

const Usage = () => {
  // const [cpuUsage, setCpuUsage] = useState(0);
  // const [memoryUsage, setMemoryUsage] = useState(0);

  // useEffect(() => {
  //   // Connect to the WebSocket server
  //   const socket = io("ws://127.0.0.112:443/home");

  //   // Listen for incoming system usage updates
  //   socket.on("server-message", (data) => {
  //       console.log(data)
  //     const { type, payload } = JSON.parse(data);
  //     console.log(type)
  //     if (type === "systemUsageData") {
  //       const { cpuUsage, memoryUsage } = payload;
  //       setCpuUsage(cpuUsage);
  //       setMemoryUsage(memoryUsage);
  //     }
  //   });

  //   // Cleanup the WebSocket connection on unmount
  //   return () => {
  //     socket.disconnect(cpuUsage, memoryUsage);
  //   };
  // }, []);
  return (
    <div className="grid-one-item grid-common grid-c3">
      {console.log()}
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Server Usage</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>
      <div className="grid-c3-content">
        <div className="grid-chart">
          <div className="chart-vert-value">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          {UsageData.map((Usage) => (
            <div className="grid-chart-bar" key={Usage.id}>
              <div className="bar-wrapper">
                <div
                  className="bar-item1"
                  style={{ height: `${Usage.value1 !== null ? "40%" : ""}` }}
                ></div>
                <div
                  className="bar-item2"
                  style={{ height: `${Usage.value2 !== null ? "60%" : ""}` }}
                ></div>
              </div>
              <span className="grid-hortz-value">Jan</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Usage;
