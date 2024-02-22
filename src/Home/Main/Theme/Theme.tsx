import React, { useContext } from "react";
import "./Theme.css";
import HomeContext from "../../../context/HomeContext";
import { State } from "../../Home";

const Theme: React.FC = () => {
  const { houseData, homeData }: State = useContext(HomeContext);

  return (
    <div className="school-theme w-full m-t-8 p-t-8 flex-col-center">
      <h1 className="font-xl font-weight-700 text-center">
        Eclipsing Excellence: Modernizing Mahinda Rajapaksha College Matara
        Sports Meet
      </h1>
      <div className="content">
        <img
          src={
            homeData?.find((data) => data.type === "ThemeImage")?.value.url
              ? homeData?.find((data) => data.type === "ThemeImage")?.value.url
              : "/assets/theme.jpg"
          }
          alt="theme"
          className="w-50 p-4"
        />
        <span className="des font-md m-auto text-center p-4 w-50">
          {homeData?.find((data) => data.type === "ThemeText")?.value.contnet
            ? homeData?.find((data) => data.type === "ThemeText")?.value.contnet
            : `"Eclipsing Excellence" symbolizes our commitment to surpassing past
        achievements and reaching new heights in the sporting arena. As we
        embark on the journey of 'Modernizing Mahinda Rajapaksha College Matara
        Sports Meet,' our focus is on innovation, inclusivity, and embracing the
        latest advancements in sports management technology. This theme reflects
        our dedication to providing a contemporary and streamlined experience
        for participants, staff, and spectators alike. Through cutting-edge
        systems, real-time updates, and seamless event coordination, we aim to
        set a new standard for efficiency and excitement in our school sports
        meet. Join us in this modernization effort as we elevate the sports meet
        experience at Mahinda Rajapaksha College Matara to unprecedented levels
        of excellence!`}
        </span>
      </div>
    </div>
  );
};
export default Theme;
