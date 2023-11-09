import React, { useEffect, useState } from "react";
import "./Configuration.css";

export default function Configuration() {
  const [appName, setAppName] = useState("My App");
  const [appDescription, setAppDescription] = useState("This is a sample app.");
  const [allowSocialLogin, setAllowSocialLogin] = useState(true);
  const [requireMultiFactorAuth, setRequireMultiFactorAuth] = useState(false);
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpPort, setSmtpPort] = useState(587);
  const [emailUsername, setEmailUsername] = useState("");
  const [dbHost, setDbHost] = useState("");
  const [dbPort, setDbPort] = useState(3306);
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [isWebsiteRunning, setIsWebsiteRunning] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState([
    "Log entry 1",
    "Log entry 2",
  ]);
  const [performanceData, setPerformanceData] = useState({}); // State for performance data
  const [analyticsData, setAnalyticsData] = useState({}); // State for analytics data

  // Placeholder for performance and analytics data (to be fetched from your tools)
  const performanceDataPlaceholder = {
    responseTime: 120, // ms
    pageLoadTime: 2000, // ms
    // Add more performance metrics here
  };

  const analyticsDataPlaceholder = {
    visitors: 5000,
    pageViews: 15000,
    // Add more analytics data here
  };

  // Function to start the website
  const startWebsite = () => {
    setIsWebsiteRunning(false);
  };

  // Function to stop the website
  const stopWebsite = () => {
    setIsWebsiteRunning(true);
  };

  useEffect(() => {
    // Simulate fetching data (replace with actual API calls)
    setPerformanceData(performanceDataPlaceholder);
    setAnalyticsData(analyticsDataPlaceholder);
  }, []);

  return (
    <div className="config-section grid-common">
      <h3>Configuration Settings</h3>
      {/* General Settings */}
      <div className="setting-section">
        <h4>General Settings</h4>
        <label htmlFor="appName">Application Name:</label>
        <input
          type="text"
          id="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />
        <label htmlFor="appDescription">Application Description:</label>
        <textarea
          id="appDescription"
          value={appDescription}
          onChange={(e) => setAppDescription(e.target.value)}
        ></textarea>
      </div>

      {/* Authentication and Security */}
      <div className="setting-section">
        <h4>Authentication and Security</h4>
        <label>
          Allow Social Login:
          <input
            type="checkbox"
            checked={allowSocialLogin}
            onChange={() => setAllowSocialLogin(!allowSocialLogin)}
          />
        </label>
        <label>
          Require Multi-Factor Authentication:
          <input
            type="checkbox"
            checked={requireMultiFactorAuth}
            onChange={() => setRequireMultiFactorAuth(!requireMultiFactorAuth)}
          />
        </label>
      </div>

      {/* Email Configuration */}
      <div className="setting-section">
        <h4>Email Configuration</h4>
        <label htmlFor="smtpServer">SMTP Server:</label>
        <input
          type="text"
          id="smtpServer"
          value={smtpServer}
          onChange={(e) => setSmtpServer(e.target.value)}
        />
        <label htmlFor="smtpPort">SMTP Port:</label>
        <input
          type="number"
          id="smtpPort"
          value={smtpPort}
          onChange={(e) => setSmtpPort(e.target.value)}
        />
        <label htmlFor="emailUsername">Email Username:</label>
        <input
          type="text"
          id="emailUsername"
          value={emailUsername}
          onChange={(e) => setEmailUsername(e.target.value)}
        />
      </div>

      {/* Database Configuration */}
      <div className="setting-section">
        <h4>Database Configuration</h4>
        <label htmlFor="dbHost">Database Host:</label>
        <input
          type="text"
          id="dbHost"
          value={dbHost}
          onChange={(e) => setDbHost(e.target.value)}
        />
        <label htmlFor="dbPort">Database Port:</label>
        <input
          type="number"
          id="dbPort"
          value={dbPort}
          onChange={(e) => setDbPort(e.target.value)}
        />
        <label htmlFor="dbUsername">Database Username:</label>
        <input
          type="text"
          id="dbUsername"
          value={dbUsername}
          onChange={(e) => setDbUsername(e.target.value)}
        />
        <label htmlFor="dbPassword">Database Password:</label>
        <input
          type="password"
          id="dbPassword"
          value={dbPassword}
          onChange={(e) => setDbPassword(e.target.value)}
        />
      </div>

      {/* Website Control */}
      <div className="setting-section">
        <h4>Website Control</h4>
        <button
          onClick={startWebsite}
          className={`control-button ${isWebsiteRunning ? "" : "disabled"}`}
        >
          Start Website
        </button>
        <button
          onClick={stopWebsite}
          className={`control-button ${isWebsiteRunning ? "disabled" : ""}`}
        >
          Stop Website
        </button>
      </div>

      {/* Console Logs */}
      <div className="setting-section">
        <h4>Console Logs</h4>
        {consoleLogs.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>

      {/* Performance Monitoring */}
      <div className="setting-section">
        <h4>Performance Monitoring</h4>
        {/* Include performance metrics and charts here */}
      </div>
    </div>
  );
}
