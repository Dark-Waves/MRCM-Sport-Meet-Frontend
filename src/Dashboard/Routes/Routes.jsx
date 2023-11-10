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

import { user, navigationLinks } from "../data/data"; // Assuming this is where your data is

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
  const roleLinks = navigationLinks[user.role] || []; // Get the links based on the role

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

// import "./Routes.css";
// import ContentTop from "../components/ContentTop/ContentTop"; // Heading
// import {
//   Navigate,
//   Route,
//   BrowserRouter as Router,
//   Routes,
// } from "react-router-dom";

// // Route Pages
// import Home from "../pages/Home/Home";
// import Events from "../pages/Events/Events";
// import Broadcast from "../pages/Broadcast/Broadcast";
// import Users from "../pages/Users/Users";
// import Website from "../pages/Website/Website";
// import { user } from "../data/data";

// const Content = () => {
//   return (
//     <div className="Dashboard main-content">
//       <ContentTop />
//       {/* <Routes>
//         <Route index path="/home" element={<Home />} />
//         <Route path="/events/*" element={<Events />} />
//         <Route path="/broadcast" element={<Broadcast />} />
//         <Route path="/user/*" element={<Users />} />
//         <Route path="/website/*" element={<Website />} />
//         <Route path="/" element={<Navigate to={"/dashboard/home"} />} />
//       </Routes> */}
//       {user.role === "admin" ? (
//         <Routes>
//           <Route index path="/home" element={<Home />} />
//           <Route path="/events/*" element={<Events />} />
//           <Route path="/broadcast" element={<Broadcast />} />
//           <Route path="/user/*" element={<Users />} />
//           <Route path="/website/*" element={<Website />} />
//           <Route path="/" element={<Navigate to={"/dashboard/home"} />} />
//         </Routes>
//       ) : user.role === "staff" ? (
//         <Routes>
//           <Route index path="/home" element={<Home />} />
//           <Route path="/events/*" element={<Events />} />
//           <Route path="/broadcast" element={<Broadcast />} />
//           <Route path="/user/*" element={<Users />} />
//           <Route path="/website/*" element={<Website />} />
//           <Route path="/" element={<Navigate to={"/dashboard/home"} />} />
//         </Routes>
//       ) : (
//         "You Dont Have Acess"
//       )}
//     </div>
//   );
// };

// export default Content;
