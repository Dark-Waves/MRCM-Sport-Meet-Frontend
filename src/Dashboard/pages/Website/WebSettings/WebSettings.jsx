import React, { useState } from "react";
import "./WebSettings.css";

export default function WebSettings() {
  // State for website settings
  const [settings, setSettings] = useState({
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontSelection: "Arial",
    fontSize: 16,
    copyrightText: "",
    contactInfo: "",
    socialMediaLinks: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    custom404Message: "",
    defaultLanguage: "en",
    smtpServer: "",
    smtpPort: "",
    emailUsername: "",
    customCss: "",
    // Add more settings here
  });

  // Function to update website settings
  const handleSettingsChange = (event) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const saveSettings = (event) => {
    console.log("saved");
  };

  // Function to handle font size change
  const handleFontSizeChange = (event) => {
    const fontSize = parseInt(event.target.value);
    if (!isNaN(fontSize)) {
      setSettings({
        ...settings,
        fontSize: fontSize,
      });
    }
  };

  // Function to handle favicon upload
  const handleFaviconChange = (event) => {
    // Handle favicon upload logic here
  };

  return (
    <div>
      <div className="settings-section">
        <h3>Website Settings</h3>
        <label htmlFor="backgroundColor">Background Color:</label>
        <input
          type="color"
          id="backgroundColor"
          name="backgroundColor"
          value={settings.backgroundColor}
          onChange={handleSettingsChange}
        />
        <label htmlFor="textColor">Text Color:</label>
        <input
          type="color"
          id="textColor"
          name="textColor"
          value={settings.textColor}
          onChange={handleSettingsChange}
        />
      </div>
      <div className="settings-section">
        <h3>Typography Settings</h3>
        <label htmlFor="fontSelection">Select Font:</label>
        <select
          id="fontSelection"
          name="fontSelection"
          value={settings.fontSelection}
          onChange={handleSettingsChange}
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          {/* Add more font options */}
        </select>
        <label htmlFor="fontSize">Font Size (px):</label>
        <input
          type="number"
          id="fontSize"
          name="fontSize"
          value={settings.fontSize}
          onChange={handleFontSizeChange}
        />
      </div>
      <div className="settings-section">
        <h3>Footer Content Settings</h3>
        <label htmlFor="copyrightText">Copyright Text:</label>
        <input
          type="text"
          id="copyrightText"
          name="copyrightText"
          value={settings.copyrightText}
          onChange={handleSettingsChange}
        />
        <label htmlFor="contactInfo">Contact Information:</label>
        <textarea
          id="contactInfo"
          name="contactInfo"
          value={settings.contactInfo}
          onChange={handleSettingsChange}
        ></textarea>
        <label htmlFor="socialMediaLinks">Social Media Links:</label>
        <textarea
          id="socialMediaLinks"
          name="socialMediaLinks"
          value={settings.socialMediaLinks}
          onChange={handleSettingsChange}
        ></textarea>
      </div>
      <div className="settings-section">
        <h3>SEO Settings</h3>
        <label htmlFor="metaTitle">Meta Title:</label>
        <input
          type="text"
          id="metaTitle"
          name="metaTitle"
          value={settings.metaTitle}
          onChange={handleSettingsChange}
        />
        <label htmlFor="metaDescription">Meta Description:</label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          value={settings.metaDescription}
          onChange={handleSettingsChange}
        ></textarea>
        <label htmlFor="metaKeywords">Meta Keywords:</label>
        <textarea
          id="metaKeywords"
          name="metaKeywords"
          value={settings.metaKeywords}
          onChange={handleSettingsChange}
        ></textarea>
      </div>
      <div className="settings-section">
        <h3>404 Page Customization</h3>
        <label htmlFor="custom404Message">Custom 404 Message:</label>
        <textarea
          id="custom404Message"
          name="custom404Message"
          value={settings.custom404Message}
          onChange={handleSettingsChange}
        ></textarea>
      </div>
      <div className="settings-section">
        <h3>Favicon Setting</h3>
        <label htmlFor="faviconUpload" className="upload-label">
          Upload Favicon
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFaviconChange}
          id="faviconUpload"
          className="upload-input"
        />
      </div>
      <div className="settings-section">
        <h3>Language Settings</h3>
        <label htmlFor="defaultLanguage">Default Language:</label>
        <select
          id="defaultLanguage"
          name="defaultLanguage"
          value={settings.defaultLanguage}
          onChange={handleSettingsChange}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          {/* Add more language options */}
        </select>
      </div>
      <div className="settings-section">
        <h3>Email Configuration</h3>
        <label htmlFor="smtpServer">SMTP Server:</label>
        <input
          type="text"
          id="smtpServer"
          name="smtpServer"
          value={settings.smtpServer}
          onChange={handleSettingsChange}
        />
        <label htmlFor="smtpPort">SMTP Port:</label>
        <input
          type="number"
          id="smtpPort"
          name="smtpPort"
          value={settings.smtpPort}
          onChange={handleSettingsChange}
        />
        <label htmlFor="emailUsername">Email Username:</label>
        <input
          type="text"
          id="emailUsername"
          name="emailUsername"
          value={settings.emailUsername}
          onChange={handleSettingsChange}
        />
      </div>
      <div className="settings-section">
        <h3>User Permissions and Role Management</h3>
        {/* Include user permission and role management controls here */}
      </div>
      <div className="settings-section">
        <h3>Custom CSS</h3>
        <label htmlFor="customCss">Custom CSS:</label>
        <textarea
          id="customCss"
          name="customCss"
          value={settings.customCss}
          onChange={handleSettingsChange}
        ></textarea>
      </div>
      <div className="settings-section">
        <h3>Backup and Restore Settings</h3>
        {/* Include backup and restore controls here */}
      </div>

      {/* Add other settings sections here */}
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
}
