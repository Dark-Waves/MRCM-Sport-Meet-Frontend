import { top_broadcast } from "../../../data/data";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { iconsImgs } from "../../../utils/images";
import "./Broadcast.css";

const Broadcast = () => {
  return (
    <div className="subgrid-two-item grid-common grid-c5">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Top Broadcast Messages</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>
      <div className="grid-c5-content">
        <div className="grid-items">
          {top_broadcast.map((messages) => (
            <div className="grid-item" key={messages.id}>
              <div className="grid-item-l">
                <div
                  className={messages.success ? "icon success" : "icon warn"}
                >
                  <FontAwesomeIcon
                    icon={
                      messages.success
                        ? "fa-regular fa-square-check"
                        : "fa-solid fa-circle-exclamation"
                    }
                  />
                </div>
                <p className="text text-silver-v1">
                  {messages.title} <span>{messages.due_date}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Broadcast;
