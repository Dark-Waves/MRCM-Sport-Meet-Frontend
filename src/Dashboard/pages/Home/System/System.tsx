import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@mui/material";
import "./System.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import DashboardContext from "../../../../context/DashboardContext";

export interface SystemData {
  id: number;
  type: string;
  usage: string;
  data: {
    _id: number;
    title: string;
    amount: string;
  }[];
}

const System: React.FC = () => {

  const { socket } = useContext(DashboardContext);
  const [systemData, setSystemData] = useState<SystemData[]>([]); // Initialize with an empty array

  useEffect(() => {
    const handleServerMessage = (args: any) => {
      if (args.type === "systemInfo") {
        setSystemData(args.payload);
      }
    };

    socket.on("server-message", handleServerMessage);

    return () => {
      socket.off("server-message", handleServerMessage);
    };
  }, [socket]);
  
  return (
    <div className="system subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">System Usage</h3>
        <button className="grid-c-title-icon">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="grid-c6-content position-relative">
        {!systemData ? (
          <div>
            {[...Array(3)].map((_, index) => (
              <div className="grid-item" key={index}>
                <div className="grid-item-top">
                  <div className="grid-item-top-l">
                    <div className="icon avatar img-fit-cover">
                      <Skeleton variant="rectangular" width={40} height={40} />
                    </div>
                    <p className="text text-silver-v1">
                      <Skeleton variant="text" width={80} />
                    </p>
                  </div>
                  <div className="grid-item-top-r">
                    <span className="text-silver-v1">
                      <Skeleton variant="text" width={60} />
                    </span>
                  </div>
                </div>
                <div className="data grid-item-bottom">
                  <div className="grid-item-badges">
                    {[...Array(4)].map((_, index) => (
                      <span className="m-r-3 m-b-3" key={index}>
                        <Skeleton variant="rounded" width={80} />
                      </span>
                    ))}
                  </div>
                  <div>
                    <Skeleton variant="text" width={"100%"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-items">
            {systemData.map((system, index) => (
              <div className="grid-item" key={index}>
                <div className="grid-item-top">
                  <div className="grid-item-top-l">
                    <div className="icon avatar img-fit-cover">
                      {(system.type === "CPU" && (
                        <FontAwesomeIcon icon={["fas", "microchip"]} />
                      )) ||
                        (system.type === "Memory" && (
                          <FontAwesomeIcon icon={["fas", "memory"]} />
                        )) ||
                        (system.type === "Storange" && (
                          <FontAwesomeIcon icon={["fas", "hard-drive"]} />
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
                    {system.data.map((data, index) => (
                      <span className="grid-item-badge" key={index}>
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
        )}
      </div>
    </div>
  );
};

export default System;
