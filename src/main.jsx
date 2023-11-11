import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SidebarProvider } from "./Dashboard/context/sidebarContext.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </SidebarProvider>
);
