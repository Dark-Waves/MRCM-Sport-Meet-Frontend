import React, { useEffect, useState } from "react";
import Manager from "./Manager/Manager";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";
import Controller from "./Controller/Controller";
import Cookies from "js-cookie";
import axios from "axios";
import { config } from "../../utils/config";
import Loader from "../../../Components/Loader/Loader";

export default function Events() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get(`${config.APIURI}/api/v1/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllEvents(data.events);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getEventData();
  }, []); // Add an empty dependency array to run the effect only once

  return (
    <div className="events main-content-holder">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Routes>
            <Route
              path="/"
              index
              element={<Overview allEvents={allEvents} />}
            />
            <Route
              path="/Manager"
              element={
                <Manager allEvents={allEvents} setAllEvents={setAllEvents} />
              }
            />
            <Route path="/Controller" element={<Controller />} />
          </Routes>
        </div>
      )}
    </div>
  );
}
