import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Devices.css";
import ErrorPage from "../../../Error/Error";
import { config } from "../../../../../config";

const initialValue = { devices: null, status: "loading" };
const reducer = function (state, action) {
  switch (action.type) {
    case "setStatus": {
      return { ...state, status: action.payload };
    }
    case "setDevices": {
      return { ...state, devices: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Devices({ socket, profile }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { devices, status } = state;

  /**Event handler */
  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function (event, { type }) {
        if (event !== "server-message") return;
        switch (type) {
          case "profileUpdated": {
            dispatch({ type: "setProfileStatus", payload: "loading" });
            return;
          }
        }
      };
      socket.onAnyOutgoing(handleSocket);
      return function () {
        socket.offAnyOutgoing(handleSocket);
      };
    },
    [socket, profile]
  );
  /**Getting the data */
  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;
      const getData = async function () {
        if (status !== "loading") return;
        try {
          const { data = null } = await axios.post(
            `/api/profile/getAllLogins`,
            {},
            {
              signal,
            }
          );
          if (data.error) throw new Error(`Unexpected error received`);
          dispatch({ type: "setStatus", payload: "ready" });
          dispatch({ type: "setDevices", payload: data });
        } catch (error) {
          if (error.name === "CanceledError") return;
          dispatch({ type: "setStatus", payload: "error" });
        } finally {
          if (signal.aborted) return;
          dispatch({ type: "setStatus", payload: "ready" });
        }
      };
      getData();
      return function () {
        controller.abort();
      };
    },
    [status]
  );

  const handleLogoutAll = async () => {
    const { data = null } = await axios
      .post(`/api/profile/deleteAllLogins`)
      .catch(() => {});
  };

  const handleLogoutDevice = async (id) => {
    const { data = null } = await axios
      .post(`/api/profile/deleteLogin`, {
        id,
      })
      .catch(() => {});
  };

  return (
    <div
      className="tab-pane fade active"
      id="devices"
      role="tabpanel"
      aria-labelledby="devices-tab"
    >
      <h3 className="profile_title">Devices</h3>
      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <ErrorPage code={403} />}
      {status === "ready" && devices && (
        <div className="devices">
          <span className="device-type">Current Device</span>
          <div className="current-device" id="currentDeviceProfile">
            {devices.currentUser ? (
              <div className="current-device" id="currentDeviceProfile">
                <div className="input-form row" uid="undefined">
                  <div className="col-md-6 device">
                    <div className="device-ico">
                      <i
                        className="fa-solid fa-desktop"
                        id={devices.currentUser.type}
                      ></i>
                    </div>
                    <div className="text-data">
                      <div className="top-text-data">
                        <span className="os" id="os">
                          {devices.currentUser.os.name +
                            " " +
                            devices.currentUser.os.version}
                        </span>
                        <span>.</span>
                        <span className="client" id="client">
                          {devices.currentUser.browserName}
                        </span>
                      </div>
                      <div className="bottom-text-data">
                        <span className="location" id="location">
                          {devices.currentUser.location}
                        </span>
                        <span>.</span>
                        <span className="time" id="time">
                          {devices.currentUser.lastOnline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>No current device information available.</p>
            )}
          </div>
          <span className="device-type">Other Devices</span>
          <div className="other-devices" id="otherDevicesProfile">
            {devices.otherUsers.map((device) => (
              <div className="input-form row" key={device.id} uid={device.id}>
                <div className="col-md-6 device">
                  <div className="device-ico">
                    <i className="fa-solid fa-desktop" id={device.type}></i>
                  </div>
                  <div className="text-data">
                    <div className="top-text-data">
                      <span className="os" id="os">
                        {devices.currentUser.os.name +
                          " " +
                          devices.currentUser.os.version}
                      </span>
                      <span>.</span>
                      <span className="client" id="client">
                        {device.browserName}
                      </span>
                    </div>
                    <div className="bottom-text-data">
                      <span className="location" id="location">
                        {device.location}
                      </span>
                      <span>.</span>
                      <span className="time" id="time">
                        {device.lastOnline}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="remove-device"
                  onClick={() => handleLogoutDevice(device.id)}
                >
                  <i className="fa-solid fa-x"></i>
                </div>
              </div>
            ))}
          </div>
          <div className="devices-btn logout-all">
            <button className="btn btn-light cancel" onClick={handleLogoutAll}>
              Log Out From All Devices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
