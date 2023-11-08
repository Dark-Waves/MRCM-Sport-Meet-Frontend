import React from "react";
import "./Prizes.css";
import { PrizesData } from "../../../../data/publicData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Prizes() {
  return (
    <section className="prizes">
      <div className="container flex-col">
        <div className="wrapper">
          <div className="title">
            <h1 className="">Prizes That We Given</h1>
          </div>
          <div className="prize-container">
            {PrizesData.map((data, index) => (
              <div className="card" key={index}>
                <div
                  className="img"
                  style={{ backgroundImage: `url(${data.img})` }} // Set background image
                >
                  <div className="save">
                    <FontAwesomeIcon icon="fa-solid fa-tag" />
                  </div>
                </div>
                <div className="text">
                  <p className="h3">{data.title}</p>
                  {data.content.map((contentData, contentIndex) => (
                    <p className="p" key={contentIndex}>
                      {contentData.title}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
