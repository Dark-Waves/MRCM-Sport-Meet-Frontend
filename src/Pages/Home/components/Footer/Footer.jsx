import React from "react";
import "./Footer.css";
import { images } from "../../../../config";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="wrapper">
          <div className="footer-widget">
            <Link to={"#"}>
              <img src={images.SubLogo} className="logo" />
            </Link>
            <p className="desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
              deserunt magni recusandae ut! Natus?
            </p>
            <ul className="socials">
              <li>
                <Link to={"#"}>
                  <i className="fab fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link to={"#"}>
                  <i className="fab fa-youtube"></i>
                </Link>
              </li>
              <li>
                <Link to={"#"}>
                  <i className="fab fa-instagram"></i>
                </Link>
              </li>
              <li>
                <Link to={"#"}>
                  <i className="fab fa-linkedin-in"></i>
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-widget">
            <h6>Quick Link</h6>
            <ul className="links">
              <li>
                <Link to={"#"}>home</Link>
              </li>
              <li>
                <Link to={"#"}>about</Link>
              </li>
              <li>
                <Link to={"#"}>service</Link>
              </li>
              <li>
                <Link to={"#"}>testimonial</Link>
              </li>
              <li>
                <Link to={"#"}>contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-widget">
            <h6>Services</h6>
            <ul className="links">
              <li>
                <Link to={"#"}>web design</Link>
              </li>
              <li>
                <Link to={"#"}>web development</Link>
              </li>
              <li>
                <Link to={"#"}>seo optimization</Link>
              </li>
              <li>
                <Link to={"#"}>blog writing</Link>
              </li>
            </ul>
          </div>
          <div className="footer-widget">
            <h6>Help &amp; Support</h6>
            <ul className="links">
              <li>
                <Link to={"#"}>support center</Link>
              </li>
              <li>
                <Link to={"#"}>live chat</Link>
              </li>
              <li>
                <Link to={"#"}>FAQ</Link>
              </li>
              <li>
                <Link to={"#"}>terms &amp; conditions</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright-wrapper">
          <p>
            Design and Developed by
            <Link to="#darkwaves" target="blank">
              DarkWaves
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
