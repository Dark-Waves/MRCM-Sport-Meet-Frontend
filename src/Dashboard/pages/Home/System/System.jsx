import { iconsImgs } from "../../../utils/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./System.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const System = () => {
  const [systemData, setSystemData] = useState([]);
  const socket = io("ws://localhost:8080/v1/home");
  useEffect(() => {
    socket.on("system-specs", (data) => {
      setSystemData(data); // Update state with received data
      // console.log(data);
    });

    return () => socket.off("system-specs");
  }, [socket]);

  return (
    <div className="system subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">System Usage</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>
      <div className="grid-c6-content">
        <div className="grid-items">
          {systemData.map((system) => (
            <div className="grid-item" key={system.id}>
              <div className="grid-item-top">
                <div className="grid-item-top-l">
                  <div className="icon avatar img-fit-cover">
                    {(system.type === "CPU" && (
                      <FontAwesomeIcon icon="fa-solid fa-microchip" />
                    )) ||
                      (system.type === "Memory" && (
                        <FontAwesomeIcon icon="fa-solid fa-memory" />
                      )) ||
                      (system.type === "Storange" && (
                        <FontAwesomeIcon icon="fa-solid fa-hard-drive" />
                      ))}
                  </div>
                  <p className="text text-silver-v1">{system.type}</p>
                </div>
                <div className="grid-item-top-r">
                  <span className="text-silver-v1">{system.usage}</span>
                </div>
              </div>
              <div className="data grid-item-bottom">
                <div className="grid-item-badges">
                  {system.data.map((data) => (
                    <span className="grid-item-badge" key={data._id}>
                      {data.title} - {data.amount}
                    </span>
                  ))}
                </div>
                <div className="grid-item-progress">
                  <div
                    className="grid-item-fill"
                    style={{ width: system.usage }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default System;
