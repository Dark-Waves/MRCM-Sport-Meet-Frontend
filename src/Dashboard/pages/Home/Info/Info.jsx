import "./Info.css";
import { iconsImgs } from "../../../utils/images";
import { info } from "../../../data/data";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Info = () => {
  return (
    <div className="info grid-two-item grid-common grid-c4">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Info</h3>
        <button className="grid-c-title-icon">
        <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <div className="grid-items">
        {info.map((Info, index) => (
          <div key={index} className="box flex-row-aro grid-c4-content bg-jet">
            <h4 className="title">{Info.title}</h4>
            <span className="count">{Info.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;
