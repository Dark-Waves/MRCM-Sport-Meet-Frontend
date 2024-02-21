import React, { useState } from "react";
import "./WebContent.css";
import { Action, State } from "../Website";
import { Button, styled } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import configJS from "../../../../../config";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface WebContentProps extends State {
  dispatch: React.Dispatch<Action>;
}

const WebContent: React.FC<WebContentProps> = ({ dispatch, homeData }) => {
  // State for content settings
  // const [contentSettings, setContentSettings] = useState(
  //   {
  //     logo: "/assets/images/person_four.jpg", // Logo image URL
  //     siteName: "Dark Waves", // Site name
  //     bannerImage: "/assets/images/person_three.jpg", // Homepage banner image URL
  //     bannerText: "Dark Waves Official", // Homepage banner text
  //     textColor: "#333333",
  //     headingFont: "Arial",
  //     headingFontSize: 24,
  //     paragraphFont: "Arial",
  //     paragraphFontSize: 16,
  //     showComments: true,
  //     showSocialSharing: true,
  //     icons: [{ id: 1, title: "darkwaves", icon: "dark" },{ id: 2, title: "icon 2", icon: "fa-solid" }],
  //     footerText: "CopyRight Dark Waves", // Footer text content
  //     // Add more content-related settings here
  //   },
  //   []
  // );

  // Function to update content settings
  // const handleContentSettingsChange = (event) => {
  //   const { name, value } = event.target;
  //   setContentSettings({
  //     ...contentSettings,
  //     [name]: value,
  //   });
  // };

  // Function to handle logo upload
  const handleLogoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    image_id: string | null | undefined,
    type: string
  ) => {
    if (!event.target.files) {
      return console.log("please uplaod the image");
    }
    const file = event.target.files[0];
    // Handle logo upload logic here
    const formData = new FormData();
    formData.append("logo", file);

    if (image_id) {
      // Send Axios Data with Reaplce the Image
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      axios
        .patch(
          `${configJS.config.APIURI}/api/v${configJS.config.Version}/public/image/${type}`,
          formData,
          config
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      axios
        .post(
          `${configJS.config.APIURI}/api/v${configJS.config.Version}/public/image/${type}`,
          formData,
          config
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      // Create a CDN Path to the IMage
    }
    // Send formData to your API using Axios or fetch
  };

  // Function to handle banner image upload
  const handleBannerImageChange = (event) => {
    // Handle banner image upload logic here
  };

  // Function to handle icon upload
  const handleIconChange = (event, index) => {
    // Handle icon upload logic here
  };

  // Function to save content settings
  const saveContentSettings = () => {
    console.log("saved");
  };

  return (
    <div className="web-content-section grid-common">
      <h3>Website Content Settings</h3>

      {/* Logo and Site Name */}
      <div className="logo-and-name">
        <h3>Site Logo Upload</h3>
        {homeData?.SiteLogo.url ? (
          <img
            src={homeData?.SiteLogo.url}
            alt="Website Logo"
            className="logo"
          />
        ) : (
          "No Image Uplaoded"
        )}
        <div className="logo-upload">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleLogoChange(e, homeData?.SiteLogo.image_id, "homeData")
              }
            />
          </Button>
        </div>
      </div>

      {/* <div className="banner-section">
        <h4>Homepage Banner</h4>
        <img
          src={contentSettings.bannerImage}
          alt="Homepage Banner"
          className="banner-image"
        />
        <div className="banner-image-upload">
          <label htmlFor="banner-image-upload" className="upload-label">
            Upload Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerImageChange}
            id="banner-image-upload"
            className="upload-input"
          />
        </div>
        <input
          type="text"
          placeholder="Banner Text"
          name="bannerText"
          value={contentSettings.bannerText}
          onChange={handleContentSettingsChange}
          className="banner-text-input"
        />
      </div>

      <div className="text-settings">
        <h4>Text and Typography Settings</h4>
        <label htmlFor="textColor">Text Color:</label>
        <input
          type="color"
          name="textColor"
          value={contentSettings.textColor}
          onChange={handleContentSettingsChange}
          className="text-color-input"
        />
        <label htmlFor="headingFont">Heading Font:</label>
        <select
          name="headingFont"
          value={contentSettings.headingFont}
          onChange={handleContentSettingsChange}
          className="font-select"
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <label htmlFor="headingFontSize">Heading Font Size (px):</label>
        <input
          type="number"
          name="headingFontSize"
          value={contentSettings.headingFontSize}
          onChange={handleContentSettingsChange}
          className="font-size-input"
        />
        <label htmlFor="paragraphFont">Paragraph Font:</label>
        <select
          name="paragraphFont"
          value={contentSettings.paragraphFont}
          onChange={handleContentSettingsChange}
          className="font-select"
        >
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <label htmlFor="paragraphFontSize">Paragraph Font Size (px):</label>
        <input
          type="number"
          name="paragraphFontSize"
          value={contentSettings.paragraphFontSize}
          onChange={handleContentSettingsChange}
          className="font-size-input"
        />
      </div>


      <div className="icon-customization">
        <h4>Icon Customization</h4>
        <div className="icon-list">
          {contentSettings.icons.map((icon, index) => (
            <div key={index} className="icon-item">
              <label htmlFor={index}>{icon.title}</label>
              <input
                className="icon-input"
                type="text"
                value={"con"}
                name=""
                id={index}
              />
            </div>
          ))}
        </div>
      </div>


      <div className="comments-and-sharing">
        <h4>Comments and Social Sharing</h4>
        <label>
          Show Comments:
          <input
            type="checkbox"
            name="showComments"
            checked={contentSettings.showComments}
            onChange={handleContentSettingsChange}
          />
        </label>
        <label>
          Show Social Sharing:
          <input
            type="checkbox"
            name="showSocialSharing"
            checked={contentSettings.showSocialSharing}
            onChange={handleContentSettingsChange}
          />
        </label>
      </div>


      <div className="footer-content">
        <h4>Footer Content</h4>
        <label htmlFor="copyrightText">Copyright Text:</label>
        <input
          type="text"
          id="copyrightText"
          name="copyrightText"
          value={contentSettings.copyrightText}
          onChange={handleContentSettingsChange}
        />
        <label htmlFor="contactInfo">Contact Information:</label>
        <textarea
          id="contactInfo"
          name="contactInfo"
          value={contentSettings.contactInfo}
          onChange={handleContentSettingsChange}
        ></textarea>
        <label htmlFor="socialMediaLinks">Social Media Links:</label>
        <textarea
          id="socialMediaLinks"
          name="socialMediaLinks"
          value={contentSettings.socialMediaLinks}
          onChange={handleContentSettingsChange}
        ></textarea>
      </div>

      <div className="import-export">
        <h4>Content Import/Export</h4>
      </div> */}

      {/* Other Content Settings */}
      {/* Include other content-related controls here */}

      <button onClick={saveContentSettings}>Save Content Settings</button>
    </div>
  );
};
export default WebContent;
