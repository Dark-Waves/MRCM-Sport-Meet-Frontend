import React, { useState } from "react";
import "./Contact.css";
import InputElement from "../Common/InputElement";
import { Link } from "react-router-dom";
export default function Contact() {
  const [contactInputs, setContactInputs] = useState({
    fName: undefined,
    lName: undefined,
    message: undefined,
    email: undefined,
  });
  const handleInputChange = function (id, value) {
    setContactInputs((c) => {
      return { ...c, [id]: value };
    });
  };
  return (
    <section className="contact">
      <div className="container">
        <div className="left">
          <div className="form-wrapper">
            <div className="contact-heading">
              <h1>
                Let's work together<span>.</span>
              </h1>
              <p className="text">
                Or reach us via :
                <Link to={`mailto:darkwavesofc4@gmail.com`}>
                  darkwavesofc4@gmail.com
                </Link>
              </p>
            </div>
            <form action="index.html" method="post" className="contact-form">
              <InputElement
                id={"fName"}
                value={contactInputs.fName}
                handleInputChange={handleInputChange}
                rows={1}
                name={"First Name"}
              >
                <i className="icon fa-solid fa-address-card"></i>
              </InputElement>
              <InputElement
                id={"lName"}
                value={contactInputs.lName}
                handleInputChange={handleInputChange}
                rows={1}
                name={"Last Name"}
              >
                <i className="icon fa-solid fa-address-card"></i>
              </InputElement>
              <InputElement
                id={"email"}
                value={contactInputs.email}
                handleInputChange={handleInputChange}
                rows={1}
                name={"Email"}
              >
                <i className="icon fa-solid fa-envelope"></i>
              </InputElement>
              <InputElement
                id={"message"}
                value={contactInputs.message}
                handleInputChange={handleInputChange}
                rows={4}
                name={"Message"}
              >
                <i className="icon fa-solid fa-inbox"></i>
              </InputElement>

              <div className="contact-buttons">
                <button className="btn upload">
                  <span>
                    <i className="fa-solid fa-paperclip"></i> Add attachement
                  </span>
                  <input type="file" name="attachement" />
                </button>
                <input type="submit" value="Send message" className="btn" />
              </div>
            </form>
          </div>
        </div>
        <div className="rignt"></div>
      </div>
    </section>
  );
}
