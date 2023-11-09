import React, { useState, useEffect } from "react";
import "./Website.css";
import WebSettings from "./WebSettings/WebSettings";
import WebContent from "./WebContent/WebContent";
import Configuration from "./Configuration/Configuration";
import { Route, Routes } from "react-router-dom";
import Overview from "./Overview/Overview";

export default function Website() {
  // Define the props for the Overview component
  const websiteSettings = {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    // Add more website settings here
  };

  const contentSettings = {
    siteName: "Your Site Name",
    logo: "Logo URL",
    bannerText: "Banner Text",
    bannerImage: "Banner Image URL",
    textColor: "#333333",
    headingFont: "Arial",
    headingFontSize: 24,
    paragraphFont: "Arial",
    paragraphFontSize: 16,
    showComments: true,
    showSocialSharing: true,
    // Add more content settings here
  };

  return (
    <div className="website main-content-holder">

      <Routes>
        {/* Pass the overviewProps as props to the Overview component */}
        <Route
          path="/"
          index
          element={
            <Overview
              websiteSettings={websiteSettings}
              contentSettings={contentSettings}
            />
          }
        />
        <Route path="Content" element={<WebContent />} />
        <Route path="Settings" element={<WebSettings />} />
        <Route path="Configuration" element={<Configuration />} />
      </Routes>
    </div>
  );
}
