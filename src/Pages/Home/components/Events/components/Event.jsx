import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SwiperSlide } from "swiper/react";
import { images } from "../../../../../config";
import { Link } from "react-router-dom";
export default function Event({ event }) {
  return (
    <div className="card-container flex-col">
      <Link
        to={`/dashboard/event/${event._id}`}
        className="hero-image-container"
      >
        <img
          className="hero-image"
          src={event.eventPicture ? event.eventPicture : images.Banner}
          alt="Spinning glass cube"
        />
      </Link>
      <main className="main-content">
        <h1>
          <Link to={`/dashboard/event/${event._id}`}>{event.eventName}</Link>
        </h1>
        <p className="event__des">{event.description}</p>
        <div className="flex-row">
          <div className="User-base">
            <i className="icon">
              <FontAwesomeIcon icon="fa-regular fa-user" />
            </i>
            <h2>{event.userCount.length}</h2>
          </div>
          <div className="time-left">
            <i className="icon">
              <FontAwesomeIcon icon="fa-regular fa-clock" />
            </i>
            <p>{event.startDate}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
