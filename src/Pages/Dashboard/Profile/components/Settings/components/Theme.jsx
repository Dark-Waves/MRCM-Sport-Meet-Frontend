import React, { useState } from "react";

export default function Theme({ dashboardDispatch, themeType }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="theme-settings">
      <span>Select a theme</span>

      <div onClick={() => setIsOpen((c) => !c)} className="select">
        <div className="default">{themeType}</div>
      </div>
      {isOpen && (
        <div className={`selection active`}>
          {themeType !== "Light" && (
            <div
              className="light"
              onClick={() => {
                setIsOpen((c) => !c);
                dashboardDispatch({ type: "setThemeType", payload: "Light" });
              }}
            >
              Light
            </div>
          )}
          {themeType !== "Dark" && (
            <div
              className="dark"
              onClick={() => {
                setIsOpen((c) => !c);
                dashboardDispatch({ type: "setThemeType", payload: "Dark" });
              }}
            >
              Dark
            </div>
          )}
          {themeType !== "System" && (
            <div
              className="system"
              onClick={() => {
                setIsOpen((c) => !c);
                dashboardDispatch({
                  type: "setThemeType",
                  payload: "System",
                });
              }}
            >
              System
            </div>
          )}
        </div>
      )}
    </div>
  );
}
