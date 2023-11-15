import React from "react";

export default function Loader() {
  return (
    <div
      className="position-absolute h-100 w-100"
      style={{ top: 0, left: 0, zIndex: 1111 }}
    >
      <div className="box-wrap loader wrapper">
        <div className="box one"></div>
        <div className="box two"></div>
        <div className="box three"></div>
        <div className="box four"></div>
        <div className="box five"></div>
        <div className="box six"></div>
      </div>
    </div>
  );
}
