import React, { useContext } from "react";
import HomeContext from "../../context/HomeContext";
import { State } from "../Home";

const Houses: React.FC = () => {
  const { houseData }: State = useContext(HomeContext);
  console.log(houseData);
  return (
    <div>
      {/* Display houseData or perform operations */}
      Houses
    </div>
  );
};

export default Houses;
