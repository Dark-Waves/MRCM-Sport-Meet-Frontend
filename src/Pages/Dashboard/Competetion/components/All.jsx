import { Link } from "react-router-dom";
import InnerUpdatesLoader from "../../components/Loaders/InnerUpdatesLoader";
import ErrorPage from "../../Error/Error";

export default function All({ status, eventsData, defaultLogo }) {
  return (
    <div>
      {status === "loading" && <InnerUpdatesLoader />}
      {status === "error" && <ErrorPage code={401} />}
      {status === "ready" && eventsData && (
        <div className="box-wrapper">
          {eventsData
            .filter((event) => event)
            .map((event) => (
              <div className="box" key={event._id}>
                <div className="wrapper">
                  <h1>{event.eventName}</h1>
                  <img
                    className="eventPicture"
                    src={
                      event.eventPicture ? event.eventPicture :  defaultLogo 
                    }
                    alt=""
                    width="100em"
                    height="100em"
                  />
                  <div className="data">
                    <div className="venue" id="venue">
                      <h5 id="date">{event.startDate}</h5>
                      <h5 id="time">{event.startTime}</h5>
                    </div>
                  </div>
                  <div className="about">
                    <span>{event.description}</span>
                  </div>
                </div>
                <Link to={"../../event/" + event._id}>
                  <h3>Lets go</h3>
                </Link>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
