import { Route, Routes } from "react-router";
import "./App.css";
import Sidebar from "./Dashboard/components/Sidebar/Sidebar";
import Content from "./Dashboard/Routes/Routes";
import "./utils/icons.js";
import Home from "./Home/Home.jsx";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/dashboard/*"} element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}
function Dashboard() {
  return (
    <>
      <Sidebar />
      <Content />
    </>
  );
}

export default App;
