import React, { useContext } from "react";
import HomeContext from "../../context/HomeContext";
import { State } from "../Home";

const Events: React.FC = () => {
  const { eventData }: State = useContext(HomeContext);
  console.log(eventData);
  return (
    <div>
      {/* Display houseData or perform operations */}
      Events
    </div>
  );
};

export default Events;
