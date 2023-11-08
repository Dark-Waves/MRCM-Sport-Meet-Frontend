import "./Main.css";
import React from "react";
import { config, images } from "../../../../config";
import { Link } from "react-router-dom";
export default function Main({ authenticated }) {
  const backgroundStyle = {
    backgroundImage: `url(${images.Banner})`,
  };
  return (
    <section className="home" style={backgroundStyle}>
      <div className="container flex-col">
        <div className="title">
          <h1>{config.Title}</h1>
        </div>
        <div className="content">
          {authenticated ? (
            <Link to={`/dashboard`}>Dashboard</Link>
          ) : (
            <Link to={`/signup`}>Dashboard</Link>
          )}
        </div>
      </div>
    </section>
  );
}
