import { useContext, useEffect, useState } from "react";
import About from "./About/About";
import Hero from "./Hero/Hero";
import Theme from "./Theme/Theme";
import axios from "axios";
import { config } from "../../../config";
import HomeContext from "../../context/HomeContext";
import Houses from "../Houses/Houses";

// const houseData = [
//   { houseName: "Rigel", HouseScore: 50 },
//   { houseName: "Canapus", HouseScore: 60 },
//   { houseName: "Wega", HouseScore: 45 },
//   { houseName: "Anteyas", HouseScore: 54 },
// ];

export default function Main() {
  // Get data from Api from startup
  const [houseData, setHouseData] = useState([]);
  const { socket } = useContext(HomeContext);

  useEffect(() => {
    const getData = async () => {
      try {
        const responce = await axios.get(`${config.APIURI}/api/v1/houses`);

        if (responce.data.message === "ok") {
          setHouseData(responce.data.HouseData);
        }
        console.log(responce.data.HouseData);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    socket.on("server-message", (data) => {
      if (data.type === "houseScoreUpdate") {
        console.log(data.payload);
        setHouseData(data.payload);
      }
    });
  }, [socket]);

  return (
    <div className="home-content p-5">
      <Hero houseData={houseData} />
      <Theme />
      <About />
      <Houses houseData={houseData} />
    </div>
  );
}
