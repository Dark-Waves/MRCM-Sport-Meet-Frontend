import { Navigate, Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Profile.css";
import Account from "./components/Account/Account";
import Settings from "./components/Settings/Settings";
import Password from "./components/Password/Password";
import Devices from "./components/Devices/Devices";
import { useContext, useReducer } from "react";
import DashboardContext from "../Context/DashboardContext";
export default function Profile() {
  const {
    profile,
    themeType,
    socket,
    dispatch: dashboardDispatch,
    defaultLogo,
  } = useContext(DashboardContext);
  return (
    <section className="content active" id="profile">
      <div className="container">
        <div className="profile-container">
          <div className="tab-content" id="tabContent">
            <Routes>
              <Route
                path="account"
                index
                element={
                  <Account
                    profile={profile}
                    socket={socket}
                    defaultLogo={defaultLogo}
                  />
                }
              />
              <Route
                path="devices"
                element={<Devices profile={profile} socket={socket} />}
              />
              <Route
                path="password"
                element={
                  <Password
                    profile={{
                      ...profile,
                      confirmpassword: "",
                      oldPassword: "",
                      newpassowrd: "",
                    }}
                    socket={socket}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <Settings
                    profile={profile}
                    themeType={themeType}
                    socket={socket}
                    dashboardDispatch={dashboardDispatch}
                  />
                }
              />
              <Route path="*" element={<Navigate to={"account"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </section>
  );
}
