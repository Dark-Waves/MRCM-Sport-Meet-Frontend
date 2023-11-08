import React from "react";
import "./NavBar.css";

import { Link } from "react-router-dom";
import { NavLinks } from "../../../../data/publicData";
import { config, images } from "../../../../config";
export default function NavBar({ authenticated }) {
  return (
    <header className="innerWidth">
      <div className="content flex-row-bet">
        <Link to={"/"} className="flex-row">
          <img src={images.Logo} alt="" />
          <h1>{config.SiteName}</h1>
        </Link>
        <div className="nav-section">
          <ul>
            {authenticated
              ? NavLinks.logged.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url}>{link.title}</Link>
                  </li>
                ))
              : NavLinks.Nonlogged.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url}>{link.title}</Link>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
