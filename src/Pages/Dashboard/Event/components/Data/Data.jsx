import "./Data.css";

export default function EventData({ eventData, defaultLogo }) {
  const EventDetails =
    eventData.WhatToDo ||
    eventData.Rules ||
    eventData.Rules ||
    eventData.Requirements ||
    eventData.SourcesSupply;
  return (
    <div className="selected-event">
      <div className="event-ID">
        <img
          className="img"
          src={eventData.eventPicture ? eventData.eventPicture : defaultLogo}
          style={{ width: "180px", height: "180px", borderRadius: "50%" }}
        />
        <h1 className="name">{eventData.eventName}</h1>
        <h5 className="date">{eventData.startDate}</h5>
        <h5 className="time">{eventData.startTime}</h5>
        <h5 className="status">
          {eventData.started ? "Started" : "Not Started"}
        </h5>
        <h5 className="description">{eventData.description}</h5>
      </div>
      {EventDetails && (
        <div className="event-details">
          {eventData.WhatToDo && (
            <div className="what-t-d details">
              <h4>What To Do</h4>
              <span>{eventData.WhatToDo}</span>
            </div>
          )}
          {eventData.Rules && (
            <div className="rules details">
              <h4>Rules</h4>
              <span>{eventData.Rules}</span>
            </div>
          )}
          {eventData.Requirements && (
            <div className="requirements details">
              <h4>Requirements</h4>
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                hic iste quaerat laborum soluta beatae dolor atque illo quisquam
                repudiandae!
              </span>{" "}
            </div>
          )}
          {eventData.SourcesSupply && (
            <div className="sources details">
              <h4>Sources That We Supply</h4>
              <span>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est,
                quis ipsa. Tempore ipsa eum minus laborum sint illo, sequi
                facere.
              </span>
              <button>Download</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
