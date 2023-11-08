import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "./Account.css";
import InputElement from "../Common/InputElement";
import Changes from "../Common/Changes";
import dayjs from "dayjs";
import Picture from "../Common/pictureElement";
import { config, images } from "../../../../../config";

const initialValue = { profile: null, changedElements: {} };
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

export default function Account({
  profile: profileDashboard,
  socket,
  defaultLogo,
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
  const handleInputChange = function (element, value) {
    dispatch({ type: "onChange", payload: { data: value, element } });
  };
  const handleSubmit = async function () {
    try {
      let { data = null } = await axios.post(`/api/profile/setData`, {
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
      className="tab-pane active"
      id="account"
      role="tabpanel"
      aria-labelledby="account-tab"
    >
      {profile && (
        <>
          <h3 className="mb-4">Account Settings</h3>
          <div className="profilePicDiv">
            <img
              src={images.ProfileBannner}
              alt="Image"
              className="backgroundImage"
            />
            <Picture
              id="profilePicture"
              value={profile.profilePicture}
              handleInputChange={handleInputChange}
              defaultPicture={defaultLogo}
            ></Picture>
          </div>

          <form className="input-form">
            <InputElement
              id="name"
              name={"Name"}
              value={profile.name}
              handleInputChange={handleInputChange}
            />
            <InputElement
              id="userName"
              name={"User name"}
              value={profile.userName}
              handleInputChange={handleInputChange}
            />
            <InputElement
              id="Email"
              name={"Email"}
              value={profile.Email}
              handleInputChange={handleInputChange}
            />
            <InputElement
              id="school"
              name={"School"}
              value={profile.school}
              handleInputChange={handleInputChange}
            />
            <InputElement
              id="phoneNo"
              name={"Phone number"}
              value={profile.phoneNo}
              handleInputChange={handleInputChange}
            />
            <InputElement
              id="bio"
              name={"Bio"}
              rows="4"
              value={profile.bio}
              handleInputChange={handleInputChange}
            />
          </form>

          <Changes
            changedElements={changedElements}
            profileDashboard={profileDashboard}
            dispatch={dispatch}
            customFunction={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
