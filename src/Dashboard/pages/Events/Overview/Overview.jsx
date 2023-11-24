import React from "react";
// import { events } from "../../../data/data";

export default function Overview({ allEvents }) {
  return (
    <div className="event-overview content-grid-one main-content-holder">
      {allEvents.map((event) => (
        <div className="grid-common card flex-col" key={event.id}>
          <div className="card-content flex-col">
            <h3 className="card-title">{event.title}</h3>
            <p className="card-description">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
