import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SidebarProvider } from "./Dashboard/context/sidebarContext.tsx";
import { BrowserRouter as Router } from "react-router-dom";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <SidebarProvider>
      <Router>
        <App />
      </Router>
    </SidebarProvider>
  );
}
