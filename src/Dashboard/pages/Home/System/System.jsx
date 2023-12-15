import { iconsImgs } from "../../../utils/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./System.css";
import Loader from "../../../../Components/Loader/Loader";

const System = ({ systemData }) => {
  return (
    <div className="system subgrid-two-item grid-common grid-c6">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">System Usage</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>
      <div className="grid-c6-content position-relative">
        {systemData.length !== 0 ? (
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
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default System;
