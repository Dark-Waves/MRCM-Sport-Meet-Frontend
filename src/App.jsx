import { Route, Routes } from "react-router";
import "./App.css";
import "./utils/icons.js";
import Home from "./Home/Home.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path={"/*"} element={<Home />} />
          <Route path={"/dashboard/*"} element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
}


export default App;
