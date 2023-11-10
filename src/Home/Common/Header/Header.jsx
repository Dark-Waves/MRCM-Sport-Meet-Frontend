import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import { navLinks } from "../../data/landingNav";

export default function Header() {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
      setIsNavVisible(true); // Ensure nav is visible on desktop
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on first render

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <header className=" w-full p-5 position-relative">
      <div className="nav flex-row-bet">
        <h1 className="text-center">
          <Link to="/">MRCM SPORTS</Link>
        </h1>
        {isMobile && (
          <button className="menu-icon" onClick={toggleNav}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        {!isMobile && (
          <div className={`nav-links flex-row g-5`}>
            {navLinks.map((link, index) => (
              <Link to={link.url} key={index}>
                <span className="font-md font-weight-700">{link.name}</span>
              </Link>
            ))}
            <Link to={"/auth"}>
              <span className="font-md font-weight-700 p-3 bg-main rounded-md">
                Admin/Staff
              </span>
            </Link>
          </div>
        )}
      </div>
      {isMobile && (
        <div
          className={`nav-links flex-col-center g-5  ${
            isNavVisible ? "visible " : "hidden"
          } position-relative`}
        >
          {navLinks.map((link, index) => (
            <Link to={link.url} key={index}>
              <span className="font-md font-weight-700">{link.name}</span>
            </Link>
          ))}
          <Link to={"/auth"}>
            <span className="font-md font-weight-700 p-3 bg-main rounded-md">
              Admin/Staff
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
