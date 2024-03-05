import React from "react";
import "./Overview.css";
import { Link } from "react-router-dom";
import { Action, State } from "../Website";

interface OverviewProps extends State {
  dispatch: React.Dispatch<Action>;
}

const Overview: React.FC<OverviewProps> = ({ dispatch }) => {


  // Handler for preventing click events on the iframe
  const preventClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="overview-container">
      <h2>Overview Page</h2>
      <p>
        <Link to="/">Go back to home</Link>
      </p>
    </div>
  );
};

export default Overview;
