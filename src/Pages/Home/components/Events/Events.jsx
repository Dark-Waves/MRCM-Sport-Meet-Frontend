import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "./Event.css";
import { useEffect, useReducer } from "react";
import axios from "axios";
import Event from "./components/Event";
const initialValue = {
  status: "loading",
  eventsData: [],
  // loading , error ,ready
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setEventsData": {
      return { ...state, eventsData: action.payload };
    }
    case "modifyEventData": {
      return {
        ...state,
        eventsData: [
          state.eventsData.filter((val) => val._id !== action.payload._id),
          action.payload,
        ],
      };
    }
    case "removeEventData": {
      return {
        ...state,
        eventsData: state.eventsData.filter(
          (val) => val._id !== action.payload
        ),
      };
    }
    default:
      return new Error("method not found");
  }
};

export default function Events() {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { status, eventsData } = state;

  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchEventData = async function () {
        if (status !== "loading") return;
        try {
          const { data = null } = await axios.post(
            "/api/competitions/getEventsPublic",
            {},
            {
              signal,
            }
          );
          if (data.eventsData)
            dispatch({ type: "setEventsData", payload: data.eventsData });
        } catch (error) {
          if (error.name === "CanceledError") return;
          dispatch({ type: "setStatus", payload: "error" });
        } finally {
          if (signal.aborted) return;
          dispatch({ type: "setStatus", payload: "ready" });
        }
      };
      fetchEventData();
      return function () {
        controller.abort();
      };
    },
    [status]
  );

  return (
    <>
      <section className="events">
        {status === "loading" && (
          <div className="loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        {status === "ready" && eventsData && (
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              540: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            navigation
            loop={true}
            pagination={{ clickable: true }}
          >
            {eventsData.map((event) => (
              <SwiperSlide key={event._id}>
                <Event event={event} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
    </>
  );
}
