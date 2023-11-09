import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SidebarProvider } from "./Dashboard/context/sidebarContext.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <Router>
      <App />
    </Router>
  </SidebarProvider>
);
