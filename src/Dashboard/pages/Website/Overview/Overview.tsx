import React from "react";
import "./Overview.css";
import { Link } from "react-router-dom";
import { Action, State } from "../Website";

interface OverviewProps extends State {
  dispatch: React.Dispatch<Action>;
}

const Overview: React.FC<OverviewProps> = ({ dispatch }) => {
  // URL of the website you want to display
  const websiteUrl = "http://sport-meet.us.to:81";

  // Handler for preventing click events on the iframe
  const preventClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="overview-container">
      <h2>Overview Page</h2>
      {/* Transparent div overlay to prevent clicks on the iframe */}
        {/* Using iframe to display the content of the website */}
        <iframe
          title="Website Content"
          src={websiteUrl}
          width="100%"
          height="500px"
          frameBorder="0"
          onClick={preventClick}
        />

      <p>
        <Link to="/">Go back to home</Link>
      </p>
    </div>
  );
};

export default Overview;
