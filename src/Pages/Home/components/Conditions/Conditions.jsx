import React from "react";
import "./Conditions.css";
import { Rules } from "../../../../data/publicData";

export default function Conditions() {
  return (
    <section className="conditions">
      <div className="container">
        <div className="title">
          <h1>Must Agree to Our Rules And Regulations</h1>
        </div>
        <div className="rules">
          {Rules.map((data, i) => (
            <div className="rule" key={i}>
              <div className="rule-data">
                <div className="rule-title">{data.title}</div>
                <div className="rule-description">{data.des}</div>
              </div>
              <div className="rule-img">
                <img src={data.img} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
