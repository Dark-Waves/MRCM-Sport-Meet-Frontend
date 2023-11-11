import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SidebarProvider } from "./Dashboard/context/sidebarContext.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <RoleProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </RoleProvider>
  </SidebarProvider>
);
