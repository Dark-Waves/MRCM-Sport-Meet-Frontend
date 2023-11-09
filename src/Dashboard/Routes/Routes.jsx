import "./Routes.css";
import ContentTop from "../components/ContentTop/ContentTop"; // Heading
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// Route Pages
import Home from "../pages/Home/Home";
import Events from "../pages/Events/Events";
import Broadcast from "../pages/Broadcast/Broadcast";
import Users from "../pages/Users/Users";
import Website from "../pages/Website/Website";

const Content = () => {
  return (
    <div className="Dashboard main-content">
      <ContentTop />
      <Routes>
        <Route index path="/home" element={<Home />} />
        <Route path="/events/*" element={<Events />} />
        <Route path="/broadcast" element={<Broadcast />} />
        <Route path="/user/*" element={<Users />} />
        <Route path="/website/*" element={<Website />} />
        <Route path="/" element={<Navigate to={"/dashboard/home"} />} />
      </Routes>
    </div>
  );
};

export default Content;
