import React from "react";
import "./Overview.css";
import { Link } from "react-router-dom";
import { Action, State } from "../Website";

interface OverviewProps extends State {
  dispatch: React.Dispatch<Action>;
}

const Overview: React.FC<OverviewProps> = ({ dispatch }) => {
  return "hi"
  // return (
  //   <div className="overview-section ">
  //     {/* Display website settings */}
  //     <div className="website-settings grid-common">
  //       <h4>Website</h4>
  //       <div className="logo-and-name flex-row">
  //         <p>
  //           <strong>Site Name:</strong> {contentSettings.siteName}
  //         </p>
  //         <p className="website__img flex">
  //           <strong>Website Logo:</strong>{" "}
  //           <img src="/assets/images/person_four.jpg" alt="" />
  //         </p>
  //       </div>

  //       <div className="banner-section">
  //         <p>
  //           <strong>Banner Text:</strong> {contentSettings.bannerText}
  //         </p>
  //         <p className="website__img flex">
  //           <strong>Website Logo:</strong>{" "}
  //           <img
  //             className="banner"
  //             src="/assets/images/person_four.jpg"
  //             alt=""
  //           />
  //         </p>
  //       </div>
  //       <p className="color__view flex-row-start">
  //         <strong>Background Color:</strong> {websiteSettings.backgroundColor}{" "}
  //         <div
  //           className="color__box"
  //           style={{ background: websiteSettings.backgroundColor }}
  //         ></div>
  //       </p>

  //       <p className="color__view flex-row-start">
  //         <strong>Text Color:</strong> {websiteSettings.textColor}
  //         <div
  //           className="color__box"
  //           style={{ background: websiteSettings.textColor }}
  //         ></div>
  //       </p>
  //       {/* Add more website settings */}
  //       <Link to={"./Settings"}>
  //         <button className="btn__website">Edit Website</button>
  //       </Link>
  //     </div>

  //     {/* Display content settings */}
  //     <div className="content-settings grid-common">
  //       <h4>Content Settings</h4>

  //       <p>
  //         <strong>Text Color:</strong> {contentSettings.textColor}
  //       </p>
  //       <p>
  //         <strong>Heading Font:</strong> {contentSettings.headingFont}
  //       </p>
  //       <p>
  //         <strong>Heading Font Size (px):</strong>{" "}
  //         {contentSettings.headingFontSize}
  //       </p>
  //       <p>
  //         <strong>Paragraph Font:</strong> {contentSettings.paragraphFont}
  //       </p>
  //       <p>
  //         <strong>Paragraph Font Size (px):</strong>{" "}
  //         {contentSettings.paragraphFontSize}
  //       </p>
  //       <p>
  //         <strong>Show Comments:</strong>{" "}
  //         {contentSettings.showComments ? "Yes" : "No"}
  //       </p>
  //       <p>
  //         <strong>Show Social Sharing:</strong>{" "}
  //         {contentSettings.showSocialSharing ? "Yes" : "No"}
  //       </p>
  //       <Link to={"./Content"}>
  //         <button className="btn__website">Edit Contents</button>
  //       </Link>
  //       {/* Add more content settings */}
  //     </div>
  //   </div>
  // );
};
export default Overview;
