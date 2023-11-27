import { useEffect } from "react";
import About from "./About/About";
import Hero from "./Hero/Hero";
import Theme from "./Theme/Theme";
import axios from "axios";

const houseData = [
  { houseName: "Rigel", HouseScore: 50 },
  { houseName: "Canapus", HouseScore: 60 },
  { houseName: "Wega", HouseScore: 45 },
  { houseName: "Anteyas", HouseScore: 54 },
];

export default function Main() {

  // Get data from Api from startup

  useEffect(()=> {
    const getData = async ()=> {
const responce = await axios.get()
    }
  },[])

  return (
    <div className="home-content p-5">
      <Hero houseData={houseData} />
      <Theme />
      <About />
    </div>
  );
}
