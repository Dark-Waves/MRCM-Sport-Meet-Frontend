import { useContext, useEffect, useState } from "react";
import About from "./About/About";
import Hero from "./Hero/Hero";
import Theme from "./Theme/Theme";
import axios from "axios";
import { config } from "../../../config";
import HomeContext from "../../context/HomeContext";
import Houses from "./Houses/Houses";
import "./Main.css";

// const houseData = [
//   { houseName: "Rigel", HouseScore: 50 },
//   { houseName: "Canapus", HouseScore: 60 },
//   { houseName: "Wega", HouseScore: 45 },
//   { houseName: "Anteyas", HouseScore: 54 },
// ];

export default function Main() {
  // Get data from Api from startup
  // const [houseData, setHouseData] = useState([]);
  const { socket, houseData, dispatch } = useContext(HomeContext);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const response = await axios.get(`${config.APIURI}/api/v${config.Version}/houses`);

  //       if (response.data.message === "ok") {
  //         setHouseData(response.data.HouseData);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getData();
  // }, []);

  useEffect(() => {
    socket.on("server-message", (data) => {
      if (data.type === "houseScoreUpdate") {
        const updatedHouseData = data.payload.wsSendHouseData.map(
          (updatedHouse) => {
            const index = houseData.findIndex(
              (house) => house._id === updatedHouse._id
            );

            if (index !== -1) {
              return {
                ...houseData[index],
                houseScore: updatedHouse.houseScore,
              };
            }

            return updatedHouse; // If not found, keep the original object
          }
        );
        dispatch({
          type: "setHouseData",
          payload: updatedHouseData,
        });
      }
    });
  }, [socket, houseData, dispatch]); // Include houseData as a dependency

  return (
    <div className="home-content p-5">
      <Hero houseData={houseData} />
      <Theme />
      {/* <About /> */}
      <Houses houseData={houseData} />
    </div>
  );
}
