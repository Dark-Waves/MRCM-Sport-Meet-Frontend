import { iconsImgs } from "../../../utils/images";
import { AdminDetails } from "../../../data/data";
import "./Intro.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Intro = () => {
  return (
    <div className="grid-one-item grid-common grid-c1">
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Dashboard</h3>
            <button className="grid-c-title-icon">
            <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
        <div className="grid-c1-content flex-col">
          <h3 className="title">Wellcome  {AdminDetails.name}</h3>
          <p className="content paragraph">Hello! Admin 
          <span> You Can Optimise the client site with this Admin panel. Have a good day!</span></p>
          <button type="button" className="button">Help</button>
        </div>
    </div>
  )
}

export default Intro
