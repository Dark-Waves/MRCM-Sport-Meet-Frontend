import { Navigate, Route, Routes } from "react-router-dom";
import ContentTop from "../components/ContentTop/ContentTop"; // Heading
// Import pages
// Ensure these imports match the titles in navigationLinks
import "./Routes.css";
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import Broadcast from "../pages/Broadcast/Broadcast";
import Users from "../pages/Users/Users";
import Website from "../pages/Website/Website";
// ... other page imports

import {  navigationLinks } from "../data/data"; // Assuming this is where your data is
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const getPageComponent = (title) => {
  // Map the title to the corresponding component
  const pages = {
    Home: Home,
    Events: Events,
    Broadcast: Broadcast,
    Users: Users,
    Website: Website,
    // ... map other titles to components
  };

  return pages[title] || null; // Return the component or null if not found
};

const Content = () => {
  const { userRole } = useContext(AuthContext);
  console.log(userRole);
  const roleLinks = navigationLinks[userRole] || []; // Use userRole from context

  const renderRoutes = (links) => {
    return links.map((link) => {
      const PageComponent = getPageComponent(link.title);
      if (!PageComponent) return null; // Skip if no matching component
      console.log(links);
      return (
        <Route key={link.id} path={link.path} element={<PageComponent />} />
        // Note: If subMenu exists, you might want to handle nested routes here
      );
    });
  };

  return (
    <div className="Dashboard main-content">
      {/* Your other components */}
      <ContentTop />

      <Routes>
        {renderRoutes(roleLinks)}
        <Route path="/" element={<Navigate to="/dashboard/home" />} />
      </Routes>
    </div>
  );
};

export default Content;

