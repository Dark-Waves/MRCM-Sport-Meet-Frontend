import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./Password.css";
import InputElement from "../Common/InputElement";
import Changes from "../Common/Changes";
import dayjs from "dayjs";
import { config } from "../../../../../config";

const initialValue = {
  changedElements: {},
  status: "loading",
  profile: null,
};
const reducer = function (state, action) {
  switch (action.type) {
    case "setProfile": {
      return { ...state, profile: action.payload };
    }
    case "onChange": {
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.payload.element]: action.payload.data,
        },
      };
    }
    case "setChanged": {
      return { ...state, changedElements: action.payload };
    }
    default:
      return new Error("method not found");
  }
};

export default function Password({
  dashboardDispatch,
  profile: profileDashboard,
  socket,
}) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const { profile, changedElements } = state;

  useEffect(
    function () {
      if (!profile) {
        dispatch({ type: "setProfile", payload: profileDashboard });
        return;
      }
      const changedKeys = {};
      for (const [key, value] of Object.entries(profile)) {
        if (profileDashboard[key] !== value) changedKeys[key] = profile[key];
      }
      dispatch({ type: "setChanged", payload: changedKeys });
    },
    [profile, profileDashboard]
  );
  useEffect(
    function () {
      if (!socket) return;
      const handleSocket = async function (event, { type }) {
        if (event !== "server-message") return;
        switch (type) {
          case "profileUpdated": {
            dispatch({ type: "setProfile", payload: null });
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
  const handleInputChange = function (element, e) {
    dispatch({ type: "onChange", payload: { data: e, element } });
  };
  const handleSubmit = async function () {
    try {
      let { data = null } = await axios.post(`/api/profile/setPassword`, {
        ...changedElements,
      });
      if (data.error) throw new Error(data.message);
    } catch (error) {
      socket &&
        socket.emit("server-message", {
          type: "notificationUpdate",
          payload: {
            success: false,
            save: false,
            message: {
              timestamp: dayjs().valueOf(),
              message: error.message,
              path: `/dashboard/profile/password`,
            },
          },
        });
    }
  };
  return (
    <div
      className="tab-pane fade active"
      id="password"
      role="tabpanel"
      aria-labelledby="password-tab"
    >
      {profile && (
        <>
          <h3 className="profile_title">Password Settings</h3>
          <form>
            <div className="input-form row">
              <InputElement
                id="oldPassword"
                name={"Old password"}
                value={profile.oldPassword}
                handleInputChange={handleInputChange}
              />
              <InputElement
                id="newpassowrd"
                name={"New password"}
                value={profile.newpassowrd}
                handleInputChange={handleInputChange}
              />
              <InputElement
                id="confirmpassword"
                name={"Confirm passowrd"}
                value={profile.confirmpassword}
                handleInputChange={handleInputChange}
              />
            </div>
          </form>
        </>
      )}
      <Changes
        changedElements={changedElements}
        profileDashboard={profileDashboard}
        dispatch={dispatch}
        dashboardDispatch={dashboardDispatch}
        customFunction={handleSubmit}
      />
    </div>
  );
}
